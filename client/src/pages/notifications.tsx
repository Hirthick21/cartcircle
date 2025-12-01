import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { MobileContainer } from "@/components/layout/mobile-container";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function Notifications() {
  const [, navigate] = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'all' | 'orders' | 'offers'>('all');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please login to view notifications",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  const notifications = [
    {
      id: "1",
      type: "order",
      title: "Order Delivered",
      message: "Your order #12345 has been delivered successfully",
      time: "2 hours ago",
      icon: "fa-box",
      color: "text-green-600",
      bgColor: "bg-green-100",
      read: false
    },
    {
      id: "2",
      type: "offer",
      title: "Special Offer!",
      message: "Get 20% off on your next order. Use code SAVE20",
      time: "5 hours ago",
      icon: "fa-tag",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      read: false
    },
    {
      id: "3",
      type: "order",
      title: "Order Shipped",
      message: "Your order #12344 is on the way",
      time: "1 day ago",
      icon: "fa-truck",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      read: true
    },
    {
      id: "4",
      type: "offer",
      title: "Flash Sale Alert",
      message: "Flash sale live now! Up to 50% off on electronics",
      time: "2 days ago",
      icon: "fa-bolt",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      read: true
    },
    {
      id: "5",
      type: "order",
      title: "Order Confirmed",
      message: "Your order #12343 has been confirmed",
      time: "3 days ago",
      icon: "fa-check-circle",
      color: "text-green-600",
      bgColor: "bg-green-100",
      read: true
    }
  ];

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'all') return true;
    return notif.type === activeTab.replace('s', '');
  });

  const markAllAsRead = () => {
    toast({
      title: "All notifications marked as read",
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/')}
                  className="bg-white/30 text-gray-800 hover:bg-white/40 rounded-full transition-all duration-300 p-0 w-10 h-10 flex items-center justify-center backdrop-blur-md border border-white/50 shadow-xl hover:scale-105"
                >
                  <i className="fas fa-chevron-left text-lg font-bold drop-shadow-sm"></i>
                </button>

                <div>
                  <h1 className="text-xl font-bold drop-shadow-sm tracking-wide" style={{ color: '#F76B1E' }}>Notifications</h1>
                  <p className="text-orange-400 text-sm font-medium drop-shadow-sm">Stay updated</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={markAllAsRead}
              >
                Mark all read
              </Button>
            </div>
          </div>
        </div>

        <div className="relative -mt-6 pt-8 px-4 py-6" style={{
          background: 'linear-gradient(180deg, rgba(255,237,213,0.8) 0%, rgba(255,240,219,0.7) 5%, rgba(255,243,225,0.6) 10%, rgba(255,246,231,0.5) 15%, rgba(255,248,237,0.4) 20%, rgba(255,250,243,0.3) 25%, rgba(255,252,248,0.2) 30%, rgba(255,254,253,0.1) 40%, white 50%)'
        }}>
          {/* Tabs */}
          <div className="mb-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={activeTab === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('all')}
                className={`flex-1 ${activeTab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
              >
                All
              </Button>
              <Button
                variant={activeTab === 'orders' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('orders')}
                className={`flex-1 ${activeTab === 'orders' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
              >
                Orders
              </Button>
              <Button
                variant={activeTab === 'offers' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('offers')}
                className={`flex-1 ${activeTab === 'offers' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
              >
                Offers
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          {filteredNotifications.length > 0 ? (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`hover:shadow-md transition-shadow cursor-pointer ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${notification.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <i className={`fas ${notification.icon} ${notification.color} text-lg`}></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-bold text-gray-900">{notification.title}</h4>
                          {!notification.read && (
                            <Badge className="bg-primary text-white text-xs">New</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <i className="fas fa-bell text-gray-400 text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No notifications</h3>
              <p className="text-gray-500 text-sm">You're all caught up!</p>
            </div>
          )}
        </div>
        <BottomNav activeTab="profile" />
      </MobileContainer>
    </div>
  );
}