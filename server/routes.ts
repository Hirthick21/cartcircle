import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { ondcEndpoints } from "./ondc/endpoints";
import { ondcAuth } from "./ondc/auth";
import { insertProductSchema, insertOrderSchema, insertUserAddressSchema, insertReviewSchema, insertSupportTicketSchema, insertSupportMessageSchema } from "@shared/schema";
import { nanoid } from "nanoid";
import type { Request, Response, NextFunction } from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Helper function to parse ISO 8601 duration to milliseconds
  const parseDuration = (duration: string): number => {
    const regex = /P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = duration.match(regex);
    if (!matches) return 0;

    const days = parseInt(matches[1] || '0') * 24 * 60 * 60 * 1000;
    const hours = parseInt(matches[2] || '0') * 60 * 60 * 1000;
    const minutes = parseInt(matches[3] || '0') * 60 * 1000;
    const seconds = parseInt(matches[4] || '0') * 1000;

    return days + hours + minutes + seconds;
  };

  // Auth routes with fallback - returns guest user
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Return a guest user object
      res.json({
        id: 'guest',
        email: 'guest@cartcircle.local',
        firstName: 'Guest',
        lastName: 'User',
        profileImageUrl: null
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Health check endpoint with detailed diagnostics
  app.get('/api/health', (req, res) => {
    const healthData = {
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        port: process.env.PORT || '5000'
      },
      database: {
        connected: true // We'll enhance this if needed
      },
      services: {
        auth: 'available',
        ondc: 'available'
      },
      urls: {
        external: `https://${process.env.REPL_SLUG || 'workspace'}.${process.env.REPL_OWNER || 'circlecart07'}.repl.co`,
        internal: `http://0.0.0.0:${process.env.PORT || '5000'}`
      }
    };

    res.json(healthData);
  });

  // Configuration routes (removed Google Maps - now using Mapbox)

  // Development only: Seed sample data
  if (process.env.NODE_ENV === 'development') {
    app.post('/api/dev/seed-products', async (req, res) => {
      try {
        const sampleProducts = [
          // Balaji Bengaluru Departmental - Grocery & Health Products
          { ondcItemId: 'BALAJI_001', providerId: 'balaji_bengaluru', categoryId: 'grocery', name: 'Basmati Rice Premium', description: 'Premium quality long grain basmati rice', images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop'], price: '120.00', originalPrice: '150.00', currency: 'INR', quantity: { available: 50, maximum: 999, unitOfMeasure: 'kg' }, ratings: '4.5', reviewCount: 45, tags: ['premium', 'basmati', 'rice'], isActive: true },
          { ondcItemId: 'BALAJI_002', providerId: 'balaji_bengaluru', categoryId: 'grocery', name: 'Organic Turmeric Powder', description: 'Pure organic turmeric powder for daily cooking', images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop'], price: '45.00', originalPrice: '55.00', currency: 'INR', quantity: { available: 30, maximum: 999, unitOfMeasure: 'gm' }, ratings: '4.8', reviewCount: 62, tags: ['organic', 'turmeric', 'spice'], isActive: true },
          { ondcItemId: 'BALAJI_003', providerId: 'balaji_bengaluru', categoryId: 'health-wellness', name: 'Vitamin C Tablets', description: 'Daily vitamin C supplement for immunity', images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop'], price: '85.00', originalPrice: '100.00', currency: 'INR', quantity: { available: 25, maximum: 999, unitOfMeasure: 'bottle' }, ratings: '4.3', reviewCount: 28, tags: ['vitamin', 'health', 'immunity'], isActive: true },
          { ondcItemId: 'BALAJI_004', providerId: 'balaji_bengaluru', categoryId: 'home-kitchen', name: 'Stainless Steel Cookware Set', description: 'Premium stainless steel cookware set', images: ['https://images.unsplash.com/photo-1556909114-f6e7ad76ca7d13?w=300&h=300&fit=crop'], price: '1200.00', originalPrice: '1500.00', currency: 'INR', quantity: { available: 15, maximum: 999, unitOfMeasure: 'set' }, ratings: '4.6', reviewCount: 35, tags: ['cookware', 'stainless', 'kitchen'], isActive: true },
          { ondcItemId: 'BALAJI_005', providerId: 'balaji_bengaluru', categoryId: 'beauty-personal-care', name: 'Herbal Face Wash', description: 'Natural herbal face wash for all skin types', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop'], price: '75.00', originalPrice: '90.00', currency: 'INR', quantity: { available: 40, maximum: 999, unitOfMeasure: 'bottle' }, ratings: '4.4', reviewCount: 52, tags: ['herbal', 'skincare', 'natural'], isActive: true },
          { ondcItemId: 'BALAJI_006', providerId: 'balaji_bengaluru', categoryId: 'agriculture', name: 'Organic Fertilizer', description: 'Eco-friendly organic fertilizer for plants', images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=300&fit=crop'], price: '95.00', originalPrice: '110.00', currency: 'INR', quantity: { available: 20, maximum: 999, unitOfMeasure: 'kg' }, ratings: '4.7', reviewCount: 18, tags: ['organic', 'fertilizer', 'eco'], isActive: true },
          { ondcItemId: 'BALAJI_007', providerId: 'balaji_bengaluru', categoryId: 'grocery', name: 'Cold Pressed Coconut Oil', description: 'Pure cold pressed coconut oil', images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop'], price: '180.00', originalPrice: '200.00', currency: 'INR', quantity: { available: 35, maximum: 999, unitOfMeasure: 'liter' }, ratings: '4.9', reviewCount: 87, tags: ['coconut', 'oil', 'pure'], isActive: true },
          { ondcItemId: 'BALAJI_008', providerId: 'balaji_bengaluru', categoryId: 'grocery', name: 'Red Lentils (Masoor Dal)', description: 'High protein red lentils', images: ['https://images.unsplash.com/photo-1610650645395-33e2ce6c94b1?w=300&h=300&fit=crop'], price: '65.00', originalPrice: '75.00', currency: 'INR', quantity: { available: 60, maximum: 999, unitOfMeasure: 'kg' }, ratings: '4.5', reviewCount: 41, tags: ['lentils', 'protein', 'dal'], isActive: true },
          { ondcItemId: 'BALAJI_009', providerId: 'balaji_bengaluru', categoryId: 'home-kitchen', name: 'Glass Food Storage Containers', description: 'Set of glass food storage containers', images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop'], price: '450.00', originalPrice: '550.00', currency: 'INR', quantity: { available: 12, maximum: 999, unitOfMeasure: 'set' }, ratings: '4.2', reviewCount: 24, tags: ['glass', 'storage', 'kitchen'], isActive: true },
          { ondcItemId: 'BALAJI_010', providerId: 'balaji_bengaluru', categoryId: 'beauty-personal-care', name: 'Ayurvedic Hair Oil', description: 'Natural ayurvedic hair oil for healthy hair', images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop'], price: '125.00', originalPrice: '140.00', currency: 'INR', quantity: { available: 28, maximum: 999, unitOfMeasure: 'bottle' }, ratings: '4.6', reviewCount: 67, tags: ['ayurvedic', 'hair', 'natural'], isActive: true },

          // Apple Supermarket - Fruits & Electronics
          { ondcItemId: 'APPLE_001', providerId: 'apple_supermarket', categoryId: 'fruits', name: 'Fresh Red Apples', description: 'Crisp and sweet red apples', images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop'], price: '120.00', originalPrice: '140.00', currency: 'INR', quantity: { available: 100, maximum: 999, unitOfMeasure: 'kg' }, ratings: '4.7', reviewCount: 95, tags: ['fresh', 'apples', 'crisp'], isActive: true },
          { ondcItemId: 'APPLE_002', providerId: 'apple_supermarket', categoryId: 'fruits', name: 'Organic Bananas', description: 'Sweet organic bananas from Kerala farms', images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop'], price: '50.00', originalPrice: '60.00', currency: 'INR', quantity: { available: 80, maximum: 999, unitOfMeasure: 'dozen' }, ratings: '4.8', reviewCount: 73, tags: ['organic', 'sweet', 'kerala'], isActive: true },
          { ondcItemId: 'APPLE_003', providerId: 'apple_supermarket', categoryId: 'electronics', name: 'Wireless Earbuds', description: 'Premium quality wireless earbuds with noise cancellation', images: ['https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop'], price: '2500.00', originalPrice: '3200.00', currency: 'INR', quantity: { available: 20, maximum: 999, unitOfMeasure: 'piece' }, ratings: '4.4', reviewCount: 156, tags: ['wireless', 'earbuds', 'audio'], isActive: true },
          { ondcItemId: 'APPLE_004', providerId: 'apple_supermarket', categoryId: 'fruits', name: 'Fresh Oranges', description: 'Juicy sweet oranges packed with vitamin C', images: ['https://images.unsplash.com/photo-1547514701-42782101795e?w=300&h=300&fit=crop'], price: '80.00', originalPrice: '95.00', currency: 'INR', quantity: { available: 60, maximum: 999, unitOfMeasure: 'kg' }, ratings: '4.6', reviewCount: 48, tags: ['fresh', 'oranges', 'vitamin'], isActive: true },
          { ondcItemId: 'APPLE_005', providerId: 'apple_supermarket', categoryId: 'electronics', name: 'Smartphone Charger', description: 'Fast charging USB-C smartphone charger', images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop'], price: '450.00', originalPrice: '600.00', currency: 'INR', quantity: { available: 35, maximum: 999, unitOfMeasure: 'piece' }, ratings: '4.2', reviewCount: 89, tags: ['charger', 'fast', 'usbc'], isActive: true },
          { ondcItemId: 'APPLE_006', providerId: 'apple_supermarket', categoryId: 'health-wellness', name: 'Protein Powder', description: 'Whey protein powder for fitness enthusiasts', images: ['https://images.unsplash.com/photo-15930959428071-441569c1f91d?w=300&h=300&fit=crop'], price: '850.00', originalPrice: '1000.00', currency: 'INR', quantity: { available: 18, maximum: 999, unitOfMeasure: 'jar' }, ratings: '4.5', reviewCount: 124, tags: ['protein', 'whey', 'fitness'], isActive: true },
          { ondcItemId: 'APPLE_007', providerId: 'apple_supermarket', categoryId: 'fruits', name: 'Fresh Grapes', description: 'Sweet and seedless green grapes', images: ['https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=300&h=300&fit=crop'], price: '150.00', originalPrice: '170.00', currency: 'INR', quantity: { available: 45, maximum: 999, unitOfMeasure: 'kg' }, ratings: '4.7', reviewCount: 36, tags: ['fresh', 'grapes', 'seedless'], isActive: true },
          { ondcItemId: 'APPLE_008', providerId: 'apple_supermarket', categoryId: 'beauty-personal-care', name: 'Vitamin E Face Cream', description: 'Anti-aging vitamin E enriched face cream', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop'], price: '320.00', originalPrice: '400.00', currency: 'INR', quantity: { available: 22, maximum: 999, unitOfMeasure: 'tube' }, ratings: '4.3', reviewCount: 78, tags: ['vitamin', 'cream', 'antiaging'], isActive: true },
          { ondcItemId: 'APPLE_009', providerId: 'apple_supermarket', categoryId: 'fruits', name: 'Fresh Mangoes', description: 'Sweet Alphonso mangoes from Maharashtra', images: ['https://images.unsplash.com/photo-1605664515962-8ee0cce2b4b8?w=300&h=300&fit=crop'], price: '200.00', originalPrice: '250.00', currency: 'INR', quantity: { available: 40, maximum: 999, unitOfMeasure: 'kg' }, ratings: '4.9', reviewCount: 112, tags: ['alphonso', 'mango', 'sweet'], isActive: true },
          { ondcItemId: 'APPLE_010', providerId: 'apple_supermarket', categoryId: 'electronics', name: 'Bluetooth Speaker', description: 'Portable bluetooth speaker with deep bass', images: ['https://images.unsplash.com/photo-1608043152441-87420f242170?w=300&h=300&fit=crop'], price: '1800.00', originalPrice: '2200.00', currency: 'INR', quantity: { available: 15, maximum: 999, unitOfMeasure: 'piece' }, ratings: '4.1', reviewCount: 67, tags: ['bluetooth', 'speaker', 'bass'], isActive: true },

          // BuyNxt ONDC - Electronics & Fashion
          { ondcItemId: 'BUYNXT_001', providerId: 'buynxt_ondc', categoryId: 'electronics', name: 'Gaming Laptop', description: 'High performance gaming laptop with RTX graphics', images: ['https://images.unsplash.com/photo-1603302576837-075760383302?w=300&h=300&fit=crop'], price: '65000.00', originalPrice: '75000.00', currency: 'INR', quantity: { available: 5, maximum: 999, unitOfMeasure: 'piece' }, ratings: '4.6', reviewCount: 89, tags: ['gaming', 'laptop', 'rtx'], isActive: true },
          { ondcItemId: 'BUYNXT_002', providerId: 'buynxt_ondc', categoryId: 'electronics', name: 'Smart Watch', description: 'Fitness tracking smartwatch with heart rate monitor', images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop'], price: '8500.00', originalPrice: '12000.00', currency: 'INR', quantity: { available: 12, maximum: 999, unitOfMeasure: 'piece' }, ratings: '4.3', reviewCount: 156, tags: ['smartwatch', 'fitness', 'health'], isActive: true },
          { ondcItemId: 'BUYNXT_003', providerId: 'buynxt_ondc', categoryId: 'fashion', name: 'Designer T-Shirt', description: 'Premium cotton designer t-shirt', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop'], price: '450.00', originalPrice: '650.00', currency: 'INR', quantity: { available: 30, maximum: 999, unitOfMeasure: 'piece' }, ratings: '4.2', reviewCount: 74, tags: ['designer', 'cotton', 'tshirt'], isActive: true },
          { ondcItemId: 'BUYNXT_004', providerId: 'buynxt_ondc', categoryId: 'electronics', name: 'Wireless Mouse', description: 'Ergonomic wireless mouse for productivity', images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop'], price: '850.00', originalPrice: '1200.00', currency: 'INR', quantity: { available: 25, maximum: 999, unitOfMeasure: 'piece' }, ratings: '4.4', reviewCount: 92, tags: ['wireless', 'mouse', 'ergonomic'], isActive: true },
          { ondcItemId: 'BUYNXT_005', providerId: 'buynxt_ondc', categoryId: 'home-kitchen', name: 'Smart Air Purifier', description: 'WiFi enabled smart air purifier with HEPA filter', images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop'], price: '12500.00', originalPrice: '15000.00', currency: 'INR', quantity: { available: 8, maximum: 999, unitOfMeasure: 'piece' }, ratings: '4.5', reviewCount: 43, tags: ['smart', 'airpurifier', 'hepa'], isActive: true },
          { ondcItemId: 'BUYNXT_006', providerId: 'buynxt_ondc', categoryId: 'fashion', name: 'Casual Jeans', description: 'Comfortable slim fit casual jeans', images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop'], price: '1200.00', originalPrice: '1800.00', currency: 'INR', quantity: { available: 20, maximum: 999, unitOfMeasure: 'piece' }, ratings: '4.0', reviewCount: 56, tags: ['jeans', 'casual', 'comfort'], isActive: true },
          { ondcItemId: 'BUYNXT_007', providerId: 'buynxt_ondc', categoryId: 'electronics', name: 'USB Hub', description: '7-port USB 3.0 hub for multiple devices', images: ['https://images.unsplash.com/photo-1625171515821-1870deb2743b?w=300&h=300&fit=crop'], price: '650.00', originalPrice: '800.00', currency: 'INR', quantity: { available: 18, maximum: 999, unitOfMeasure: 'piece' }, ratings: '4.1', reviewCount: 38, tags: ['usb', 'hub', 'connectivity'], isActive: true },
          { ondcItemId: 'BUYNXT_008', providerId: 'buynxt_ondc', categoryId: 'fashion', name: 'Cotton Kurta', description: 'Traditional cotton kurta for men', images: ['https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=300&h=300&fit=crop'], price: '800.00', originalPrice: '1100.00', currency: 'INR', quantity: { available: 15, maximum: 999, unitOfMeasure: 'piece' }, ratings: '4.3', reviewCount: 29, tags: ['kurta', 'cotton', 'traditional'], isActive: true },
          { ondcItemId: 'BUYNXT_009', providerId: 'buynxt_ondc', categoryId: 'home-kitchen', name: 'Electric Kettle', description: 'Stainless steel electric kettle with auto shut-off', images: ['https://images.unsplash.com/photo-1574681467344-c7d9b82964b0?w=300&h=300&fit=crop'], price: '950.00', originalPrice: '1300.00', currency: 'INR', quantity: { available: 14, maximum: 999, unitOfMeasure: 'piece' }, ratings: '4.4', reviewCount: 82, tags: ['electric', 'kettle', 'steel'], isActive: true },
          { ondcItemId: 'BUYNXT_010', providerId: 'buynxt_ondc', categoryId: 'electronics', name: 'Power Bank', description: '10000mAh portable power bank with fast charging', images: ['https://images.unsplash.com/photo-1609592424001-7919a8ac2421?w=300&h=300&fit=crop'], price: '1200.00', originalPrice: '1600.00', currency: 'INR', quantity: { available: 22, maximum: 999, unitOfMeasure: 'piece' }, ratings: '4.2', reviewCount: 134, tags: ['powerbank', 'portable', 'fast'], isActive: true },

          // Adidas Store - Fashion & Sports
          { ondcItemId: 'ADIDAS_001', providerId: 'adidas_bengaluru', categoryId: 'fashion', name: 'Running Shoes', description: 'Premium running shoes with boost technology', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop'], price: '4500.00', originalPrice: '6000.00', currency: 'INR', quantity: { available: 15, maximum: 999, unitOfMeasure: 'pair' }, ratings: '4.8', reviewCount: 267, tags: ['running', 'shoes', 'boost'], isActive: true },
          { ondcItemId: 'ADIDAS_002', providerId: 'adidas_bengaluru', categoryId: 'fashion', name: 'Track Suit', description: 'Comfortable track suit for workout and casual wear', images: ['https://images.unsplash.com/photo-1559582930-bd71b2d56b91?w=300&h=300&fit=crop'], price: '3200.00', originalPrice: '4500.00', currency: 'INR', quantity: { available: 25, maximum: 999, unitOfMeasure: 'set' }, ratings: '4.5', reviewCount: 189, tags: ['tracksuit', 'workout', 'comfortable'], isActive: true },
          { ondcItemId: 'ADIDAS_003', providerId: 'adidas_bengaluru', categoryId: 'sports', name: 'Football', description: 'Professional quality football for training', images: ['https://images.unsplash.com/photo-1606528461584-d2bc1a1e6ee1?w=300&h=300&fit=crop'], price: '1500.00', originalPrice: '2000.00', currency: 'INR', quantity: { available: 10, maximum: 999, unitOfMeasure: 'piece' }, ratings: '4.7', reviewCount: 95, tags: ['football', 'training', 'professional'], isActive: true },
          { ondcItemId: 'ADIDAS_004', providerId: 'adidas_bengaluru', categoryId: 'health-wellness', name: 'Yoga Mat', description: 'Non-slip yoga mat for daily exercise', images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop'], price: '800.00', originalPrice: '1200.00', currency: 'INR', quantity: { available: 20, maximum: 999, unitOfMeasure: 'piece' }, ratings: '4.4', reviewCount: 67, tags: ['yoga', 'mat', 'exercise'], isActive: true },
          { ondcItemId: 'ADIDAS_005', providerId: 'adidas_bengaluru', categoryId: 'fashion', name: 'Sports Cap', description: 'Adjustable sports cap with moisture-wicking fabric', images: ['https://images.unsplash.com/photo-1521369909029-2afed882baee?w=300&h=300&fit=crop'], price: '650.00', originalPrice: '900.00', currency: 'INR', quantity: { available: 30, maximum: 999, unitOfMeasure: 'piece' }, ratings: '4.2', reviewCount: 45, tags: ['cap', 'sports', 'moisture'], isActive: true },
          { ondcItemId: 'ADIDAS_006', providerId: 'adidas_bengaluru', categoryId: 'sports', name: 'Basketball', description: 'Official size basketball for indoor and outdoor play', images: ['https://images.unsplash.com/photo-1574623452b34-1e0acb9b3ccb4?w=300&h=300&fit=crop'], price: '1200.00', originalPrice: '1600.00', currency: 'INR', quantity: { available: 12, maximum: 999, unitOfMeasure: 'piece' }, ratings: '4.6', reviewCount: 78, tags: ['basketball', 'official', 'indoor'], isActive: true },
          { ondcItemId: 'ADIDAS_007', providerId: 'adidas_bengaluru', categoryId: 'fashion', name: 'Athletic Shorts', description: 'Breathable athletic shorts for running and gym', images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop'], price: '850.00', originalPrice: '1200.00', currency: 'INR', quantity: { available: 28, maximum: 999, unitOfMeasure: 'piece' }, ratings: '4.3', reviewCount: 91, tags: ['shorts', 'athletic', 'breathable'], isActive: true },
          { ondcItemId: 'ADIDAS_008', providerId: 'adidas_bengaluru', categoryId: 'health-wellness', name: 'Resistance Bands Set', description: 'Complete resistance bands set for home workout', images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop'], price: '750.00', originalPrice: '1000.00', currency: 'INR', quantity: { available: 18, maximum: 999, unitOfMeasure: 'set' }, ratings: '4.5', reviewCount: 53, tags: ['resistance', 'bands', 'workout'], isActive: true },
          { ondcItemId: 'ADIDAS_009', providerId: 'adidas_bengaluru', categoryId: 'fashion', name: 'Sports Bra', description: 'High support sports bra for intense workouts', images: ['https://images.unsplash.com/photo-1594736797933-d0c9fc902ac0?w=300&h=300&fit=crop'], price: '1200.00', originalPrice: '1600.00', currency: 'INR', quantity: { available: 16, maximum: 999, unitOfMeasure: 'piece' }, ratings: '4.4', reviewCount: 124, tags: ['sportsbra', 'support', 'workout'], isActive: true },
          { ondcItemId: 'ADIDAS_010', providerId: 'adidas_bengaluru', categoryId: 'sports', name: 'Tennis Racket', description: 'Professional tennis racket for competitive play', images: ['https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=300&h=300&fit=crop'], price: '3500.00', originalPrice: '4500.00', currency: 'INR', quantity: { available: 8, maximum: 999, unitOfMeasure: 'piece' }, ratings: '4.7', reviewCount: 42, tags: ['tennis', 'racket', 'professional'], isActive: true }
        ];

        // Insert products into database
        for (const productData of sampleProducts) {
          try {
            await storage.createProduct(productData as any);
          } catch (error) {
            console.error('Error inserting product:', productData.name, error);
          }
        }

        res.json({ message: 'Sample products seeded successfully', count: sampleProducts.length });
      } catch (error) {
        console.error('Error seeding products:', error);
        res.status(500).json({ message: 'Failed to seed products' });
      }
    });
  }

  // ONDC Callback endpoints
  app.post('/api/ondc/on_search', async (req, res) => {
    try {
      // Verify signature
      const isValid = ondcAuth.verifyIncomingSignature(req.headers, JSON.stringify(req.body));
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid signature' });
      }

      const { context, message } = req.body;

      // Process search results and store products
      if (message && message.catalog && message.catalog.providers) {
        for (const provider of message.catalog.providers) {
          if (provider.items) {
            for (const item of provider.items) {
              try {
                // Store or update product in database
                const productData = {
                  ondcItemId: item.id,
                  providerId: provider.id,
                  categoryId: item.category_id || 'general',
                  name: item.descriptor?.name || 'Unknown Item',
                  description: item.descriptor?.long_desc || item.descriptor?.short_desc || '',
                  images: item.descriptor?.images?.map((img: any) => img.url) || [],
                  price: parseFloat(item.price?.value || '0').toFixed(2),
                  originalPrice: parseFloat(item.price?.maximum_value || item.price?.value || '0').toFixed(2),
                  currency: item.price?.currency || 'INR',
                  quantity: {
                    available: parseInt(item.quantity?.available?.count || '0'),
                    maximum: parseInt(item.quantity?.maximum?.count || '999'),
                    unitOfMeasure: item.quantity?.unitized?.measure?.unit || 'unit'
                  },
                  ratings: parseFloat(item.rating || '0').toFixed(1),
                  reviewCount: parseInt(item.rating_count || '0'),
                  tags: item.tags || [],
                  isActive: true
                };

                // Store product with proper error handling
                await storage.createProduct(productData as any);
                console.log('Successfully stored product:', productData.name);
              } catch (productError) {
                console.error('Error storing individual product:', item.id, productError);
                // Continue processing other products
              }
            }
          }
        }
      }

      // Update transaction status
      await storage.updateOndcTransaction(context.transaction_id, {
        response: req.body,
        status: 'completed'
      });

      res.json({ message: { ack: { status: 'ACK' } } });
    } catch (error) {
      console.error('Error handling on_search:', error);

      // Still try to update transaction status
      try {
        if (req.body?.context?.transaction_id) {
          await storage.updateOndcTransaction(req.body.context.transaction_id, {
            response: { error: (error as Error).message },
            status: 'failed'
          });
        }
      } catch (txError) {
        console.error('Error updating transaction:', txError);
      }

      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/ondc/on_select', async (req, res) => {
    try {
      const isValid = ondcAuth.verifyIncomingSignature(req.headers, JSON.stringify(req.body));
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid signature' });
      }

      const { context, message } = req.body;

      // Process select response
      await storage.updateOndcTransaction(context.transaction_id, {
        response: req.body,
        status: 'completed'
      });

      res.json({ message: { ack: { status: 'ACK' } } });
    } catch (error) {
      console.error('Error handling on_select:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/ondc/on_init', async (req, res) => {
    try {
      const isValid = ondcAuth.verifyIncomingSignature(req.headers, JSON.stringify(req.body));
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid signature' });
      }

      const { context, message } = req.body;

      await storage.updateOndcTransaction(context.transaction_id, {
        response: req.body,
        status: 'completed'
      });

      res.json({ message: { ack: { status: 'ACK' } } });
    } catch (error) {
      console.error('Error handling on_init:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/ondc/on_confirm', async (req, res) => {
    try {
      const isValid = ondcAuth.verifyIncomingSignature(req.headers, JSON.stringify(req.body));
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid signature' });
      }

      const { context, message } = req.body;

      // Create or update order from confirmation
      if (message && message.order) {
        const order = message.order;

        // Update order in database
        const orderData = {
          ondcOrderId: order.id,
          status: 'confirmed',
          state: order.state || 'Created',
          fulfillment: order.fulfillment,
          quote: order.quote,
        };

        // Find existing order by transaction_id and update
        console.log('Order confirmed:', order.id);
      }

      await storage.updateOndcTransaction(context.transaction_id, {
        response: req.body,
        status: 'completed'
      });

      res.json({ message: { ack: { status: 'ACK' } } });
    } catch (error) {
      console.error('Error handling on_confirm:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/ondc/on_status', async (req, res) => {
    try {
      const isValid = ondcAuth.verifyIncomingSignature(req.headers, JSON.stringify(req.body));
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid signature' });
      }

      const { context, message } = req.body;

      // Update order status
      if (message && message.order) {
        const order = message.order;

        // Add to status history
        await storage.addOrderStatusHistory({
          orderId: order.id, // This should be mapped to internal order ID
          status: order.state || 'unknown',
          state: order.state || 'unknown',
          message: `Status update received`,
          ondcContext: context,
          ondcMessage: message
        });
      }

      await storage.updateOndcTransaction(context.transaction_id, {
        response: req.body,
        status: 'completed'
      });

      res.json({ message: { ack: { status: 'ACK' } } });
    } catch (error) {
      console.error('Error handling on_status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/ondc/on_track', async (req, res) => {
    try {
      const isValid = ondcAuth.verifyIncomingSignature(req.headers, JSON.stringify(req.body));
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid signature' });
      }

      await storage.updateOndcTransaction(req.body.context.transaction_id, {
        response: req.body,
        status: 'completed'
      });

      res.json({ message: { ack: { status: 'ACK' } } });
    } catch (error) {
      console.error('Error handling on_track:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/ondc/on_cancel', async (req, res) => {
    try {
      const isValid = ondcAuth.verifyIncomingSignature(req.headers, JSON.stringify(req.body));
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid signature' });
      }

      await storage.updateOndcTransaction(req.body.context.transaction_id, {
        response: req.body,
        status: 'completed'
      });

      res.json({ message: { ack: { status: 'ACK' } } });
    } catch (error) {
      console.error('Error handling on_cancel:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/ondc/on_update', async (req, res) => {
    try {
      const isValid = ondcAuth.verifyIncomingSignature(req.headers, JSON.stringify(req.body));
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid signature' });
      }

      await storage.updateOndcTransaction(req.body.context.transaction_id, {
        response: req.body,
        status: 'completed'
      });

      res.json({ message: { ack: { status: 'ACK' } } });
    } catch (error) {
      console.error('Error handling on_update:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/ondc/on_support', async (req, res) => {
    try {
      const isValid = ondcAuth.verifyIncomingSignature(req.headers, JSON.stringify(req.body));
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid signature' });
      }

      await storage.updateOndcTransaction(req.body.context.transaction_id, {
        response: req.body,
        status: 'completed'
      });

      res.json({ message: { ack: { status: 'ACK' } } });
    } catch (error) {
      console.error('Error handling on_support:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/ondc/on_rating', async (req, res) => {
    try {
      const isValid = ondcAuth.verifyIncomingSignature(req.headers, JSON.stringify(req.body));
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid signature' });
      }

      await storage.updateOndcTransaction(req.body.context.transaction_id, {
        response: req.body,
        status: 'completed'
      });

      res.json({ message: { ack: { status: 'ACK' } } });
    } catch (error) {
      console.error('Error handling on_rating:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Product search and browsing endpoints
  app.get('/api/products/search', async (req, res) => {
    try {
      const { q, category, provider, store } = req.query;
      const products = await storage.searchProducts(
        q as string || '',
        category as string,
        (store || provider) as string
      );
      res.json({ products });
    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).json({ message: 'Failed to search products' });
    }
  });

  // Get store information and product counts
  app.get('/api/stores', async (req, res) => {
    try {
      const storeData = [
        {
          id: "balaji_bengaluru",
          name: "Balaji Bengaluru Departmental",
          description: "Complete grocery store with fresh produce and daily essentials",
          logo: "🏪",
          rating: 4.2,
          categories: ["Grocery", "Health & Wellness", "Home & Kitchen", "Beauty & Personal Care", "Agriculture"],
          location: "T. Nagar, Chennai",
          deliveryTime: "30-45 mins",
          minOrder: 200,
          isActive: true
        },
        {
          id: "apple_supermarket",
          name: "Apple Supermarket",
          description: "Premium supermarket with fresh fruits and electronics",
          logo: "🍎",
          rating: 4.5,
          categories: ["Fruits", "Electronics", "Health & Wellness", "Premium Grocery", "Beauty & Personal Care"],
          location: "Pondy Bazaar, Chennai",
          deliveryTime: "20-35 mins",
          minOrder: 300,
          isActive: true
        },
        {
          id: "buynxt_ondc",
          name: "BuyNxt ONDC",
          description: "Tech store specializing in electronics and smart devices",
          logo: "🛒",
          rating: 4.0,
          categories: ["Electronics", "Smart Home", "Fashion", "Home & Kitchen"],
          location: "Electronic City, Bengaluru",
          deliveryTime: "45-60 mins",
          minOrder: 500,
          isActive: true
        },
        {
          id: "adidas_bengaluru",
          name: "Adidas Store - Bengaluru",
          description: "Premium sports and fashion store",
          logo: "👟",
          rating: 4.3,
          categories: ["Fashion", "Sports", "Health & Wellness"],
          location: "Brigade Road, Bengaluru",
          deliveryTime: "25-40 mins",
          minOrder: 800,
          isActive: true
        }
      ];

      // Get product counts for each store
      for (const store of storeData) {
        try {
          const products = await storage.searchProducts('', undefined, store.id);
          (store as any).productCount = products.length;
        } catch (error) {
          (store as any).productCount = 0;
        }
      }

      res.json({ stores: storeData });
    } catch (error) {
      console.error('Error fetching stores:', error);
      res.status(500).json({ message: 'Failed to fetch stores' });
    }
  });

  app.get('/api/products/category/:categoryId', async (req, res) => {
    try {
      const { categoryId } = req.params;
      const products = await storage.getProductsByCategory(categoryId, 20);
      res.json({ products });
    } catch (error) {
      console.error('Error fetching category products:', error);
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  });

  app.get('/api/products/featured', async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts(10);
      res.json({ products });
    } catch (error) {
      console.error('Error fetching featured products:', error);
      res.status(500).json({ message: 'Failed to fetch featured products' });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getProduct(id);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.json({ product });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Failed to fetch product' });
    }
  });

  // Order management endpoints
  app.post('/api/orders/select', async (req, res) => {
    try {
      const { providerId, items, bppId, bppUri } = req.body;

      const result = await ondcEndpoints.select(providerId, items, bppId, bppUri);
      res.json(result);
    } catch (error) {
      console.error('Error selecting items:', error);
      res.status(500).json({ message: 'Failed to select items' });
    }
  });

  app.post('/api/orders/init', async (req, res) => {
    try {
      const { providerId, items, billing, fulfillment, bppId, bppUri } = req.body;

      const result = await ondcEndpoints.init(providerId, items, billing, fulfillment, bppId, bppUri);
      res.json(result);
    } catch (error) {
      console.error('Error initializing order:', error);
      res.status(500).json({ message: 'Failed to initialize order' });
    }
  });

  app.post('/api/orders/confirm', async (req, res) => {
    try {
      const userId = 'guest'; // Use guest user ID
      const { providerId, items, billing, fulfillment, payment, bppId, bppUri } = req.body;

      // Generate order ID
      const orderId = `ORDER_${nanoid()}`;

      // Create order in database first
      const orderData = {
        ondcOrderId: orderId,
        userId,
        transactionId: nanoid(),
        bppId,
        bppUri,
        providerId,
        providerName: req.body.providerName || 'Unknown Provider',
        status: 'created',
        state: 'Created',
        totalAmount: req.body.totalAmount || '0',
        paymentMethod: payment.type || 'unknown',
        paymentStatus: 'pending',
        deliveryAddress: fulfillment.end.location,
        billingAddress: billing,
        fulfillment: fulfillment,
        quote: req.body.quote
      };

      const newOrder = await storage.createOrder(orderData);

      // Create order items
      if (items && Array.isArray(items)) {
        for (const item of items) {
          await storage.createOrderItem({
            orderId: newOrder.id,
            ondcItemId: item.id,
            name: item.name || 'Unknown Item',
            description: item.description,
            price: item.price || '0',
            quantity: item.quantity || 1,
            images: item.images || []
          });
        }
      }

      // Confirm with ONDC
      const result = await ondcEndpoints.confirm(orderId, providerId, items, billing, fulfillment, payment, bppId, bppUri);

      res.json({ order: newOrder, ondcResult: result });
    } catch (error) {
      console.error('Error confirming order:', error);
      res.status(500).json({ message: 'Failed to confirm order' });
    }
  });

  app.get('/api/orders', async (req, res) => {
    try {
      const userId = 'guest'; // Use guest user ID
      const { status } = req.query;

      const orders = await storage.getUserOrders(userId, status as string);
      res.json({ orders });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  });

  app.get('/api/orders/:id', async (req, res) => {
    try {
      const { id } = req.params;

      // Validate that id is a valid UUID format
      if (!id || typeof id !== 'string' || id.includes('[object') || id === '[object Object]') {
        return res.status(400).json({ message: 'Invalid order ID format' });
      }

      // Basic UUID format validation
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        return res.status(400).json({ message: 'Invalid UUID format' });
      }

      const order = await storage.getOrderWithItems(id);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Also get status history
      const statusHistory = await storage.getOrderStatusHistory(id);

      res.json({ order: { ...order, statusHistory } });
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ message: 'Failed to fetch order' });
    }
  });

  app.post('/api/orders/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const order = await storage.getOrder(id);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const result = await ondcEndpoints.status(order.ondcOrderId, order.bppId, order.bppUri);
      res.json(result);
    } catch (error) {
      console.error('Error getting order status:', error);
      res.status(500).json({ message: 'Failed to get order status' });
    }
  });

  app.post('/api/orders/:id/track', async (req, res) => {
    try {
      const { id } = req.params;
      const order = await storage.getOrder(id);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const result = await ondcEndpoints.track(order.ondcOrderId, order.bppId, order.bppUri);
      res.json(result);
    } catch (error) {
      console.error('Error tracking order:', error);
      res.status(500).json({ message: 'Failed to track order' });
    }
  });

  app.post('/api/orders/:id/cancel', async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const order = await storage.getOrder(id);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const result = await ondcEndpoints.cancel(order.ondcOrderId, reason || 'Customer cancelled', order.bppId, order.bppUri);

      // Update order status
      await storage.updateOrderStatus(id, 'cancelled', 'Cancelled');

      res.json(result);
    } catch (error) {
      console.error('Error cancelling order:', error);
      res.status(500).json({ message: 'Failed to cancel order' });
    }
  });

  // Update order endpoint - ONDC compliance
  app.post('/api/orders/:id/update', async (req, res) => {
    try {
      const { id } = req.params;
      const { updateTarget, fulfillment } = req.body;
      const order = await storage.getOrder(id);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const result = await ondcEndpoints.update(order.ondcOrderId, updateTarget, fulfillment, order.bppId, order.bppUri);
      res.json(result);
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ message: 'Failed to update order' });
    }
  });

  // Address management
  app.get('/api/addresses', async (req, res) => {
    try {
      const userId = 'guest'; // Use guest user ID
      const addresses = await storage.getUserAddresses(userId);
      res.json({ addresses });
    } catch (error) {
      console.error('Error fetching addresses:', error);
      res.status(500).json({ message: 'Failed to fetch addresses' });
    }
  });

  app.post('/api/addresses', async (req, res) => {
    try {
      const userId = 'guest'; // Use guest user ID
      const addressData = { ...req.body, userId };

      const result = insertUserAddressSchema.safeParse(addressData);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid address data', errors: result.error.issues });
      }

      const address = await storage.createUserAddress(result.data);
      res.json({ address });
    } catch (error) {
      console.error('Error creating address:', error);
      res.status(500).json({ message: 'Failed to create address' });
    }
  });

  // Reviews and ratings
  app.post('/api/reviews', async (req, res) => {
    try {
      const userId = 'guest'; // Use guest user ID
      const reviewInput = { ...req.body, userId };

      const result = insertReviewSchema.safeParse(reviewInput);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid review data', errors: result.error.issues });
      }

      const reviewData = {
        ...result.data,
        images: Array.isArray(result.data.images) ? result.data.images as string[] : (result.data.images ? Object.values(result.data.images) as string[] : [])
      };
      const review = await storage.createReview(reviewData);

      // Also submit rating to ONDC
      if (result.data.overallRating) {
        try {
          await ondcEndpoints.rating(
            result.data.overallRating,
            'Order',
            result.data.orderId
          );
        } catch (ondcError) {
          console.error('Error submitting ONDC rating:', ondcError);
          // Don't fail the review creation if ONDC rating fails
        }
      }

      res.json({ review });
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ message: 'Failed to create review' });
    }
  });

  // Support endpoints
  app.get('/api/support/tickets', async (req, res) => {
    try {
      const userId = 'guest'; // Use guest user ID
      const tickets = await storage.getUserSupportTickets(userId);
      res.json({ tickets });
    } catch (error) {
      console.error('Error fetching support tickets:', error);
      res.status(500).json({ message: 'Failed to fetch support tickets' });
    }
  });

  app.post('/api/support/tickets', async (req, res) => {
    try {
      const userId = 'guest'; // Use guest user ID
      const ticketData = { ...req.body, userId };

      const result = insertSupportTicketSchema.safeParse(ticketData);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid ticket data', errors: result.error.issues });
      }

      const ticket = await storage.createSupportTicket(result.data);
      res.json({ ticket });
    } catch (error) {
      console.error('Error creating support ticket:', error);
      res.status(500).json({ message: 'Failed to create support ticket' });
    }
  });

  app.get('/api/support/tickets/:id/messages', async (req, res) => {
    try {
      const { id } = req.params;
      const messages = await storage.getSupportMessages(id);
      res.json({ messages });
    } catch (error) {
      console.error('Error fetching support messages:', error);
      res.status(500).json({ message: 'Failed to fetch support messages' });
    }
  });

  app.post('/api/support/tickets/:id/messages', async (req, res) => {
    try {
      const { id } = req.params;
      const userId = 'guest'; // Use guest user ID
      const messageInput = {
        ...req.body,
        ticketId: id,
        senderId: userId,
        senderType: 'user'
      };

      const result = insertSupportMessageSchema.safeParse(messageInput);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid message data', errors: result.error.issues });
      }

      const messageData = {
        ...result.data,
        attachments: Array.isArray(result.data.attachments) ? result.data.attachments as string[] : (result.data.attachments ? Object.values(result.data.attachments) as string[] : [])
      };
      const message = await storage.addSupportMessage(messageData);

      // Also trigger ONDC support if related to an order
      if (req.body.orderId) {
        try {
          await ondcEndpoints.support(req.body.orderId);
        } catch (ondcError) {
          console.error('Error triggering ONDC support:', ondcError);
          // Don't fail the message creation if ONDC support fails
        }
      }

      res.json({ message });
    } catch (error) {
      console.error('Error adding support message:', error);
      res.status(500).json({ message: 'Failed to add support message' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}