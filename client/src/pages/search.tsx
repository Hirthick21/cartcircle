import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { MobileContainer } from "@/components/layout/mobile-container";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductCard } from "@/components/product/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Search() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Get URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const store = urlParams.get('store');
    const promotion = urlParams.get('promotion');
    const query = urlParams.get('q');

    if (category) {
      setActiveCategory(category);
    }
    if (store) {
      setActiveStore(store);
      setSearchQuery(''); // Clear search when filtering by store
    }
    if (promotion && query) {
      setSearchQuery(query);
      setActiveCategory(category || '');
    }
  }, [window.location.search]);

  const [activeStore, setActiveStore] = useState("");

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['/api/products/search', { q: searchQuery, category: activeCategory, store: activeStore }],
    enabled: searchQuery.length > 0 || activeCategory.length > 0 || activeStore.length > 0,
  });

  const popularSearches = ['Apples', 'Rice', 'Smartphones', 'Milk', 'Tomatoes', 'Bananas'];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="page-seamless-wrapper">
      <MobileContainer className="seamless-content-container">
        {/* Seamless Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFEDD5] via-[#FFEDD5] to-[#FFEDD5]"></div>
          <div className="relative p-4 pb-6">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="bg-white/30 text-gray-800 hover:bg-white/40 rounded-full transition-all duration-300 p-0 w-10 h-10 flex items-center justify-center backdrop-blur-md border border-white/50 shadow-xl hover:scale-105"
                data-testid="button-back"
              >
                <i className="fas fa-chevron-left text-lg font-bold drop-shadow-sm"></i>
              </button>

              <div>
                <h1 className="text-xl font-bold drop-shadow-sm tracking-wide" style={{ color: '#F76B1E' }}>Find what you need 🛒</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Seamless Blend Section */}
        <div className="relative -mt-6 pt-8 px-4 py-6" style={{
          background: 'linear-gradient(180deg, #FFEDD5 0%, rgba(255,237,213,0.9) 10%, rgba(255,237,213,0.7) 20%, rgba(255,237,213,0.5) 30%, rgba(255,237,213,0.3) 40%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.95) 60%, white 70%)'
        }}>
          {/* Search Bar */}
          <div className="relative -mt-4 mb-4 px-3 z-20">
            <div className="compact-search-container w-full mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="compact-search-input w-full bg-[#fef5e7] focus:shadow-lg transition-all duration-200"
                  style={{
                    border: '1px solid #FB923C',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '2px solid #E5600B';
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(229, 96, 11, 0.3), 0 2px 4px -1px rgba(229, 96, 11, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid #FB923C';
                    e.target.style.boxShadow = 'none';
                  }}
                  data-testid="input-search-main"
                />
                <i className="fas fa-search absolute left-3 xs:left-4 top-1/2 transform -translate-y-1/2 text-primary text-sm"></i>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 w-8 h-8 p-0 rounded-full"
                >
                  <i className="fas fa-bars text-sm"></i>
                </Button>
              </div>
            </div>
          </div>
          <div className="px-3 pb-20">
        {/* Quick Category Filters */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
            {['Fashion', 'Grocery', 'Electronics', 'Food & Beverage', 'Home & Kitchen', 'Health & Wellness', 'Beauty & Personal Care', 'Agriculture', 'Appliances', 'Auto1', 'Auto2'].map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat.toLowerCase().replace(/\s+/g, '-') ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(activeCategory === cat.toLowerCase().replace(/\s+/g, '-') ? '' : cat.toLowerCase().replace(/\s+/g, '-'))}
                className="whitespace-nowrap text-xs"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Popular Searches */}
        {searchQuery.length < 2 && !activeCategory && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search) => (
                <Button
                  key={search}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch(search)}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  data-testid={`button-search-${search.toLowerCase()}`}
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Product Filters like ONDC */}
        {(searchQuery || activeCategory || activeStore) && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-3 flex-wrap gap-2">
              {activeCategory && (
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-600">Category:</span>
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {activeCategory.replace('-', ' ')}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveCategory('')}
                    className="text-gray-500 hover:text-gray-700"
                    data-testid="button-clear-category"
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                </div>
              )}
              {activeStore && (
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-600">Store:</span>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {activeStore.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveStore('')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                </div>
              )}
            </div>

            {/* Advanced Filters */}
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                <i className="fas fa-filter mr-1"></i>
                Brand
                <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </Button>
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                Ingredient
                <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </Button>
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                Conscious
                <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </Button>
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                Price
                <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </Button>
            </div>
          </div>
        )}

        {/* Promotion Banner Display */}
        {new URLSearchParams(window.location.search).get('promotion') && (
          <div className="mb-4 bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <i className="fas fa-fire text-orange-500"></i>
              <span className="text-orange-700 font-bold text-sm">Special Promotion</span>
            </div>
            <h3 className="text-lg font-bold text-orange-800 mb-1">
              {new URLSearchParams(window.location.search).get('promotion')}
            </h3>
            <p className="text-orange-600 text-sm">
              Exclusive deals and offers on selected items
            </p>
          </div>
        )}

        {/* Search Results */}
        {(searchQuery.length >= 2 || activeCategory || activeStore) && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-gray-700">
                {new URLSearchParams(window.location.search).get('promotion') ? 'Promotional' : 'Search'} Results
                {(searchResults as any)?.products && (
                  <span className="ml-2 text-gray-500 font-normal">
                    ({(searchResults as any).products.length} items)
                  </span>
                )}
              </h3>
              <Button variant="ghost" size="sm" className="text-primary">
                <i className="fas fa-filter mr-1"></i>
                Filter
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
                    <div className="flex space-x-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (searchResults as any)?.products?.length ? (
              <div className="grid grid-cols-2 gap-3">
                {(searchResults as any).products.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <i className="fas fa-search text-gray-400 text-xl"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-500 text-sm">Try searching with different keywords</p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {searchQuery.length < 2 && !activeCategory && !activeStore && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <i className="fas fa-search text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Start searching</h3>
            <p className="text-gray-500 text-sm">Search for products from thousands of sellers</p>
          </div>
        )}
          </div>
        </div>

        <BottomNav activeTab="search" />
      </MobileContainer>
    </div>
  );
}