import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { MobileContainer } from "@/components/layout/mobile-container";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function Rewards() {
  const [, navigate] = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please login to view rewards",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  const rewardPoints = 2450;
  const availableRewards = [
    {
      id: "1",
      title: "₹50 Off on Next Order",
      points: 500,
      description: "Valid on orders above ₹500",
      icon: "fa-ticket-alt",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "2",
      title: "Free Delivery",
      points: 300,
      description: "Free delivery on any order",
      icon: "fa-truck",
      color: "from-green-500 to-green-600"
    },
    {
      id: "3",
      title: "₹100 Off on ₹1000",
      points: 1000,
      description: "Valid for 30 days",
      icon: "fa-tags",
      color: "from-purple-500 to-purple-600"
    },
    {
      id: "4",
      title: "Cashback Voucher",
      points: 750,
      description: "10% cashback up to ₹200",
      icon: "fa-money-bill-wave",
      color: "from-orange-500 to-orange-600"
    }
  ];

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
                <h1 className="text-xl font-bold drop-shadow-sm tracking-wide" style={{ color: '#F76B1E' }}>Rewards</h1>
                <p className="text-orange-400 text-sm font-medium drop-shadow-sm">Redeem your points</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative -mt-6 pt-8 px-4 py-6" style={{
          background: 'linear-gradient(180deg, #FFF9F0 0%, #FFFCF5 10%, #FFFEFA 20%, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.98) 40%, white 50%)'
        }}>
          {/* Points Balance */}
          <Card className="mb-6 bg-gradient-to-br from-primary to-orange-600 text-white shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="mb-2">
                <i className="fas fa-gift text-4xl mb-3"></i>
              </div>
              <h2 className="text-3xl font-bold mb-1">{rewardPoints}</h2>
              <p className="text-white/90">Available Points</p>
              <Button
                className="mt-4 bg-white text-primary hover:bg-white/90"
                onClick={() => toast({ title: "Points History", description: "View your points history" })}
              >
                View History
              </Button>
            </CardContent>
          </Card>

          {/* How to Earn Points */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-3 flex items-center">
                <i className="fas fa-star text-primary mr-2"></i>
                How to Earn Points
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Complete an order</span>
                  <Badge>+100 pts</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Write a review</span>
                  <Badge>+50 pts</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Refer a friend</span>
                  <Badge>+200 pts</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily login</span>
                  <Badge>+10 pts</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Rewards */}
          <h3 className="font-bold text-lg mb-4">Available Rewards</h3>
          <div className="space-y-3">
            {availableRewards.map((reward) => (
              <Card key={reward.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${reward.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <i className={`fas ${reward.icon} text-white text-xl`}></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{reward.title}</h4>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-primary border-primary">
                          {reward.points} points
                        </Badge>
                        <Button
                          size="sm"
                          className="fuel-yellow fuel-yellow-hover text-white"
                          disabled={rewardPoints < reward.points}
                          onClick={() => toast({ 
                            title: "Reward Redeemed!", 
                            description: `${reward.title} has been added to your account` 
                          })}
                        >
                          {rewardPoints < reward.points ? 'Not Enough Points' : 'Redeem'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <BottomNav activeTab="profile" />
      </MobileContainer>
    </div>
  );
}