import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { MobileContainer } from "@/components/layout/mobile-container";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Wishlist() {
  const [, navigate] = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please login to view your wishlist",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Removed from Wishlist",
      description: "Item has been removed from your wishlist",
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
                <h1 className="text-xl font-bold drop-shadow-sm tracking-wide" style={{ color: '#F76B1E' }}>My Wishlist</h1>
                <p className="text-orange-400 text-sm font-medium drop-shadow-sm">Your favorite items</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative -mt-6 pt-8 px-4 py-6" style={{
          background: 'linear-gradient(180deg, #FFEDD5 0%, rgba(255,237,213,0.9) 10%, rgba(255,237,213,0.7) 20%, rgba(255,237,213,0.5) 30%, rgba(255,237,213,0.3) 40%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.95) 60%, white 70%)'
        }}>
          {wishlistItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <i className="fas fa-heart text-red-400 text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 text-sm mb-6">Add items you love to your wishlist</p>
              <Button 
                onClick={() => navigate('/')} 
                className="fuel-yellow fuel-yellow-hover text-white"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="aspect-square overflow-hidden bg-gray-100 rounded-lg mb-2 relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <i className="fas fa-times text-red-600 text-sm"></i>
                      </button>
                    </div>
                    <h4 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">{item.name}</h4>
                    <div className="flex items-baseline space-x-1 mb-2">
                      <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                    </div>
                    <Button
                      size="sm"
                      className="w-full fuel-yellow fuel-yellow-hover text-white font-medium"
                      onClick={() => toast({ title: "Added to Cart", description: `${item.name} added to cart` })}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        <BottomNav activeTab="wishlist" />
      </MobileContainer>
    </div>
  );
}