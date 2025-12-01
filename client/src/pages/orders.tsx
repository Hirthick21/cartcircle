import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { MobileContainer } from "@/components/layout/mobile-container";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { OrderCard } from "@/components/order/order-card";
import { Button } from "@/components/ui/button";
import { useOndcCancel, useOndcTrack } from "@/hooks/use-ondc";
import { useToast } from "@/hooks/use-toast";

export default function Orders() {
  const [, navigate] = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'ongoing' | 'history'>('ongoing');
  const { toast } = useToast();

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/orders', { status: activeTab === 'ongoing' ? undefined : 'completed' }],
    enabled: isAuthenticated && !isLoading,
  });

  const cancelOrder = useOndcCancel('');
  const trackOrder = useOndcTrack('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  const handleOrderClick = (orderId: string) => {
    if (orderId && typeof orderId === 'string') {
      navigate(`/orders/${orderId}`);
    } else {
      console.error('Invalid order ID:', orderId);
      toast({
        title: "Error",
        description: "Invalid order ID",
        variant: "destructive",
      });
    }
  };

  const handleTrackOrder = (orderId: string) => {
    trackOrder.mutate();
  };

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrder.mutate({ reason: 'Customer cancelled' });
    }
  };

  const handleSupportOrder = (orderId: string) => {
    navigate('/support');
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

  const filteredOrders = (ordersData as any)?.orders?.filter((order: any) => {
    if (activeTab === 'ongoing') {
      return !['delivered', 'completed', 'cancelled'].includes(order.status.toLowerCase());
    } else {
      return ['delivered', 'completed', 'cancelled'].includes(order.status.toLowerCase());
    }
  }) || [];

  return (
    <div className="page-seamless-wrapper">
      <MobileContainer className="seamless-content-container">
        {/* Seamless Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFEDD5] via-[#FFF4E6] to-[#FFF9F0]"></div>
          <div className="relative p-4 pb-6">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="bg-white/30 text-gray-800 hover:bg-white/40 rounded-full transition-all duration-300 p-0 w-10 h-10 flex items-center justify-center backdrop-blur-md border border-white/50 shadow-xl hover:scale-105"
              >
                <i className="fas fa-chevron-left text-lg font-bold drop-shadow-sm"></i>
              </button>

              <div>
                <h1 className="text-xl font-bold drop-shadow-sm tracking-wide" style={{ color: '#F76B1E' }}>My Orders</h1>
                <p className="text-orange-400 text-sm font-medium drop-shadow-sm">Track your orders and view history</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative -mt-6 pt-8 px-4 py-4 w-full" style={{
          background: 'linear-gradient(180deg, #FFF9F0 0%, #FFFCF5 10%, #FFFEFA 20%, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.98) 40%, white 50%)'
        }}>
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <i className="fas fa-box text-primary text-lg"></i>
            <h2 className="text-lg font-bold text-gray-900">Order History</h2>
          </div>
          <p className="text-gray-600 font-medium mt-1 text-sm">Search for products from thousands of sellers</p>
        </div>

        {/* Order Tabs */}
        <div className="mb-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={activeTab === 'ongoing' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('ongoing')}
              className={`flex-1 ${activeTab === 'ongoing' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
              data-testid="tab-ongoing"
            >
              Ongoing
            </Button>
            <Button
              variant={activeTab === 'history' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('history')}
              className={`flex-1 ${activeTab === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
              data-testid="tab-history"
            >
              History
            </Button>
          </div>
        </div>

        {/* Orders List */}
        {ordersLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-gray-200 rounded w-12"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4" data-testid="orders-list">
            {filteredOrders.map((order: any) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={handleOrderClick}
                onTrack={handleTrackOrder}
                onCancel={handleCancelOrder}
                onSupport={handleSupportOrder}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <i className="fas fa-box text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {activeTab === 'ongoing' ? 'No ongoing orders' : 'No order history'}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {activeTab === 'ongoing'
                ? 'Start shopping to see your orders here'
                : 'Your completed orders will appear here'
              }
            </p>
            {activeTab === 'ongoing' && (
              <Button
                onClick={() => navigate('/')}
                className="fuel-yellow fuel-yellow-hover text-white"
                data-testid="button-start-shopping"
              >
                Start Shopping
              </Button>
            )}
          </div>
        )}
        </div>
        <BottomNav activeTab="orders" />
      </MobileContainer>
    </div>
  );
}