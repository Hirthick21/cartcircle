import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect } from "react";

interface BottomNavProps {
  activeTab: 'home' | 'xtra-mart' | 'search' | 'wishlist' | 'profile';
  cartItemCount?: number;
  showCartButton?: boolean;
  hideCartButton?: boolean;
}

export function BottomNav({ activeTab, cartItemCount = 0, showCartButton = false, hideCartButton = false }: BottomNavProps) {
  const [, navigate] = useLocation();
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


  const navItems = [
    { 
      id: 'home', 
      icon: 'fas fa-house', 
      label: 'Home', 
      path: '/' 
    },
    { 
      id: 'xtra-mart', 
      icon: 'fas fa-store', 
      label: 'Xtra Mart', 
      path: '/xtra-mart' 
    },
    { 
      id: 'search', 
      icon: 'fas fa-search', 
      label: 'Search', 
      path: '/search' 
    },
    { 
      id: 'wishlist', 
      icon: 'fas fa-heart', 
      label: 'Wishlist', 
      path: '/wishlist',
      isSpecial: true
    },
    { 
      id: 'profile', 
      icon: 'fas fa-circle-user', 
      label: 'Profile', 
      path: '/profile' 
    },
  ];

  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('cartButtonPosition');
    if (saved) {
      return JSON.parse(saved);
    }
    return { x: window.innerWidth - 80, y: window.innerHeight - 220 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  // Save position to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartButtonPosition', JSON.stringify(position));
  }, [position]);

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - startPos.current.x;
      const deltaY = touch.clientY - startPos.current.y;
      
      setPosition(prev => ({
        x: Math.max(16, Math.min(window.innerWidth - 80, prev.x + deltaX)),
        y: Math.max(16, Math.min(window.innerHeight - 120, prev.y + deltaY))
      }));
      
      startPos.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;
      
      setPosition(prev => ({
        x: Math.max(16, Math.min(window.innerWidth - 80, prev.x + deltaX)),
        y: Math.max(16, Math.min(window.innerHeight - 120, prev.y + deltaY))
      }));
      
      startPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    if ('touches' in e) {
      startPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else {
      startPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      navigate('/cart');
    }
  };

  return (
    <>
      {/* Floating Cart Button - Draggable - Only show when enabled and not hidden */}
      {showCartButton && !hideCartButton && (
        <div 
          ref={dragRef}
          className="fixed z-50 cursor-move touch-none"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transition: isDragging ? 'none' : 'all 0.3s ease'
          }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <Button
            onClick={handleClick}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 via-orange-600 to-yellow-500 hover:from-yellow-500 hover:via-orange-600 hover:to-orange-500 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 relative border-4 border-white pointer-events-auto"
            data-testid="button-floating-cart"
          >
            <i className="fas fa-shopping-bag text-3xl drop-shadow-lg"></i>
            {cartCount > 0 && (
              <Badge className={`absolute -top-2 -right-2 bg-red-600 text-white border-3 border-white min-w-[28px] h-7 rounded-full flex items-center justify-center px-2 text-sm font-bold shadow-lg transition-all duration-300 ${
                animate ? 'scale-125 animate-pulse' : 'scale-100'
              }`}>
                {cartCount > 99 ? '99+' : cartCount}
              </Badge>
            )}
          </Button>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md px-2 pb-2 z-50">
        <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl border-2 border-gray-300 px-2 py-3 flex justify-around items-center overflow-hidden">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                navigate(item.path);
              }}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-xl transition-all duration-300 min-h-[60px] max-h-[60px] ${
                activeTab === item.id 
                  ? '' 
                  : 'hover:bg-orange-50'
              }`}
              data-testid={`nav-${item.id}`}
            >
              <div className="relative flex items-center justify-center h-6 w-6">
                {item.id === 'wishlist' ? (
                  <i className={`${activeTab === item.id ? 'fas fa-heart' : 'far fa-heart'} ${
                    activeTab === item.id 
                      ? 'text-orange-500 text-lg font-bold' 
                      : 'text-gray-700 text-base font-semibold'
                  } transition-all duration-300`}></i>
                ) : (
                  <i className={`${item.icon} ${
                    activeTab === item.id 
                      ? 'text-primary text-lg font-bold' 
                      : 'text-gray-700 text-base font-semibold'
                  } transition-all`}></i>
                )}
              </div>
              <span className={`text-[10px] font-bold tracking-wide ${
                activeTab === item.id 
                  ? 'text-primary' 
                  : 'text-gray-700'
              }`}>{item.label}</span>
            </Button>
          ))}
        </div>
      </nav>
    </>
  );
}