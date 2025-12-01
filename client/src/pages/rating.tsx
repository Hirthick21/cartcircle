import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { MobileContainer } from "@/components/layout/mobile-container";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useOndcRating } from "@/hooks/use-ondc";
import { useToast } from "@/hooks/use-toast";

export default function Rating() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/rating/:orderId");
  const { isLoading, isAuthenticated } = useAuth();
  const [overallRating, setOverallRating] = useState(0);
  const [productRating, setProductRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const { toast } = useToast();
  const orderId = params?.orderId || '';

  const { data: orderData } = useQuery({
    queryKey: [`/api/orders/${orderId}`],
    enabled: isAuthenticated && !isLoading && !!orderId,
  });

  const submitRating = useOndcRating();

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

  const handleStarClick = (rating: number, type: 'overall' | 'product' | 'delivery') => {
    switch (type) {
      case 'overall':
        setOverallRating(rating);
        break;
      case 'product':
        setProductRating(rating);
        break;
      case 'delivery':
        setDeliveryRating(rating);
        break;
    }
  };

  const renderStars = (currentRating: number, type: 'overall' | 'product' | 'delivery') => {
    return [...Array(5)].map((_, index) => (
      <button
        key={index}
        onClick={() => handleStarClick(index + 1, type)}
        className={`text-2xl transition-colors ${
          index < currentRating ? 'text-yellow-400' : 'text-gray-300'
        } hover:text-yellow-400`}
        data-testid={`star-${type}-${index + 1}`}
      >
        ★
      </button>
    ));
  };

  const handleSubmitRating = async () => {
    if (overallRating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide an overall rating",
        variant: "destructive",
      });
      return;
    }

    if (!orderData?.order) {
      toast({
        title: "Error",
        description: "Order data not found",
        variant: "destructive",
      });
      return;
    }

    try {
      await submitRating.mutateAsync({
        orderId,
        overallRating,
        productRating: productRating || undefined,
        deliveryRating: deliveryRating || undefined,
        reviewText: reviewText.trim() || undefined,
        providerId: orderData.order.providerId || 'unknown'
      });

      toast({
        title: "Success",
        description: "Rating submitted successfully!",
      });

      navigate('/orders');
    } catch (error) {
      console.error('Failed to submit rating:', error);
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    }
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

  if (!orderData?.order) {
    return (
      <MobileContainer>
        <Header 
          title="Rate Order" 
          showBack={true}
          onBack={() => navigate('/orders')}
        />
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <i className="fas fa-exclamation-triangle text-gray-400 text-2xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Order not found</h3>
          <p className="text-gray-500 text-sm">Unable to load order details for rating</p>
          <Button 
            className="mt-4 fuel-yellow fuel-yellow-hover text-white"
            onClick={() => navigate('/orders')}
          >
            Back to Orders
          </Button>
        </div>
        <BottomNav activeTab="orders" />
      </MobileContainer>
    );
  }

  const order = orderData.order;

  return (
    <MobileContainer>
      <Header 
        title="Rate Your Experience" 
        subtitle="Help us improve our service"
        showBack={true}
        onBack={() => navigate('/orders')}
      />

      <div className="p-4 pb-32">
        {/* Order Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <img 
                src={order.items?.[0]?.images?.[0] || 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60'}
                alt="Delivered Order"
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div>
                <p className="font-medium text-gray-800" data-testid="order-id-display">Order #{order.ondcOrderId}</p>
                <p className="text-sm text-gray-500">
                  Delivered on {new Date(order.createdAt).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm">✓ Order delivered successfully</p>
            </div>
          </CardContent>
        </Card>

        {/* Rating Form */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Rate this order</h3>
            
            {/* Overall Rating */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Overall Experience *</p>
              <div className="flex space-x-1" data-testid="rating-overall">
                {renderStars(overallRating, 'overall')}
              </div>
            </div>

            {/* Product Quality */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Product Quality</p>
              <div className="flex space-x-1" data-testid="rating-product">
                {renderStars(productRating, 'product')}
              </div>
            </div>

            {/* Delivery Experience */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Delivery Experience</p>
              <div className="flex space-x-1" data-testid="rating-delivery">
                {renderStars(deliveryRating, 'delivery')}
              </div>
            </div>

            {/* Review Text */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Write a review (optional)
              </label>
              <Textarea 
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                rows={3} 
                placeholder="Share your experience with other customers..."
                data-testid="textarea-review"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Submit Button */}
      <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-md p-4 bg-white border-t border-gray-200">
        <Button 
          className="w-full fuel-yellow fuel-yellow-hover text-white py-4 rounded-xl font-semibold text-lg"
          onClick={handleSubmitRating}
          disabled={overallRating === 0 || submitRating.isPending}
          data-testid="button-submit-rating"
        >
          {submitRating.isPending ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Submitting...</span>
            </div>
          ) : (
            'Submit Rating'
          )}
        </Button>
      </div>

      <BottomNav activeTab="orders" />
    </MobileContainer>
  );
}
