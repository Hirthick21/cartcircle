
import React, { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { MobileContainer } from "@/components/layout/mobile-container";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/product/:id");
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const productId = params?.id;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const getLocalProduct = (id: string | undefined) => {
    if (!id) return null;

    try {
      const cart = localStorage.getItem('cart');
      if (cart) {
        const cartItems = JSON.parse(cart);
        const found = cartItems.find((item: any) => item.id === id);
        if (found) return found;
      }
    } catch (e) {
      console.error('Error parsing cart:', e);
    }

    try {
      const recentlyViewed = localStorage.getItem('recentlyViewed');
      if (recentlyViewed) {
        const viewedItems = JSON.parse(recentlyViewed);
        const found = viewedItems.find((item: any) => item.id === id);
        if (found) return found;
      }
    } catch (e) {
      console.error('Error parsing recently viewed:', e);
    }

    return null;
  };

  const [localProduct] = useState<any>(() => getLocalProduct(productId));

  const { data: apiProduct, isLoading } = useQuery({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId && !localProduct,
  });

  const product = localProduct || apiProduct;

  // Mock data for related products and seller catalog
  const relatedProducts = [
    { id: "rel1", name: "Prestige 2L Electric Kettle", price: "699", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop", rating: 4.3 },
    { id: "rel2", name: "Pigeon 1.5L Electric Kettle", price: "549", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop", rating: 4.1 },
    { id: "rel3", name: "Butterfly 1.7L Steel Kettle", price: "599", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop", rating: 4.4 },
    { id: "rel4", name: "Kent 1.8L Premium Kettle", price: "799", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop", rating: 4.6 },
  ];

  const sellerProducts = [
    { id: "sel1", name: "Baltra Iron Box 1000W", price: "899", image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=200&h=200&fit=crop", rating: 4.2 },
    { id: "sel2", name: "Baltra Mixer Grinder 750W", price: "2199", image: "https://images.unsplash.com/photo-1585515320310-259814833379?w=200&h=200&fit=crop", rating: 4.5 },
    { id: "sel3", name: "Baltra Toaster 2 Slice", price: "1299", image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=200&h=200&fit=crop", rating: 4.0 },
    { id: "sel4", name: "Baltra Induction Cooktop", price: "1899", image: "https://images.unsplash.com/photo-1585659722642-0a1e5f8e4c3c?w=200&h=200&fit=crop", rating: 4.3 },
    { id: "sel5", name: "Baltra Rice Cooker 1.8L", price: "1599", image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=200&h=200&fit=crop", rating: 4.4 },
    { id: "sel6", name: "Baltra Food Processor", price: "3299", image: "https://images.unsplash.com/photo-1585515320310-259814833379?w=200&h=200&fit=crop", rating: 4.6 },
  ];

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: typeof product.price === 'number' ? product.price : parseFloat(product.price),
      images: product.images || [],
      unit: product.unit || '1 unit',
      sellerId: product.sellerId || 'default-store',
      sellerName: product.sellerName || 'Store',
      quantity: quantity
    });

    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name}`,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: `Check out ${product?.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      toast({
        title: "Link Copied",
        description: "Product link copied to clipboard",
      });
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const showLoading = isLoading && !localProduct;
  const showProduct = !!product;

  if (showLoading) {
    return (
      <MobileContainer>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-3 border-fuel-yellow border-t-transparent rounded-full animate-spin"></div>
        </div>
      </MobileContainer>
    );
  }

  if (!showProduct) {
    return (
      <MobileContainer>
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="w-16 h-16 mb-3 rounded-full bg-orange-100 flex items-center justify-center">
            <i className="fas fa-box-open text-orange-400 text-2xl"></i>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Product Not Found</h2>
          <p className="text-sm text-gray-500 mb-4">This product doesn't exist (ID: {productId})</p>
          <Button
            onClick={() => navigate('/')}
            className="bg-fuel-yellow hover:bg-fuel-yellow-hover text-white font-medium text-sm"
          >
            Back to Home
          </Button>
        </div>
      </MobileContainer>
    );
  }

  const images = product.images || ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&h=600&fit=crop'];
  const productPrice = typeof product.price === 'number' ? product.price.toFixed(2) : product.price;
  const productOriginalPrice = product.originalPrice ? (typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : product.originalPrice) : null;

  const discountPercentage = productOriginalPrice && parseFloat(productOriginalPrice) > parseFloat(productPrice)
    ? Math.round(((parseFloat(productOriginalPrice) - parseFloat(productPrice)) / parseFloat(productOriginalPrice)) * 100)
    : 0;

  return (
    <div className="page-seamless-wrapper">
      <MobileContainer className="seamless-content-container">
        {/* Floating Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm" style={{ maxWidth: '28rem', margin: '0 auto' }}>
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition-all"
            >
              <i className="fas fa-arrow-left text-gray-700"></i>
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition-all"
              >
                <i className="fas fa-share-alt text-gray-600"></i>
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition-all">
                <i className="far fa-heart text-gray-600"></i>
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition-all relative"
              >
                <i className="fas fa-shopping-cart text-gray-600"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="pb-28 pt-16">
          {/* Product Name Above Image */}
          <div className="bg-white px-4 py-3 shadow-sm">
            <h1 className="text-base font-medium text-gray-900 leading-tight mb-1">{product.name}</h1>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <i className="fas fa-star text-yellow-400 text-xs"></i>
                <span className="text-xs font-normal text-gray-700 ml-1">4.5</span>
                <span className="text-xs text-gray-400 ml-1">(2.3k reviews)</span>
              </div>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-green-600 font-normal">In Stock</span>
            </div>
          </div>

          {/* Modern Image Gallery */}
          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100">
            <img
              src={images[currentImageIndex]}
              alt={product.name}
              className="w-full aspect-square object-contain p-4"
            />
            {discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full shadow-lg">
                <span className="text-sm font-bold">{discountPercentage}% OFF</span>
              </div>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`transition-all ${
                      currentImageIndex === idx 
                        ? 'w-6 h-2 bg-fuel-yellow rounded-full' 
                        : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Price & Offer Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-4 border-y border-green-100">
            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-2xl font-semibold text-gray-900">₹{productPrice}</span>
              {productOriginalPrice && parseFloat(productOriginalPrice) > parseFloat(productPrice) && (
                <>
                  <span className="text-base text-gray-400 line-through font-normal">₹{productOriginalPrice}</span>
                  <span className="text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded">{discountPercentage}% off</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <i className="fas fa-truck text-green-600 text-sm"></i>
              <span className="text-sm text-gray-700 font-normal">Free Delivery • Arrives by Tomorrow</span>
            </div>
            
            {/* Add to Cart Section - Prominent */}
            <div className="flex items-center space-x-3 mt-4">
              <div className="flex items-center space-x-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <i className="fas fa-minus text-sm"></i>
                </Button>
                <span className="text-base font-semibold text-gray-700 min-w-[32px] text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <i className="fas fa-plus text-sm"></i>
                </Button>
              </div>

              <Button
                className="flex-1 bg-gradient-to-r from-fuel-yellow to-orange-400 hover:from-fuel-yellow-hover hover:to-orange-500 text-white font-bold py-3 rounded-xl shadow-lg text-base"
                onClick={handleAddToCart}
              >
                <i className="fas fa-shopping-cart mr-2"></i>
                Add to Cart • ₹{(parseFloat(productPrice) * quantity).toFixed(2)}
              </Button>
            </div>
          </div>

          {/* Offers Section */}
          <div className="bg-white px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <i className="fas fa-tags text-fuel-yellow mr-2 text-sm"></i>
              Available Offers
            </h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-2 bg-orange-50 p-2 rounded-lg">
                <i className="fas fa-percent text-orange-500 mt-0.5 text-xs"></i>
                <p className="text-xs text-gray-700 font-normal"><span className="font-medium">Bank Offer:</span> 5% off on prepaid orders</p>
              </div>
              <div className="flex items-start space-x-2 bg-blue-50 p-2 rounded-lg">
                <i className="fas fa-gift text-blue-500 mt-0.5 text-xs"></i>
                <p className="text-xs text-gray-700 font-normal"><span className="font-medium">Special:</span> Buy 2 get 10% extra discount</p>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div 
            className="bg-white px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => navigate(`/store/${product.sellerId}`)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-fuel-yellow to-orange-400 rounded-full flex items-center justify-center">
                  <i className="fas fa-store text-white text-sm"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{product.sellerName || 'Store'}</p>
                  <p className="text-xs text-gray-500 font-normal">Verified Seller • 4.8★</p>
                </div>
              </div>
              <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white px-4 py-4 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Product Details</h3>
            <p className={`text-sm text-gray-600 font-normal leading-relaxed ${!showFullDescription ? 'line-clamp-3' : ''}`}>
              {product.description || 'High quality product with premium features. Perfect for your everyday needs. This product is carefully crafted to meet your requirements and deliver exceptional performance. Made with durable materials and advanced technology to ensure long-lasting use.'}
            </p>
            {(product.description?.length > 100 || !product.description) && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-sm text-fuel-yellow font-medium mt-2"
              >
                {showFullDescription ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>

          {/* Specifications */}
          <div className="bg-white px-4 py-4 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Specifications</h3>
            <div className="space-y-2">
              {Object.entries(product.details || {
                brand: product.sellerName,
                warranty: '1 Year Manufacturer Warranty',
                material: 'Premium Stainless Steel',
                power: '1500W',
                capacity: '1.8 Liters'
              }).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500 font-normal capitalize">{key.replace(/_/g, ' ')}</span>
                  <span className="text-sm text-gray-900 font-normal">{value as string}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products */}
          <div className="bg-white px-4 py-4 border-b border-gray-100">
            <h3 className="text-base font-medium text-gray-900 mb-3">Similar Products</h3>
            <div className="grid grid-cols-2 gap-3">
              {relatedProducts.map((item) => (
                <Card 
                  key={item.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow border-0 shadow-sm"
                >
                  <CardContent className="p-3">
                    <div 
                      className="cursor-pointer"
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-lg mb-2" />
                      <h4 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">{item.name}</h4>
                      <div className="flex items-center space-x-1 mb-1">
                        <i className="fas fa-star text-yellow-400 text-xs"></i>
                        <span className="text-xs text-gray-600 font-normal">{item.rating}</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">₹{item.price}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: parseFloat(item.price),
                          images: [item.image],
                          unit: '1 unit',
                          sellerId: 'similar-products',
                          sellerName: 'Store'
                        });
                        toast({
                          title: "Added to Cart",
                          description: `${item.name} has been added to your cart`,
                        });
                      }}
                      className="w-full text-white font-bold py-2 text-xs rounded-lg transition-all duration-200 hover:scale-[1.01] hover:shadow-md"
                      style={{
                        backgroundColor: '#FF9800',
                        borderColor: '#FF9800'
                      }}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* More from this Seller */}
          <div className="bg-white px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-medium text-gray-900">More from {product.sellerName}</h3>
              <button 
                onClick={() => navigate(`/store/${product.sellerId}`)}
                className="text-xs text-fuel-yellow font-medium"
              >
                View All <i className="fas fa-arrow-right ml-1 text-xs"></i>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {sellerProducts.map((item) => (
                <Card 
                  key={item.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow border-0 shadow-sm"
                >
                  <CardContent className="p-3">
                    <div 
                      className="cursor-pointer"
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-lg mb-2" />
                      <h4 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">{item.name}</h4>
                      <div className="flex items-center space-x-1 mb-1">
                        <i className="fas fa-star text-yellow-400 text-xs"></i>
                        <span className="text-xs text-gray-600 font-normal">{item.rating}</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">₹{item.price}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: parseFloat(item.price),
                          images: [item.image],
                          unit: '1 unit',
                          sellerId: product.sellerId || 'seller-store',
                          sellerName: product.sellerName || 'Store'
                        });
                        toast({
                          title: "Added to Cart",
                          description: `${item.name} has been added to your cart`,
                        });
                      }}
                      className="w-full text-white font-bold py-2 text-xs rounded-lg transition-all duration-200 hover:scale-[1.01] hover:shadow-md"
                      style={{
                        backgroundColor: '#FF9800',
                        borderColor: '#FF9800'
                      }}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Customer Reviews Teaser */}
          <div className="bg-white px-4 py-4 border-t border-gray-100">
            <h3 className="text-base font-medium text-gray-900 mb-3">Customer Reviews</h3>
            <div className="flex items-center space-x-4 mb-3">
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-900">4.5</p>
                <div className="flex text-yellow-400 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
                <p className="text-xs text-gray-500 font-normal mt-1">2,340 ratings</p>
              </div>
              <div className="flex-1">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center space-x-2 mb-1">
                    <span className="text-xs text-gray-600 font-normal w-3">{stars}</span>
                    <i className="fas fa-star text-yellow-400 text-xs"></i>
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-fuel-yellow rounded-full" 
                        style={{ width: `${Math.random() * 60 + 40}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full border-fuel-yellow text-fuel-yellow hover:bg-fuel-yellow hover:text-white font-medium text-sm"
            >
              View All Reviews
            </Button>
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-2xl z-40" style={{ maxWidth: '28rem', margin: '0 auto' }}>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-xl px-3 py-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-lg hover:bg-gray-200"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <i className="fas fa-minus text-xs"></i>
              </Button>
              <span className="text-sm font-semibold text-gray-700 min-w-[28px] text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-lg hover:bg-gray-200"
                onClick={() => setQuantity(quantity + 1)}
              >
                <i className="fas fa-plus text-xs"></i>
              </Button>
            </div>

            <Button
              className="flex-1 bg-gradient-to-r from-fuel-yellow to-orange-400 hover:from-fuel-yellow-hover hover:to-orange-500 text-white font-semibold py-3 rounded-xl shadow-lg text-sm"
              onClick={handleAddToCart}
            >
              <i className="fas fa-shopping-cart mr-2 text-sm"></i>
              Add to Cart • ₹{(parseFloat(productPrice) * quantity).toFixed(2)}
            </Button>
          </div>
        </div>

        <BottomNav activeTab="home" showCartButton={false} />
      </MobileContainer>
    </div>
  );
}
