import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { MobileContainer } from "@/components/layout/mobile-container";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";

export default function Cart() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Group cart items by seller for display
  const groupedBySeller = cartItems.reduce((acc, item) => {
    const sellerId = item.sellerId || 'default';
    const sellerName = item.sellerName || 'General Store';

    if (!acc[sellerId]) {
      acc[sellerId] = {
        id: sellerId,
        name: sellerName,
        items: []
      };
    }

    acc[sellerId].items.push(item);
    return acc;
  }, {} as Record<string, { id: string; name: string; items: typeof cartItems }>);

  const sellers = Object.values(groupedBySeller);

  const calculateSellerTotal = (seller: any) => {
    return seller.items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
  };

  const calculateSubtotal = () => {
    return getCartTotal();
  };

  const calculateDeliveryCharges = () => {
    return sellers.length * 20; // ₹20 per seller
  };

  const calculateTaxes = () => {
    return Math.round(calculateSubtotal() * 0.06); // 6% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryCharges() + calculateTaxes();
  };

  const proceedToCheckout = () => {
    if (sellers.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before proceeding",
        variant: "destructive",
      });
      return;
    }
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate('/checkout');
  };

  if (sellers.length === 0) {
    return (
      <MobileContainer>
        <Header 
          title="Shopping Cart" 
          subtitle="Your cart is empty"
          showBack={true}
          onBack={() => navigate('/')}
        />

        <div className="px-4 py-6 pb-32 w-full">
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <i className="fas fa-shopping-cart text-gray-400 text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 text-sm mb-6">Add some products to get started</p>
              <Button 
                onClick={() => navigate('/')} 
                className="fuel-yellow fuel-yellow-hover text-white"
                data-testid="button-start-shopping"
              >
                Start Shopping
              </Button>
            </div>
          </div>
        </div>
        <BottomNav activeTab="cart" showCartButton={true} />
      </MobileContainer>
    );
  }

  return (
    <div className="page-seamless-wrapper">
      <MobileContainer className="seamless-content-container">
        <div className="sticky top-0 z-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFEDD5] via-[#FFEDD5] to-[#FFEDD5]"></div>
          <div className="relative p-4 pb-6">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/')}
                className="bg-white/30 text-gray-800 hover:bg-white/40 rounded-full transition-all duration-300 p-0 w-10 h-10 flex items-center justify-center backdrop-blur-md border border-white/50 shadow-xl hover:scale-105"
              >
                <i className="fas fa-chevron-left text-lg font-bold drop-shadow-sm"></i>
              </button>
              <div>
                <h1 className="text-xl font-bold drop-shadow-sm tracking-wide" style={{ color: '#F76B1E' }}>Shopping Cart</h1>
                <p className="text-orange-400 text-sm font-medium drop-shadow-sm">Review your items</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative px-4 pt-6 pb-24" style={{
          background: 'linear-gradient(180deg, rgba(255,237,213,0.8) 0%, rgba(255,240,219,0.7) 5%, rgba(255,243,225,0.6) 10%, rgba(255,246,231,0.5) 15%, rgba(255,248,237,0.4) 20%, rgba(255,250,243,0.3) 25%, rgba(255,252,248,0.2) 30%, rgba(255,254,253,0.1) 40%, white 50%)'
        }}>
        <div className="space-y-6">
          <div className="bg-[#F1AC23] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">🛒 Selected Products</h2>
              <Badge className="bg-white/20 text-white backdrop-blur-sm border-white/30 shadow-lg">
                {cartItems.length} items
              </Badge>
            </div>
          </div>

          {sellers.map((seller) => (
            <Card key={seller.id} className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50/30">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <i className="fas fa-store text-primary text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-base">{seller.name}</h4>
                      <span className="text-xs text-gray-600 font-medium">Fresh & Quality Products</span>
                    </div>
                  </div>
                  <span className="text-xs text-white bg-primary px-2 py-1 rounded-full font-bold">{seller.items.length} item{seller.items.length > 1 ? 's' : ''}</span>
                </div>

                {/* Delivery Estimate */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-truck text-green-600 text-sm"></i>
                    <span className="text-sm font-medium text-green-700">
                      Estimated Delivery by {seller.id === 'baltra' ? 'Wednesday, 03 Sep' : 'Saturday, 06 Sep'}
                    </span>
                  </div>
                </div>

                <div className="cart-items-container">
                  {seller.items.map((item, index) => (
                    <div key={item.id} className="cart-item-enhanced">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-xl shadow-sm"
                          />
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-fuel-yellow rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{item.quantity}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-gray-800 truncate">{item.name}</h3>
                          <p className="text-xs text-gray-500 font-medium">{item.unit}</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="font-bold text-fuel-yellow text-lg">₹{item.price}</span>
                            <div className="flex items-center space-x-3 bg-gray-50 rounded-full px-3 py-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 rounded-full bg-white shadow-sm hover:bg-fuel-yellow hover:text-white transition-all duration-200"
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              >
                                -
                              </Button>
                              <span className="text-sm font-bold text-gray-700 min-w-[20px] text-center">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 rounded-full bg-white shadow-sm hover:bg-fuel-yellow hover:text-white transition-all duration-200"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFromCart(item.id)}
                                className="w-7 h-7 p-0 text-red-500 hover:text-red-700"
                                data-testid={`button-remove-${item.id}`}
                              >
                                <i className="fas fa-trash text-xs"></i>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
                  <span className="font-semibold text-gray-800 text-sm">Seller Total:</span>
                  <span className="font-bold text-gray-800 text-sm" data-testid={`seller-total-${seller.id}`}>
                    ₹{calculateSellerTotal(seller)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-yellow-50/20 to-orange-50/40 mt-6 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <i className="fas fa-calculator text-primary text-base"></i>
              <h3 className="font-bold text-lg text-gray-900">Order Summary</h3>
            </div>
            <div className="cart-total-section">
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{calculateSubtotal()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>Delivery Charges</span>
                  <span>₹{calculateDeliveryCharges()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>Taxes</span>
                  <span>₹{calculateTaxes()}</span>
                </div>
                <div className="border-t border-fuel-yellow/20 pt-4 pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-gray-800">Total Amount</span>
                    <span className="text-xl font-bold text-fuel-yellow">₹{calculateTotal()}</span>
                  </div>
                  
                  {/* Place Order Button */}
                  <Button 
                    className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={proceedToCheckout}
                    data-testid="button-checkout"
                  >
                    {`Place Order • ₹${calculateTotal()}`}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav activeTab="cart" showCartButton={true} />
      </MobileContainer>
    </div>
  );
}