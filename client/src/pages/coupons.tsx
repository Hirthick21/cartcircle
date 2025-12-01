import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { MobileContainer } from "@/components/layout/mobile-container";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function Coupons() {
  const [, navigate] = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState("");
  const [activeTab, setActiveTab] = useState<'available' | 'applied'>('available');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please login to view coupons",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  const availableCoupons = [
    {
      id: "1",
      code: "WELCOME50",
      title: "₹50 Off on First Order",
      description: "Valid on orders above ₹500",
      discount: "₹50",
      minOrder: "₹500",
      validUntil: "31 Dec 2025",
      type: "flat"
    },
    {
      id: "2",
      code: "SAVE20",
      title: "20% Off",
      description: "Maximum discount ₹200",
      discount: "20%",
      minOrder: "₹1000",
      validUntil: "15 Feb 2025",
      type: "percentage"
    },
    {
      id: "3",
      code: "FREEDEL",
      title: "Free Delivery",
      description: "No minimum order value",
      discount: "Free Delivery",
      minOrder: "No min",
      validUntil: "28 Feb 2025",
      type: "delivery"
    },
    {
      id: "4",
      code: "MEGA100",
      title: "₹100 Instant Discount",
      description: "On orders above ₹2000",
      discount: "₹100",
      minOrder: "₹2000",
      validUntil: "20 Mar 2025",
      type: "flat"
    }
  ];

  const appliedCoupons = [
    {
      id: "a1",
      code: "SAVE10",
      title: "₹10 Off",
      appliedOn: "Order #12345",
      savedAmount: "₹10"
    }
  ];

  const handleApplyCoupon = (code: string) => {
    toast({
      title: "Coupon Applied!",
      description: `${code} has been applied to your cart`,
    });
  };

  if (isLoading) {
    return (
      <MobileContainer>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MobileContainer>
    );
  }

  return (
    <div className="page-seamless-wrapper">
      <MobileContainer className="seamless-content-container">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#F1AC23] via-[#F8D555] to-transparent"></div>
          <div className="relative p-4 pb-6">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="bg-white/30 text-gray-800 hover:bg-white/40 rounded-full transition-all duration-300 p-0 w-10 h-10 flex items-center justify-center backdrop-blur-md border border-white/50 shadow-xl hover:scale-105"
              >
                <i className="fas fa-chevron-left text-lg font-bold drop-shadow-sm"></i>
              </button>

              <div>
                <h1 className="text-xl font-bold drop-shadow-sm tracking-wide" style={{ color: '#F76B1E' }}>Coupons</h1>
                <p className="text-orange-400 text-sm font-medium drop-shadow-sm">Save more on orders</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative -mt-6 pt-8 px-4 py-6" style={{
          background: 'linear-gradient(180deg, #FFF9F0 0%, #FFFCF5 10%, #FFFEFA 20%, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.98) 40%, white 50%)'
        }}>
          {/* Apply Coupon Code */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-3">Have a coupon code?</h3>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1"
                />
                <Button
                  className="fuel-yellow fuel-yellow-hover text-white"
                  onClick={() => {
                    if (couponCode) {
                      handleApplyCoupon(couponCode);
                      setCouponCode("");
                    }
                  }}
                >
                  Apply
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <div className="mb-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={activeTab === 'available' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('available')}
                className={`flex-1 ${activeTab === 'available' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
              >
                Available
              </Button>
              <Button
                variant={activeTab === 'applied' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('applied')}
                className={`flex-1 ${activeTab === 'applied' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
              >
                Applied
              </Button>
            </div>
          </div>

          {/* Coupon List */}
          {activeTab === 'available' ? (
            <div className="space-y-3">
              {availableCoupons.map((coupon) => (
                <Card key={coupon.id} className="border-dashed border-2 border-primary/30 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <i className="fas fa-ticket-alt text-primary"></i>
                          <Badge className="bg-primary text-white">{coupon.code}</Badge>
                        </div>
                        <h4 className="font-bold text-gray-900">{coupon.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{coupon.discount}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>Min order: {coupon.minOrder}</span>
                      <span>Valid till: {coupon.validUntil}</span>
                    </div>
                    <Button
                      size="sm"
                      className="w-full fuel-yellow fuel-yellow-hover text-white"
                      onClick={() => handleApplyCoupon(coupon.code)}
                    >
                      Apply Coupon
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {appliedCoupons.length > 0 ? (
                appliedCoupons.map((coupon) => (
                  <Card key={coupon.id} className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <i className="fas fa-check-circle text-green-600"></i>
                            <Badge className="bg-green-600 text-white">{coupon.code}</Badge>
                          </div>
                          <h4 className="font-bold text-gray-900">{coupon.title}</h4>
                          <p className="text-sm text-gray-600">Applied on {coupon.appliedOn}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">-{coupon.savedAmount}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <i className="fas fa-ticket-alt text-gray-400 text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No applied coupons</h3>
                  <p className="text-gray-500 text-sm">Apply coupons to see them here</p>
                </div>
              )}
            </div>
          )}
        </div>
        <BottomNav activeTab="profile" />
      </MobileContainer>
    </div>
  );
}