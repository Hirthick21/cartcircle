import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { MobileContainer } from "@/components/layout/mobile-container";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

export default function StoreDetail() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/store/:id");
  const { addToCart } = useCart();
  const { toast } = useToast();

  const storeId = params?.id;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Mock store data - replace with actual API call
  const stores: Record<string, any> = {
    baltra: {
      id: "baltra",
      name: "BALTRA",
      logo: "🏪",
      description: "Premium home appliances and electronics",
      rating: 4.5,
      reviewCount: 2340,
      products: 150,
      location: "Brigade Road, Bengaluru",
      deliveryTime: "30-45 mins",
      banner: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=300&fit=crop"
    },
    techbzar: {
      id: "techbzar",
      name: "TechBzar",
      logo: "💻",
      description: "Latest electronics and gadgets",
      rating: 4.3,
      reviewCount: 1890,
      products: 200,
      location: "Electronic City, Bengaluru",
      deliveryTime: "45-60 mins",
      banner: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=300&fit=crop"
    },
    "featured-store": {
      id: "featured-store",
      name: "Featured Store",
      logo: "⭐",
      description: "Curated selection of premium products",
      rating: 4.7,
      reviewCount: 3200,
      products: 300,
      location: "MG Road, Bengaluru",
      deliveryTime: "20-35 mins",
      banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=300&fit=crop"
    }
  };

  const store = stores[storeId || ""] || stores["featured-store"];
  const storeName = store.name;

  // Mock products for this store
  const storeProducts = [
    {
      id: "sp1",
      name: "Premium Rice Cooker 1.8L",
      price: "1599",
      originalPrice: "2499",
      images: ["https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=200&h=200&fit=crop"],
      ratings: 4.4,
      reviewCount: 523,
      image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=200&h=200&fit=crop",
      rating: 4.4,
      reviews: 523
    },
    {
      id: "sp2",
      name: "Stainless Steel Mixer Grinder",
      price: "2199",
      originalPrice: "3299",
      images: ["https://images.unsplash.com/photo-1585515320310-259814833379?w=200&h=200&fit=crop"],
      ratings: 4.5,
      reviewCount: 678,
      image: "https://images.unsplash.com/photo-1585515320310-259814833379?w=200&h=200&fit=crop",
      rating: 4.5,
      reviews: 678
    },
    {
      id: "sp3",
      name: "Electric Iron Box 1200W",
      price: "899",
      originalPrice: "1299",
      images: ["https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=200&h=200&fit=crop"],
      ratings: 4.2,
      reviewCount: 445,
      image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=200&h=200&fit=crop",
      rating: 4.2,
      reviews: 445
    },
    {
      id: "sp4",
      name: "Induction Cooktop 2000W",
      price: "1899",
      originalPrice: "2799",
      images: ["https://images.unsplash.com/photo-1585659722642-0a1e5f8e4c3c?w=200&h=200&fit=crop"],
      ratings: 4.3,
      reviewCount: 589,
      image: "https://images.unsplash.com/photo-1585659722642-0a1e5f8e4c3c?w=200&h=200&fit=crop",
      rating: 4.3,
      reviews: 589
    },
    {
      id: "sp5",
      name: "2-Slice Toaster",
      price: "1299",
      originalPrice: "1899",
      images: ["https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=200&h=200&fit=crop"],
      ratings: 4.0,
      reviewCount: 334,
      image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=200&h=200&fit=crop",
      rating: 4.0,
      reviews: 334
    },
    {
      id: "sp6",
      name: "Food Processor 750W",
      price: "3299",
      originalPrice: "4499",
      images: ["https://images.unsplash.com/photo-1585515320310-259814833379?w=200&h=200&fit=crop"],
      ratings: 4.6,
      reviewCount: 712,
      image: "https://images.unsplash.com/photo-1585515320310-259814833379?w=200&h=200&fit=crop",
      rating: 4.6,
      reviews: 712
    }
  ];

  const products = storeProducts; // Use the mock products

  return (
    <div className="page-seamless-wrapper">
      <MobileContainer className="seamless-content-container">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm" style={{ maxWidth: '28rem', margin: '0 auto' }}>
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-arrow-left text-gray-700"></i>
            </button>
            <div className="flex items-center space-x-2">
              <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                <i className="fas fa-search text-gray-600"></i>
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <i className="fas fa-shopping-cart text-gray-600"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="pb-20 pt-16">
          {/* Store Banner */}
          <div className="relative h-40 bg-gradient-to-br from-fuel-yellow to-orange-400">
            <img
              src={store.banner}
              alt={store.name}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          {/* Store Info */}
          <div className="bg-white px-4 py-4 -mt-12 relative z-10 mx-4 rounded-t-2xl shadow-lg">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-fuel-yellow to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">{store.logo}</span>
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900 mb-1">{store.name}</h1>
                <p className="text-sm text-gray-600 font-normal mb-2">{store.description}</p>
                <div className="flex items-center space-x-3 text-xs">
                  <div className="flex items-center space-x-1">
                    <i className="fas fa-star text-yellow-400"></i>
                    <span className="font-semibold text-gray-900">{store.rating}</span>
                    <span className="text-gray-500">({store.reviewCount})</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center space-x-1">
                    <i className="fas fa-clock text-gray-400"></i>
                    <span className="text-gray-600">{store.deliveryTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Stats */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{store.products}+</p>
                <p className="text-xs text-gray-500 font-normal">Products</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">98%</p>
                <p className="text-xs text-gray-500 font-normal">Positive</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">5K+</p>
                <p className="text-xs text-gray-500 font-normal">Orders</p>
              </div>
            </div>
          </div>

          {/* Store Features */}
          <div className="bg-white px-4 py-3 mt-2">
            <div className="flex items-center space-x-4 overflow-x-auto pb-2">
              <Badge className="bg-green-100 text-green-800 whitespace-nowrap">
                <i className="fas fa-shipping-fast mr-1 text-xs"></i>
                Fast Delivery
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 whitespace-nowrap">
                <i className="fas fa-shield-alt mr-1 text-xs"></i>
                Verified Seller
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 whitespace-nowrap">
                <i className="fas fa-award mr-1 text-xs"></i>
                Top Rated
              </Badge>
              <Badge className="bg-orange-100 text-orange-800 whitespace-nowrap">
                <i className="fas fa-undo mr-1 text-xs"></i>
                Easy Returns
              </Badge>
            </div>
          </div>

          {/* Products Section */}
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">All Products</h2>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <i className="fas fa-filter mr-1"></i>
                Filter
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-200 border border-gray-100 rounded-2xl bg-white shadow-sm"
                >
                  <CardContent className="p-0">
                    <div
                      className="cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <div className="relative bg-white p-3">
                        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden" style={{ height: '140px' }}>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain p-3"
                          />
                        </div>
                      </div>
                      <div className="px-3 bg-white">
                        <h3 className="text-sm font-semibold text-gray-900 mb-0.5 min-h-[38px] line-clamp-2 leading-snug">
                          {product.name}
                        </h3>
                        <p className="text-[11px] text-gray-500 mb-2 font-normal">Premium Quality</p>
                        <div className="flex items-center space-x-1 mb-1.5">
                          <div className="flex text-[10px]">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`fas fa-star ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-gray-500 font-normal">({product.reviews})</span>
                        </div>
                        <div className="mb-2.5">
                          <div className="flex items-baseline space-x-1.5">
                            <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                            {product.originalPrice && (
                              <span className="text-xs text-gray-400 line-through font-normal">₹{product.originalPrice}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-3 pb-3">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart({
                            id: product.id,
                            name: product.name,
                            price: parseFloat(product.price),
                            images: [product.image],
                            unit: '1 unit',
                            sellerId: storeId || 'store',
                            sellerName: storeName
                          });
                          toast({
                            title: "Added to Cart",
                            description: `${product.name} has been added to your cart`,
                          });
                        }}
                        className="w-full text-white font-bold py-2 text-sm rounded-lg transition-all duration-200 hover:scale-[1.01] hover:shadow-md"
                        style={{
                          backgroundColor: '#FF9800',
                          borderColor: '#FF9800'
                        }}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* About Store */}
          <div className="bg-white px-4 py-4 mt-2">
            <h3 className="text-base font-bold text-gray-900 mb-2">About {store.name}</h3>
            <p className="text-sm text-gray-600 font-normal leading-relaxed mb-3">
              We are committed to bringing you the best quality products at competitive prices. 
              With years of experience in the industry, we ensure customer satisfaction through 
              premium products and excellent service.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <i className="fas fa-map-marker-alt text-fuel-yellow"></i>
              <span className="font-normal">{store.location}</span>
            </div>
          </div>
        </div>

        <BottomNav activeTab="home" showCartButton={false} />
      </MobileContainer>
    </div>
  );
}