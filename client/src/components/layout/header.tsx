import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { LocationModal } from "@/components/modals/location-modal";
import { MenuSheet } from "@/components/modals/menu-sheet";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showCart?: boolean;
  showSearch?: boolean;
  onBack?: () => void;
  cartItemCount?: number;
  onLocationClick?: () => void;
  onMenuClick?: () => void;
  currentLocation?: string;
  onLocationSelect?: (location: string) => void;
}

export function Header({ 
  title, 
  subtitle, 
  showBack = true, 
  showCart = false, 
  showSearch = false,
  onBack,
  cartItemCount = 0,
  onLocationClick,
  onMenuClick,
  currentLocation = "Bengaluru, Karnataka",
  onLocationSelect
}: HeaderProps) {
  const [location, navigate] = useLocation();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [savedLocation, setSavedLocation] = useState(currentLocation);
  const { cartItems } = useCart();
  const [animate, setAnimate] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Update cart count whenever cartItems changes
  useEffect(() => {
    const newCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    setCartCount(newCount);
  }, [cartItems]);

  // Listen for cart updates to trigger animation
  useEffect(() => {
    const handleCartUpdate = () => {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };

  const handleLocationSelect = (newLocation: string) => {
    setSavedLocation(newLocation);
    if (onLocationSelect) {
      onLocationSelect(newLocation);
    }
    localStorage.setItem('selectedLocation', newLocation);
  };

  const handleLocationClick = () => {
    if (onLocationClick) {
      onLocationClick();
    } else {
      setIsLocationModalOpen(true);
    }
  };

  const handleMenuClick = () => {
    if (onMenuClick) {
      onMenuClick();
    } else {
      setIsMenuOpen(true);
    }
  };

  const handleCartClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate('/cart');
  };

  const handleSearchClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate('/search');
  };

  const handleNotificationsClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate('/notifications');
  };

  return (
    <>
      <header className="relative overflow-hidden sticky top-0 z-50 seamless-transition">
        {/* Seamless gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFEDD5] via-[#FFEDD5] to-[#FFEDD5]"></div>

        {/* Content */}
        <div className="relative p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {showBack && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleBack}
                  className="bg-white/30 text-gray-800 hover:bg-white/40 rounded-full transition-all duration-300 p-0 w-10 h-10 flex items-center justify-center backdrop-blur-md border border-white/50 shadow-xl hover:scale-105"
                  data-testid="button-back"
                >
                  <i className="fas fa-chevron-left text-lg font-bold drop-shadow-sm"></i>
                </Button>
              )}
              <div className="flex items-center space-x-2">
                <div>
                  <h1 className="text-xl font-bold drop-shadow-sm tracking-wide" style={{ color: '#F76B1E' }} data-testid="text-title">{title}</h1>
                  {subtitle && (
                    <p className="text-orange-400 text-sm font-medium drop-shadow-sm" data-testid="text-subtitle">{subtitle}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {showCart && (
                <>
                  {/* Search Button */}
                  <button
                    onClick={handleSearchClick}
                    className="bg-white/30 text-gray-800 hover:bg-white/40 transition-all duration-300 p-0 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/50 shadow-xl hover:scale-105"
                    data-testid="button-search"
                    title="Search products"
                    type="button"
                  >
                    <i className="fas fa-search text-lg font-bold drop-shadow-sm"></i>
                  </button>

                  {/* Notifications Button */}
                  <button
                    onClick={handleNotificationsClick}
                    className="bg-white/30 text-gray-800 hover:bg-white/40 transition-all duration-300 p-0 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/50 shadow-xl hover:scale-105 relative"
                    data-testid="button-notifications"
                    title="Notifications"
                    type="button"
                  >
                    <i className="fas fa-bell text-lg font-bold drop-shadow-sm"></i>
                  </button>

                  {/* Cart Button - Enhanced with Orangish Fill */}
                  <button
                    onClick={handleCartClick}
                    className="bg-gradient-to-br from-[#FF6B35] via-[#F76B1E] to-[#FF8C42] hover:from-[#FF8C42] hover:via-[#FF6B35] hover:to-[#F76B1E] text-white transition-all duration-300 p-0 w-11 h-11 rounded-full flex items-center justify-center border-2 border-white shadow-2xl hover:shadow-3xl hover:scale-110 relative"
                    data-testid="button-cart"
                    title="Shopping Cart"
                    type="button"
                  >
                    <i className="fas fa-shopping-cart text-lg font-bold drop-shadow-lg"></i>
                    {cartCount > 0 && (
                      <Badge className={`absolute -top-2 -right-2 bg-gradient-to-br from-orange-600 to-red-600 text-white border-2 border-white min-w-[22px] h-6 rounded-full flex items-center justify-center px-1.5 text-xs font-bold shadow-lg transition-all duration-300 ${
                        animate ? 'scale-125 animate-pulse' : 'scale-100'
                      }`}>
                        {cartCount > 99 ? '99+' : cartCount}
                      </Badge>
                    )}
                  </button>

                  {/* Location Button */}
                  <button
                    onClick={() => setIsLocationModalOpen(true)}
                    className="bg-white/30 text-gray-800 hover:bg-white/40 transition-all duration-300 p-0 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/50 shadow-xl hover:scale-105"
                    data-testid="button-location"
                    title={`Current location: ${savedLocation}`}
                    type="button"
                  >
                    <i className="fas fa-map-marker-alt text-lg font-bold drop-shadow-sm"></i>
                  </button>

                  {/* Menu Button */}
                  <button
                    onClick={() => setIsMenuOpen(true)}
                    className="bg-white/30 text-gray-800 hover:bg-white/40 transition-all duration-300 p-0 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/50 shadow-xl hover:scale-105"
                    data-testid="button-menu"
                    type="button"
                  >
                    <i className="fas fa-bars text-lg font-bold drop-shadow-sm"></i>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Location Modal */}
      <LocationModal
        open={isLocationModalOpen}
        onOpenChange={setIsLocationModalOpen}
        onLocationSelect={handleLocationSelect}
      />

      {/* Menu Sheet */}
      <MenuSheet
        open={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        onLocationClick={() => {
          setIsMenuOpen(false);
          setIsLocationModalOpen(true);
        }}
        currentLocation={savedLocation}
        onMenuStateChange={setIsMenuOpen}
      />
    </>
  );
}