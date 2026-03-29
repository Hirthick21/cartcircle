import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { MobileContainer } from "@/components/layout/mobile-container";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LocationModal } from "@/components/modals/location-modal";
import { MenuSheet } from "@/components/modals/menu-sheet";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { FeaturesGrid } from "@/components/features/features-grid";
import { Input } from "@/components/ui/input";
import { ProductGrid } from "@/components/product/product-grid";
import backgroundImage from "@assets/generated_images/ONDC_marketplace_products_background_6d9daea8.png";


function Home() {
  const [, navigate] = useLocation();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Bengaluru, Karnataka");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [hideCartButton, setHideCartButton] = useState(false);
  const [isSearchBarSticky, setIsSearchBarSticky] = useState(false);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const scrollingTexts = [
    "Your Home 🏠",
    "Your Office 🏢",
    "Your Festival 🎆",
    "Your Function 💒",
    "Your Gathering 👥",
    "Your Celebration 🎉",
    "Your Event 📅",
    "Your Party 🥳"
  ];

  const placeholderWords = ["products", "groceries", "electronics", "fashion", "essentials"];

  const handleLocationSelect = (location: string) => {
    setCurrentLocation(location);
    // Store in localStorage for persistence
    localStorage.setItem('selectedLocation', location);
  };

  // Load saved location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) {
      setCurrentLocation(savedLocation);
    }
  }, []);

  // Hide cart button when menu or location modal is open
  useEffect(() => {
    setHideCartButton(isMenuOpen || isLocationModalOpen);
  }, [isMenuOpen, isLocationModalOpen]);

  // Handle scroll to make search bar sticky
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Make search bar sticky when header (approximately 180px) is scrolled past
      if (scrollPosition > 180) {
        setIsSearchBarSticky(true);
      } else {
        setIsSearchBarSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: featuredProducts } = useQuery({
    queryKey: ['/api/products/featured'],
    enabled: true,
  });

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['/api/products/search', { q: searchQuery }],
    enabled: searchQuery.length > 2,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => {
        return (prevIndex + 1) % scrollingTexts.length;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [scrollingTexts.length]);

  useEffect(() => {
    const placeholderTimer = setInterval(() => {
      setCurrentPlaceholderIndex((prev) => {
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * placeholderWords.length);
        } while (nextIndex === prev && placeholderWords.length > 1);
        return nextIndex;
      });
    }, 2500);
    return () => clearInterval(placeholderTimer);
  }, [placeholderWords.length]);

  const userName = 'Guest';

  const categories = [
    {
      id: 'all',
      name: 'All',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop',
      bgColor: 'bg-gradient-to-br from-yellow-100 to-orange-200',
      textColor: 'text-orange-700'
    },
    {
      id: 'grocery',
      name: 'Grocery',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop',
      bgColor: 'bg-gradient-to-br from-green-100 to-green-200',
      textColor: 'text-green-700'
    },
    {
      id: 'fashion',
      name: 'Fashion',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&h=100&fit=crop',
      bgColor: 'bg-gradient-to-br from-purple-100 to-purple-200',
      textColor: 'text-purple-700'
    },
    {
      id: 'electronics',
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=100&h=100&fit=crop',
      bgColor: 'bg-gradient-to-br from-blue-100 to-blue-200',
      textColor: 'text-blue-700'
    },
    {
      id: 'home-kitchen',
      name: 'Home & Kitchen',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7636?w=100&h=100&fit=crop',
      bgColor: 'bg-gradient-to-br from-orange-100 to-orange-200',
      textColor: 'text-orange-700'
    },
    {
      id: 'health',
      name: 'Health',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop',
      bgColor: 'bg-gradient-to-br from-red-100 to-red-200',
      textColor: 'text-red-700'
    },
    {
      id: 'beauty',
      name: 'Beauty',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop',
      bgColor: 'bg-gradient-to-br from-pink-100 to-pink-200',
      textColor: 'text-pink-700'
    },
    {
      id: 'books',
      name: 'Books',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop',
      bgColor: 'bg-gradient-to-br from-indigo-100 to-indigo-200',
      textColor: 'text-indigo-700'
    },
    {
      id: 'sports',
      name: 'Sports',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f98b051a?w=100&h=100&fit=crop',
      bgColor: 'bg-gradient-to-br from-teal-100 to-teal-200',
      textColor: 'text-teal-700'
    },
    {
      id: 'automotive',
      name: 'Automotive',
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=100&h=100&fit=crop',
      bgColor: 'bg-gradient-to-br from-gray-100 to-gray-200',
      textColor: 'text-gray-700'
    },
    {
      id: 'baby-kids',
      name: 'Baby & Kids',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=100&h=100&fit=crop',
      bgColor: 'bg-gradient-to-br from-yellow-100 to-yellow-200',
      textColor: 'text-yellow-700'
    },
    {
      id: 'pets',
      name: 'Pets',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=100&h=100&fit=crop',
      bgColor: 'bg-gradient-to-br from-amber-100 to-amber-200',
      textColor: 'text-amber-700'
    },
    {
      id: 'appliances',
      name: 'Appliances',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=100&h=100&fit=crop',
      bgColor: 'bg-gradient-to-br from-slate-100 to-slate-200',
      textColor: 'text-slate-700'
    },
    {
      id: 'toys',
      name: 'Toys',
      image: 'https://images.unsplash.com/photo-1558060370-d6444479cb6f7?w=100&h=100&fit=crop',
      bgColor: 'bg-gradient-to-br from-cyan-100 to-cyan-200',
      textColor: 'text-cyan-700'
    },
    {
      id: 'agri-inputs',
      name: 'Agriculture',
      image: 'https://images.unsplash.com/photo-1592982468874-2f7e8b5b5a7a?w=100&h=100&fit=crop',
      bgColor: 'bg-gradient-to-br from-lime-100 to-lime-200',
      textColor: 'text-lime-700'
    },
    {
      id: 'hardware',
      name: 'Hardware',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=100&h=100&fit=crop',
      bgColor: 'bg-gradient-to-br from-stone-100 to-stone-200',
      textColor: 'text-stone-700'
    }
  ];

  const giftCardBrands = [
    {
      name: "Kalyan Jewellers",
      discount: "5%",
      color: "bg-gradient-to-br from-yellow-400 to-orange-500",
      logo: "💎"
    },
    {
      name: "Woodland",
      discount: "9%",
      color: "bg-gradient-to-br from-orange-400 to-yellow-500",
      logo: "🌲"
    },
    {
      name: "Fabindia",
      discount: "9%",
      color: "bg-gradient-to-br from-amber-500 to-orange-500",
      logo: "🧵"
    },
    {
      name: "Amazon",
      discount: "2%",
      color: "bg-gradient-to-br from-orange-400 to-yellow-500",
      logo: "📦"
    },
    {
      name: "MakeMyTrip",
      discount: "7%",
      color: "bg-gradient-to-br from-yellow-500 to-amber-500",
      logo: "✈️"
    },
    {
      name: "Jockey",
      discount: "UP TO 15%",
      color: "bg-gradient-to-br from-orange-600 to-yellow-600",
      logo: "👕"
    }
  ];

  const sellerCollections = [
    {
      title: "ONDC Sellers on Network",
      subtitle: "Verified Sellers",
      items: [
        {
          name: "Organic Spices",
          brand: "Organic Spice Co",
          discount: "Starting at ₹20",
          image: "https://images.unsplash.com/photo-1596040033229-a982194a762d?w=300&h=200&fit=crop",
          bgColor: "bg-gradient-to-br from-green-100 to-green-200"
        },
        {
          name: "Rice Selection",
          brand: "Premium Grains",
          discount: "Starting at ₹95",
          image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop",
          bgColor: "bg-gradient-to-br from-yellow-100 to-orange-200"
        }
      ]
    },
    {
      title: "Top Deals by Brands",
      subtitle: "Exclusive Offers",
      items: [
        {
          name: "Footwear Collection",
          brand: "Paragon",
          discount: "Up to 64% OFF",
          image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=200&fit=crop",
          bgColor: "bg-gradient-to-br from-blue-100 to-cyan-200"
        },
        {
          name: "Electronics",
          brand: "Hammer",
          discount: "Up to 87% OFF",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop",
          bgColor: "bg-gradient-to-br from-gray-100 to-gray-200"
        }
      ]
    }
  ];

  const recentlyViewedProducts = [
    {
      id: "rv1",
      name: "Baltra 1.8L 1500W Stainless Steel Electric Kettle",
      seller: "BALTRA",
      price: "₹525",
      originalPrice: "₹1,075",
      discount: "51% OFF",
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop",
      unit: "1 unit",
      freeShipping: true
    },
    {
      id: "rv2",
      name: "Walta Elite Swar Wired Earphone - Black",
      seller: "TechBzar",
      price: "₹99",
      originalPrice: "₹199",
      discount: "50% OFF",
      image: "https://images.unsplash.com/photo-1484704849700-f032228b5c3b?w=200&h=200&fit=crop",
      unit: "1 unit",
      freeShipping: false
    }
  ];

  const promotionalBanners = [
    {
      title: "Carry Class, Not Just Stuff",
      subtitle: "UP TO 70% OFF",
      description: "Modern Style for Work, Travel, and Daily Commutes",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=200&fit=crop",
      bgColor: "bg-gradient-to-r from-orange-600 to-orange-700",
      buttonText: "SHOP NOW",
      brand: "Mystore"
    },
    {
      title: "Fresh Produce",
      subtitle: "Free Shipping",
      description: "Farm fresh vegetables and fruits",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=200&fit=crop",
      bgColor: "bg-gradient-to-r from-orange-600 to-orange-700",
      buttonText: "SHOP NOW",
      brand: "Fresh Market"
    },
    {
      title: "Flawless and Timeless",
      subtitle: "UP TO 40% OFF",
      description: "Natural & Herbal Products for Glowing, Nourishing Skin",
      image: "https://images.unsplash.com/photo-1556228720-195a6721a803?w=400&h=200&fit=crop",
      bgColor: "bg-gradient-to-r from-orange-600 to-orange-700",
      buttonText: "SHOP NOW",
      brand: "Beauty Plus"
    }
  ];

  const bestPriceProducts = [
    {
      id: '1',
      name: 'Fresh Tomatoes',
      price: 'Rp 15,000',
      oldPrice: 'Rp 20,000',
      unit: '/kg',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&h=200&fit=crop',
    },
    {
      id: '2',
      name: 'Organic Chicken',
      price: 'Rp 35,000',
      oldPrice: 'Rp 45,000',
      unit: '/kg',
      image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=200&h=200&fit=crop',
    },
  ];

  const popularSearches = ["Apples", "Milk", "Bread", "Chicken", "Vegetables", "Fruits", "Rice", "Eggs"];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setShowSearchResults(event.target.value.length > 0);
  };

  const handleSearchFocus = () => {
    if (searchQuery.length > 0) {
      setShowSearchResults(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleBannerClick = (banner: typeof promotionalBanners[0]) => {
    // Navigate to search page with the banner promotion data
    const searchParams = new URLSearchParams({
      promotion: banner.title,
      category: banner.title.toLowerCase().includes('fashion') ? 'fashion' : 
                banner.title.toLowerCase().includes('beauty') ? 'beauty' : 
                banner.title.toLowerCase().includes('produce') ? 'grocery' : 'all',
      q: banner.title
    });
    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <MobileContainer>
      {/* Custom Header */}
      <div className="gradient-header text-white p-2 pb-1.5 relative overflow-hidden">
        <div className="flex justify-between items-start gap-2 w-full relative z-10">
          <div className="flex-1 min-w-0 pr-2 xs:pr-3">
            <p className="text-xs opacity-95 mb-0.5 font-extrabold" style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }}>Hello, {userName} 👋</p>
            <h1 className="text-sm xs:text-base sm:text-2xl mt-0 xs:mt-0.5 leading-tight font-bold" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>Find The Right One For </h1>
            <div className="h-6 xs:h-7 sm:h-8 overflow-hidden relative mb-0.5">
              <div
                className="transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateY(-${currentTextIndex * (window.innerWidth < 475 ? 24 : window.innerWidth < 640 ? 28 : 32)}px)`
                }}
              >
                {scrollingTexts.map((text, index) => (
                  <h2
                    key={index}
                    className="text-sm xs:text-base sm:text-2xl drop-shadow-lg leading-tight h-6 xs:h-7 sm:h-8 flex items-center text-[#fefefe] font-medium"
                  >
                    {text}
                  </h2>
                ))}
              </div>
            </div>
            </div>
          <div className="flex space-x-1.5 xs:space-x-2 sm:space-x-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Delivery location button clicked');
                setIsLocationModalOpen(true);
              }}
              className="bg-white/95 backdrop-blur-sm p-1.5 xs:p-2 sm:p-2.5 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-200 flex-shrink-0 cursor-pointer border border-white/50"
              data-testid="button-delivery-location"
              title={`Delivering to: ${currentLocation}`}
              type="button"
            >
              <i className="fas fa-map-marker-alt text-primary text-sm xs:text-base sm:text-xl font-bold"></i>
            </button>
            <MenuSheet 
                  open={isMenuOpen} 
                  onOpenChange={setIsMenuOpen}
                  onLocationClick={() => setIsLocationModalOpen(true)}
                  currentLocation={currentLocation}
                  onMenuStateChange={setIsMenuOpen}
                >
              <button
                className="bg-white p-1.5 xs:p-2 sm:p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform flex-shrink-0 cursor-pointer"
                data-testid="button-menu"
                type="button"
              >
                <i className="fas fa-bars text-primary text-sm xs:text-base sm:text-xl font-bold"></i>
              </button>
            </MenuSheet>
          </div>
        </div>

        {/* Groceries decorative image — curvy bottom blend */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden"
          style={{ height: '72%' }}
        >
          <div
            className="absolute bottom-0 left-0 right-0 overflow-hidden"
            style={{
              height: '100%',
              borderRadius: '55% 55% 0 0 / 35% 35% 0 0',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
              alt=""
              className="w-full h-full object-cover object-bottom"
              style={{
                opacity: 0.1,
                mixBlendMode: 'overlay',
                maskImage: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Seamless Blend Section - Ultra smooth gradient from orange to peach to white */}
      <div className="relative -mt-3 pt-1" style={{
        background: 'linear-gradient(180deg, #F1AC23 0%, #F3B231 5%, #F5B83F 10%, #F7BE4D 15%, #F9C45B 20%, #FBCA69 25%, #FDD077 30%, #FFD685 35%, #FFDC93 40%, #FFE2A1 45%, #FFE8AF 50%, #FFEEBD 55%, #FFF4CB 60%, #FFF8D9 65%, #FFFAE4 70%, #FFFceF 75%, #FFFDf7 80%, #FFFEFB 85%, #FFFFFF 90%, #FFFFFF 95%)',
        paddingBottom: '0.5rem'
      }}>

      {/* Compact Search Bar - Optimized spacing */}
      <div 
        className="transition-all duration-300 ease-in-out z-20"
        style={{
          position: isSearchBarSticky ? 'fixed' : 'relative',
          top: isSearchBarSticky ? 0 : 'auto',
          left: isSearchBarSticky ? 0 : 'auto',
          right: isSearchBarSticky ? 0 : 'auto',
          padding: isSearchBarSticky ? '0.75rem' : '0.75rem 0.75rem 0.5rem 0.75rem',
          maxWidth: isSearchBarSticky ? '28rem' : '100%',
          margin: isSearchBarSticky ? '0 auto' : '0',
          background: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          borderBottom: 'none',
          boxShadow: 'none'
        }}
      >
        <div className="compact-search-container w-full mx-auto transition-all duration-300">
          <div className="relative animated-placeholder">
            <Input
              type="text"
              placeholder=""
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onClick={() => navigate('/search')}
              className="compact-search-input w-full transition-all duration-300 cursor-pointer"
              style={{
                background: isSearchBarSticky ? 'rgba(255, 237, 213, 0.95)' : 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(241, 172, 35, 0.2)'
              }}
              readOnly
            />
            <i className="fas fa-search absolute left-3 xs:left-4 top-1/2 transform -translate-y-1/2 text-primary text-base pointer-events-none"></i>
            {!searchQuery && (
              <div className="placeholder-animation">
                <span>Search for </span>
                <span
                  key={currentPlaceholderIndex}
                  className="placeholder-word"
                >
                  {placeholderWords[currentPlaceholderIndex]}...
                </span>
              </div>
            )}
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-2 xs:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 w-6 h-6 p-0 rounded-full transition-all duration-200"
              >
                <i className="fas fa-times text-xs"></i>
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Spacer to prevent content jump when search bar becomes sticky */}
      {isSearchBarSticky && <div className="h-[56px]"></div>}
      <div className="pb-20" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem', paddingTop: '0.5rem' }}>
        {/* Search Results Section */}
        {showSearchResults && (
          <div className="mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 font-sans">
                  {searchQuery.length > 2 ? "Search Results" : "Popular Searches"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>

              {searchQuery.length < 2 ? (
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search) => (
                    <Button
                      key={search}
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchQuery(search)}
                      className="bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors font-sans"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              ) : searchLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-4 animate-pulse">
                      <div className="flex space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (searchResults as any)?.products?.length ? (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {(searchResults as any).products.map((product: any) => (
                    <div key={product.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex space-x-4">
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1560806887-1e4cd0f6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150'}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 font-sans">{product.name}</h4>
                          <p className="text-sm text-gray-600 font-sans">{product.description}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-lg font-bold text-primary font-sans">₹{product.price}</span>
                            <Button 
                              size="sm" 
                              className="text-white font-bold px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                              style={{
                                backgroundColor: '#F1AC23',
                                borderColor: '#F1AC23'
                              }}
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                    <i className="fas fa-search text-gray-400"></i>
                  </div>
                  <p className="text-gray-500 font-sans">No products found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>
        )}


        {/* Enhanced Promotional Banner with Background Image */}
        <div className="relative overflow-hidden rounded-xl mb-3 mt-4 h-40 cursor-pointer hover:scale-[1.02] transition-transform duration-300" onClick={() => handleBannerClick(promotionalBanners[currentBanner])}>
          <div className="flex transition-transform duration-500 ease-in-out h-full" style={{ transform: `translateX(-${currentBanner * 100}%)` }}>
            {promotionalBanners.map((banner, index) => (
              <div key={index} className="min-w-full h-full relative">
                {/* Background Image */}
                <img 
                  src={backgroundImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    filter: 'brightness(0.6) saturate(1.5) sepia(0.3) hue-rotate(15deg) blur(0.3px)',
                  }}
                />

                {/* Goldish Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/70 to-orange-600/80 backdrop-blur-sm"></div>

                <div className="absolute inset-0 p-4 flex flex-col justify-between overflow-hidden">
                  {/* Decorative pattern overlay */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                  </div>

                  {/* Top Section */}
                  <div className="relative z-10 flex items-start justify-between mb-0">
                    <div className="flex-1 max-w-[70%]">
                      <div className="bg-white/30 backdrop-blur-sm rounded-full px-3 py-1 inline-block mb-0.5 border border-white/20">
                        <span className="text-xs font-bold text-white font-sans drop-shadow-lg">Limited Time Offer</span>
                      </div>
                      <h3 className="text-xl font-extrabold leading-tight mb-0.5 text-white font-sans" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                        {banner.subtitle}
                      </h3>
                      <p className="text-sm font-semibold mb-0.5 text-white font-sans" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>{banner.title}</p>
                      <p className="text-xs leading-tight text-white/95 font-sans" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}>{banner.description}</p>
                    </div>

                    {/* Right Image */}
                    <div className="relative">
                      <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg overflow-hidden border border-white/20">
                        <img 
                          src={banner.image} 
                          alt={banner.title}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section with Decorative elements only */}
                  <div className="relative z-10 flex items-center justify-end mt-0">
                    {/* Decorative sparkles */}
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-ping shadow-lg"></div>
                      <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-ping shadow-lg" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-ping shadow-lg" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Banner Indicators */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`h-1.5 rounded-full transition-all cursor-pointer shadow-lg ${
                  currentBanner === index
                    ? 'w-6 bg-white'
                    : 'w-1.5 bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-4 sm:mb-6">
          <div className="flex justify-between items-center mb-3 sm:mb-4 px-1">
            <h3 className="section-heading">Categories</h3>
            <Link href="/search">
              <span className="text-primary text-sm font-semibold hover:underline font-sans">Show All</span>
            </Link>
          </div>
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((category) => (
              <Link key={category.id} href={`/search?category=${category.id}`}>
                <div className="flex flex-col items-center min-w-[60px] hover:scale-105 transition-transform">
                  <div className={`w-12 h-12 ${category.bgColor} rounded-full flex items-center justify-center mb-1.5 shadow-sm hover:shadow-md transition-shadow border-2 border-white flex-shrink-0 overflow-hidden p-1`}>
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className="text-xs text-gray-700 text-center font-medium leading-tight font-sans truncate max-w-[60px]">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stores Near You Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="section-heading">Stores near you</h3>
            <Link href="/search?category=stores">
              <span className="text-primary text-sm font-semibold hover:underline font-sans">View All</span>
            </Link>
          </div>
          <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2 px-1">
            {[
              {
                id: "balaji_bengaluru",
                name: "Balaji Bengaluru Departmental",
                logo: "🏪",
                rating: 4.2,
                categories: ["Grocery", "Health & Wellness"],
                productCount: 10,
                description: "Complete grocery store with fresh produce",
                deliveryTime: "20-30 min"
              },
              {
                id: "apple_supermarket",
                name: "Apple Supermarket",
                logo: "🍎",
                rating: 4.5,
                categories: ["Fruits", "Electronics"],
                productCount: 10,
                description: "Premium supermarket with fresh fruits",
                deliveryTime: "15-25 min"
              },
              {
                id: "buynxt_ondc",
                name: "BuyNxt ONDC",
                logo: "🛒",
                rating: 4.0,
                categories: ["Electronics", "Smart Home"],
                productCount: 10,
                description: "Tech store specializing in electronics",
                deliveryTime: "30-45 min"
              },
              {
                id: "adidas_bengaluru",
                name: "Adidas Store - Bengaluru",
                logo: "👟",
                rating: 4.3,
                categories: ["Fashion", "Sports"],
                productCount: 10,
                description: "Premium sports and fashion store",
                deliveryTime: "25-35 min"
              },
              {
                id: "big_bazaar",
                name: "Big Bazaar",
                logo: "🏬",
                rating: 4.1,
                categories: ["Grocery", "Fashion"],
                productCount: 15,
                description: "One-stop shop for all your needs",
                deliveryTime: "40-50 min"
              },
              {
                id: "reliance_fresh",
                name: "Reliance Fresh",
                logo: "🥬",
                rating: 4.4,
                categories: ["Grocery", "Fruits"],
                productCount: 12,
                description: "Fresh groceries and vegetables",
                deliveryTime: "20-30 min"
              }
            ].map((store, index) => (
              <Card
                key={index}
                className="min-w-[160px] max-w-[160px] hover:shadow-md transition-shadow cursor-pointer flex-shrink-0"
                onClick={() => navigate(`/search?store=${store.id}`)}
              >
                <CardContent className="p-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl">{store.logo}</span>
                  </div>
                  <p className="text-xs font-medium text-gray-700 mb-1 font-sans text-center line-clamp-2 h-8">{store.name}</p>
                  <p className="text-xs text-gray-500 mb-2 font-sans text-center line-clamp-2 h-8">{store.description}</p>
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <i className="fas fa-star text-yellow-400 text-xs"></i>
                    <span className="text-xs text-gray-600">{store.rating}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{store.productCount}+ items</span>
                  </div>
                  <div className="text-center mb-2">
                    <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                      <i className="fas fa-clock text-xs mr-1"></i>
                      {store.deliveryTime}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {store.categories.slice(0, 2).map((category, catIndex) => (
                      <span key={catIndex} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                        {category}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Gift Cards Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="section-heading">Gift Cards</h3>
            <Link href="/search?category=gift-cards">
              <span className="text-primary text-sm font-semibold hover:underline font-sans">View All</span>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {giftCardBrands.slice(0, 6).map((brand, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-2">
                  <div className={`${brand.color} h-16 rounded-lg flex items-center justify-center mb-2 relative`}>
                    <span className="text-xl">{brand.logo}</span>
                    <div className="absolute top-1 right-1 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                      {brand.discount}
                    </div>
                  </div>
                  <p className="text-xs font-medium text-gray-700 text-center font-sans truncate">{brand.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recently Viewed Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="section-heading">Recently Viewed</h3>
            <Link href="/search?category=recently-viewed">
              <span className="text-primary text-sm font-semibold hover:underline font-sans">View All</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {recentlyViewedProducts.map((product) => (
              <Card 
                    key={product.id} 
                    className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                <CardContent className="p-3">
                  <div className="aspect-square overflow-hidden bg-gray-100 rounded-lg mb-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-sm text-gray-900 mb-1 font-sans line-clamp-2 h-8">{product.name}</h4>
                  <p className="text-xs text-gray-600 mb-1 font-sans">Seller - {product.seller}</p>
                  <p className="text-xs text-gray-500 mb-2 font-sans">{product.unit}</p>
                  <div className="flex items-baseline space-x-1 mb-2">
                    <span className="text-lg font-bold text-gray-900 font-sans">{product.price}</span>
                    <span className="text-xs text-gray-500 line-through font-sans">{product.originalPrice}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      {product.discount}
                    </Badge>
                    {product.freeShipping && (
                      <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                        <i className="fas fa-truck text-xs mr-1"></i>
                        Free Shipping
                      </Badge>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="text-white font-bold px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex-1"
                      style={{
                        backgroundColor: '#F1AC23',
                        borderColor: '#F1AC23'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: parseFloat(product.price.replace('₹', '').replace(',', '')),
                          images: [product.image],
                          unit: product.unit,
                          sellerId: product.seller.toLowerCase().replace(/\s+/g, '-'),
                          sellerName: product.seller
                        });
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ONDC Seller Collections */}
        {sellerCollections.map((collection, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-center mb-3 px-1">
              <div>
                <h3 className="section-heading">{collection.title}</h3>
                <p className="text-sm text-gray-600 font-sans">{collection.subtitle}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary hover:text-primary/80"
                onClick={() => navigate('/search')}
              >
                <i className="fas fa-arrow-right text-sm"></i>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {collection.items.map((item, itemIndex) => (
                <Card key={itemIndex} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className={`${item.bgColor} h-20 relative overflow-hidden`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute bottom-2 left-2">
                        <p className="text-white text-xs font-bold font-sans">{item.discount}</p>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-bold text-sm text-gray-900 mb-1 font-sans">{item.name}</h4>
                      <p className="text-xs text-gray-600 font-sans">{item.brand}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Xtra Mart Strategic Features */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="font-bold text-lg text-[#fc943a] font-sans">shop on Xtra Mart</h3>
            <span className="text-xs text-white px-3 py-1 rounded-full font-bold shadow-md bg-[#0053a6]">Premium Features</span>
          </div>
          <FeaturesGrid />
        </div>



        {/* Featured Products - only show when not searching */}
        {!showSearchResults && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="section-heading">Featured Products</h3>
              <Link href="/search">
                <span className="text-primary text-sm font-semibold hover:underline font-sans">View All</span>
              </Link>
            </div>
            <ProductGrid 
              products={(featuredProducts as any)?.products || []} 
              onProductClick={(productId) => {
                // Navigate to product detail or handle as needed
                console.log('Product clicked:', productId);
              }}
            />
          </div>
        )}

        {/* Best Price Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="section-heading">Best Price</h3>
            <Link href="/search">
              <span className="text-primary text-sm font-semibold hover:underline font-sans">Show All</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {bestPriceProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-sm text-gray-900 mb-1 font-sans">{product.name}</h4>
                    <p className="text-xs text-gray-700 font-medium font-sans">{product.unit}</p>
                    <div className="flex items-baseline space-x-2 mt-2">
                      <span className="text-sm font-extrabold text-gray-900 font-sans">{product.price}</span>
                      <span className="text-xs text-gray-500 line-through font-sans">{product.oldPrice}</span>
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-2 text-white font-bold px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                      style={{
                        backgroundColor: '#F1AC23',
                        borderColor: '#F1AC23'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: parseFloat(product.price.replace('Rp ', '').replace(',', '')),
                          images: [product.image],
                          unit: product.unit,
                          sellerId: 'best-price-store',
                          sellerName: 'Best Price Store'
                        });
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link href="/orders">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" data-testid="card-orders">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="fas fa-box text-xl text-primary"></i>
                </div>
                <p className="text-sm font-medium text-gray-700 font-sans">My Orders</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/support">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" data-testid="card-support">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="fas fa-headset text-xl text-primary"></i>
                </div>
                <p className="text-sm font-medium text-gray-700 font-sans">Support</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
      </div>

      <BottomNav activeTab="home" showCartButton={!hideCartButton} />

      {/* Location Modal */}
      <LocationModal
        open={isLocationModalOpen}
        onOpenChange={setIsLocationModalOpen}
        onLocationSelect={handleLocationSelect}
      />
    </MobileContainer>
  );
}

export default Home;