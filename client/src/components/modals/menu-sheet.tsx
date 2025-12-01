import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LocationModal } from "./location-modal";
import { useToast } from "@/hooks/use-toast";

interface MenuSheetProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onLocationClick?: () => void;
  currentLocation?: string;
  onMenuStateChange?: (isOpen: boolean) => void;
}

export function MenuSheet({ children, open, onOpenChange, onLocationClick, propCurrentLocation, onMenuStateChange }: MenuSheetProps) {
  const [location, navigate] = useLocation();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(propCurrentLocation || "Bengaluru, Karnataka");
  const [isSheetOpen, setIsSheetOpen] = useState(open || false);
  const { toast } = useToast();

  // Notify parent when menu state changes
  useEffect(() => {
    const menuOpen = open !== undefined ? open : isSheetOpen;
    onMenuStateChange?.(menuOpen);
  }, [open, isSheetOpen, onMenuStateChange]);

  const handleLocationSelect = (location: string) => {
    setCurrentLocation(location);
    // Store in localStorage for persistence
    localStorage.setItem('selectedLocation', location);
  };

  const handleLocationButtonClick = () => {
    if (onOpenChange) {
      onOpenChange(false); // Close menu sheet via prop
    } else {
      setIsSheetOpen(false); // Close menu sheet
    }
    if (onLocationClick) {
      onLocationClick(); // Use prop handler
    } else {
      setIsLocationModalOpen(true); // Open location modal
    }
  };

  // Load saved location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) {
      setCurrentLocation(savedLocation);
    }
  }, []);


  const menuItems = [
    {
      icon: "fas fa-user-circle",
      title: "My Profile",
      subtitle: "Manage your account",
      action: () => handleProfileClick()
    },
    {
      icon: "fas fa-clipboard-list",
      title: "My Orders",
      subtitle: "Track your orders",
      action: () => handleOrdersClick()
    },
    {
      icon: "fas fa-heart",
      title: "Wishlist",
      subtitle: "Your favorite items",
      action: () => handleWishlistClick()
    },
    {
      icon: "fas fa-map-marker-alt",
      title: "Saved Addresses",
      subtitle: "Manage delivery locations",
      action: () => handleAddressesClick()
    },
    {
      icon: "fas fa-wallet",
      title: "Payment Methods",
      subtitle: "Manage your payments",
      action: () => handlePaymentsClick()
    },
    {
      icon: "fas fa-question-circle",
      title: "Help & Support",
      subtitle: "Get assistance",
      action: () => handleSupportClick()
    },
    {
      icon: "fas fa-star",
      title: "Rate & Review",
      subtitle: "Share your experience",
      action: () => handleRatingClick()
    },
    {
      icon: "fas fa-cog",
      title: "Settings",
      subtitle: "App preferences",
      action: () => handleSettingsClick()
    }
  ];

  const closeSheet = () => {
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      setIsSheetOpen(false);
    }
  };

  const handleProfileClick = () => {
    closeSheet();
    navigate('/profile');
  };

  const handleOrdersClick = () => {
    closeSheet();
    navigate('/orders');
  };

  const handleWishlistClick = () => {
    closeSheet();
    navigate('/wishlist');
  };

  const handleAddressesClick = () => {
    closeSheet();
    navigate('/addresses');
  };

  const handlePaymentsClick = () => {
    closeSheet();
    navigate('/payments');
  };

  const handleSupportClick = () => {
    closeSheet();
    navigate('/support');
  };

  const handleRatingClick = () => {
    closeSheet();
    toast({
      title: "Rate & Review",
      description: "Complete an order first to leave a review",
    });
  };

  const handleSettingsClick = () => {
    closeSheet();
    navigate('/settings');
  };

  const handleLogout = () => {
    closeSheet();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    // Clear any auth tokens or user data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    navigate('/');
  };

  return (
    <>
      <Sheet open={open !== undefined ? open : isSheetOpen} onOpenChange={onOpenChange || setIsSheetOpen}>
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
        <SheetContent side="right" className="w-80 p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader className="p-6 pb-4">
              <SheetTitle className="text-left text-xl font-bold text-gray-900">Menu</SheetTitle>
            </SheetHeader>

            {/* Delivering To Button */}
            <div className="px-6 pb-4">
              <Button
                onClick={handleLocationButtonClick}
                variant="outline"
                className="w-full justify-start h-auto p-4 border-gray-200 hover:border-fuel-yellow-300 hover:bg-fuel-yellow-50 transition-colors"
              >
                <div className="flex items-center space-x-3 w-full min-w-0">
                  <div className="w-8 h-8 bg-fuel-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-map-marker-alt text-fuel-yellow-600 text-sm"></i>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Delivering to</p>
                    <p className="text-sm font-semibold text-gray-900 truncate max-w-full overflow-hidden" title={propCurrentLocation || currentLocation}>
                      {(propCurrentLocation || currentLocation).length > 30
                        ? `${(propCurrentLocation || currentLocation).substring(0, 30)}...`
                        : (propCurrentLocation || currentLocation)}
                    </p>
                  </div>
                  <i className="fas fa-chevron-right text-gray-400 text-sm flex-shrink-0"></i>
                </div>
              </Button>
            </div>

            <Separator />

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-2">
              <div className="space-y-1 px-4">
                {menuItems.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start h-auto p-4 hover:bg-gray-50 transition-colors"
                    onClick={item.action}
                  >
                    <div className="flex items-center space-x-4 w-full">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <i className={`${item.icon} text-gray-600 text-sm`}></i>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.subtitle}</p>
                      </div>
                      <i className="fas fa-chevron-right text-gray-300 text-sm"></i>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Logout */}
            <div className="p-4">
              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-4 hover:bg-red-50 transition-colors"
                onClick={handleLogout}
              >
                <div className="flex items-center space-x-4 w-full">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-sign-out-alt text-red-600 text-sm"></i>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-red-600">Logout</p>
                    <p className="text-xs text-red-400">Sign out of your account</p>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <LocationModal
        open={isLocationModalOpen}
        onOpenChange={(isOpen) => {
          setIsLocationModalOpen(isOpen);
          if (!isOpen) {
            // If modal is closed, re-open the sheet if it was open before
            if (isSheetOpen) {
              // Logic to re-open sheet if needed, or simply rely on the user to open it again
            }
          }
        }}
        onLocationSelect={handleLocationSelect}
      />
    </>
  );
}