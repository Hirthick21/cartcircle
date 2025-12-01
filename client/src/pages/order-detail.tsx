import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { MobileContainer } from "@/components/layout/mobile-container";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { StatusTimeline } from "@/components/order/status-timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useOndcTrack, useOndcStatus } from "@/hooks/use-ondc";
import { useToast } from "@/hooks/use-toast";

export default function OrderDetail() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/orders/:id");
  const { isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const orderId = params?.id || '';

  const { data: orderData, isLoading: orderLoading, error } = useQuery({
    queryKey: [`/api/orders/${orderId}`],
    enabled: isAuthenticated && !isLoading && !!orderId && typeof orderId === 'string' && orderId !== '[object Object]',
  });

  const trackOrder = useOndcTrack(orderId);
  const getStatus = useOndcStatus(orderId);

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

  useEffect(() => {
    if (orderId && (orderId === '[object Object]' || typeof orderId !== 'string')) {
      toast({
        title: "Error",
        description: "Invalid order ID. Redirecting to orders page.",
        variant: "destructive",
      });
      navigate('/orders');
    }
  }, [orderId, navigate, toast]);

  const handleTrackLive = () => {
    trackOrder.mutate();
    toast({
      title: "Live Tracking Started",
      description: "You can now track your order in real-time",
    });
  };

  const handleContactSupport = () => {
    navigate('/support');
  };

  const handleRefreshStatus = () => {
    getStatus.mutate();
    toast({
      title: "Status Updated",
      description: "Order status has been refreshed",
    });
  };

  const handleCallPartner = () => {
    const phoneNumber = "+919876543210";
    if (window.confirm(`Call delivery partner at ${phoneNumber}?`)) {
      window.open(`tel:${phoneNumber}`);
    }
  };

  if (isLoading || orderLoading) {
    return (
      <MobileContainer>
        <Header 
          title="Order Details" 
          showBack={true}
          onBack={() => navigate('/orders')}
        />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MobileContainer>
    );
  }

  if (!(orderData as any)?.order) {
    return (
      <MobileContainer>
        <Header 
          title="Order Details" 
          showBack={true}
          onBack={() => navigate('/orders')}
        />
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <i className="fas fa-exclamation-triangle text-gray-400 text-2xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Order not found</h3>
          <p className="text-gray-500 text-sm">This order may have been removed or doesn't exist</p>
        </div>
      </MobileContainer>
    );
  }

  const order = (orderData as any).order;

  // Mock status timeline data - in real app this would come from order.statusHistory
  const statusTimeline = [
    {
      status: 'Order Confirmed',
      message: 'Your order has been confirmed',
      timestamp: order.createdAt,
      completed: true
    },
    {
      status: 'Order Prepared',
      message: 'Your order is being prepared',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      completed: true
    },
    {
      status: 'Out for Delivery',
      message: 'Your order is out for delivery',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      completed: order.status !== 'confirmed'
    },
    {
      status: 'Delivered',
      message: 'Expected by 4:30 PM',
      timestamp: '',
      completed: order.status === 'delivered'
    }
  ];

  return (
    <MobileContainer>
      <Header 
        title="Order Details" 
        subtitle={`Order #${order.ondcOrderId}`}
        showBack={true}
        onBack={() => navigate('/orders')}
      />

      <div className="p-4 pb-20">
        {/* Order Status Timeline */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Order Status</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleRefreshStatus}
                className="text-primary"
                data-testid="button-refresh-status"
              >
                <i className="fas fa-sync-alt mr-1"></i>
                Refresh
              </Button>
            </div>
            <StatusTimeline statuses={statusTimeline} />
          </CardContent>
        </Card>

        {/* Delivery Info */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Delivery Information</h3>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <i className="fas fa-user text-white"></i>
              </div>
              <div>
                <p className="font-medium text-gray-800" data-testid="delivery-partner-name">Rajesh Kumar</p>
                <p className="text-sm text-gray-500">Delivery Partner</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-primary" 
                onClick={handleCallPartner}
                data-testid="button-call-partner"
              >
                <i className="fas fa-phone"></i>
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              <p>
                <i className="fas fa-map-marker-alt text-red-500 mr-2"></i>
                Delivering to {order.deliveryAddress?.city || 'Unknown location'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
            {order.items && order.items.length > 0 ? (
              order.items.map((item: any, index: number) => (
                <div key={item.id || index} className={`flex items-center space-x-3 py-2 ${index < order.items.length - 1 ? 'border-b border-gray-100' : ''}`} data-testid={`order-item-${index}`}>
                  <img 
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60'}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-800">₹{item.price}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No items found</p>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-bold text-gray-800" data-testid="order-total-amount">₹{order.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="text-gray-800 capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span className={`capitalize ${order.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex space-x-3 mb-6">
          <Button 
            variant="outline"
            className="flex-1"
            onClick={handleContactSupport}
            data-testid="button-contact-support"
          >
            Contact Support
          </Button>
          <Button 
            className="flex-1 fuel-yellow fuel-yellow-hover text-white"
            onClick={handleTrackLive}
            data-testid="button-track-live"
          >
            Track Live
          </Button>
        </div>

        {/* Rate Order Button */}
        {order.status === 'delivered' && (
          <Button 
            className="w-full fuel-yellow fuel-yellow-hover text-white"
            onClick={() => navigate(`/rating/${order.id}`)}
            data-testid="button-rate-order"
          >
            Rate this Order
          </Button>
        )}
      </div>

      <BottomNav activeTab="orders" />
    </MobileContainer>
  );
}
