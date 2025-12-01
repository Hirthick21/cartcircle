import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { MobileContainer } from "@/components/layout/mobile-container";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [, navigate] = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: addresses } = useQuery({
    queryKey: ['/api/addresses'],
    enabled: isAuthenticated && !isLoading,
  });

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

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      window.location.href = '/api/logout';
    }
  };

  const handleEditAddress = () => {
    const newAddress = {
      name: "John Doe",
      street: "123, New Address Line",
      city: "Bangalore",
      state: "Karnataka",
      postalCode: "560001",
      phone: "+91 9876543210",
      isDefault: true
    };

    // In a real app, this would make an API call
    toast({
      title: "Address Updated",
      description: "Your address has been saved successfully",
    });
  };

  const handleManageAddresses = () => {
    // Show address management modal or navigate to address page
    toast({
      title: "Address Management",
      description: "Address management feature coming soon",
    });
  };

  const handleNavigate = (path: string) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(path);
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

  const displayName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();

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
                <h1 className="text-xl font-bold drop-shadow-sm tracking-wide" style={{ color: '#F76B1E' }}>Profile</h1>
                <p className="text-orange-400 text-sm font-medium drop-shadow-sm">Manage your account settings</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative -mt-6 pt-8 px-4 py-6" style={{
          background: 'linear-gradient(180deg, #FFF9F0 0%, #FFFCF5 10%, #FFFEFA 20%, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.98) 40%, white 50%)'
        }}>
        {/* User Info Card */}
        <Card className="mb-4" data-testid="card-user-info">
          <CardContent className="p-6">
            <div className="text-center mb-8">
              <div className="w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-circle text-gray-700 text-7xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
              <p className="text-gray-600 font-medium">{user?.email}</p>
              <div className="mt-3">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">Verified Member</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Menu Items */}
        <div className="space-y-3 mb-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] duration-200 border border-gray-200"
            onClick={() => handleNavigate('/contact-info')}
            data-testid="card-contact-info"
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <i className="fas fa-address-card text-gray-600 text-2xl w-8 flex items-center justify-center"></i>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Profile Information</h3>
                  <p className="text-sm text-gray-600">Update your contact details</p>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] duration-200 border border-gray-200"
            onClick={() => handleNavigate('/orders')}
            data-testid="card-orders-action"
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <i className="fas fa-clipboard-list text-gray-600 text-2xl w-8 flex items-center justify-center"></i>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">My Orders</h3>
                  <p className="text-sm text-gray-600">Track & manage deliveries</p>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] duration-200 border border-gray-200"
            onClick={() => handleNavigate('/addresses')}
            data-testid="card-addresses"
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <i className="fas fa-map-marker-alt text-gray-600 text-2xl w-8 flex items-center justify-center"></i>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Addresses</h3>
                  <p className="text-sm text-gray-600">Manage delivery locations</p>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] duration-200 border border-gray-200"
            onClick={() => handleNavigate('/wishlist')}
            data-testid="card-wishlist"
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <i className="fas fa-heart text-gray-600 text-2xl w-8 flex items-center justify-center"></i>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Wishlist</h3>
                  <p className="text-sm text-gray-600">Your saved favorites</p>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] duration-200 border border-gray-200"
            onClick={() => handleNavigate('/payments')}
            data-testid="card-wallet"
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <i className="fas fa-wallet text-gray-600 text-2xl w-8 flex items-center justify-center"></i>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Wallet</h3>
                  <p className="text-sm text-gray-600">Balance & transactions</p>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] duration-200 border border-gray-200"
            onClick={() => handleNavigate('/notifications')}
            data-testid="card-messages"
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <i className="fas fa-envelope text-gray-600 text-2xl w-8 flex items-center justify-center"></i>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Messages</h3>
                  <p className="text-sm text-gray-600">Chat & notifications</p>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] duration-200 border border-gray-200"
            onClick={() => handleNavigate('/payments')}
            data-testid="card-transactions"
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <i className="fas fa-receipt text-gray-600 text-2xl w-8 flex items-center justify-center"></i>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Transactions</h3>
                  <p className="text-sm text-gray-600">Payment history</p>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GST Number Section */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">GST Number</h3>
                <p className="text-sm text-gray-600">Do you have a GST number?</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleNavigate('/settings')}
              >
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sign Out Button */}
        <Card className="mb-24">
          <CardContent className="p-0">
            <Button 
              variant="destructive" 
              className="w-full h-12 rounded-lg font-semibold"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
        </div>
        <BottomNav activeTab="profile" />
      </MobileContainer>
    </div>
  );
}