import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { MobileContainer } from "@/components/layout/mobile-container";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Store {
  id: string;
  name: string;
  description: string;
  logo: string;
  rating: number;
  categories: string[];
  productCount: number;
  location: string;
  deliveryTime: string;
  minOrder: number;
}

export default function Stores() {
  const [, navigate] = useLocation();
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const stores: Store[] = [
    {
      id: "balaji_bengaluru",
      name: "Balaji Bengaluru Departmental",
      description: "Complete grocery store with fresh produce and daily essentials",
      logo: "🏪",
      rating: 4.2,
      categories: ["Grocery", "Health & Wellness", "Home & Kitchen", "Beauty & Personal Care", "Agriculture"],
      productCount: 500,
      location: "T. Nagar, Chennai",
      deliveryTime: "30-45 mins",
      minOrder: 200
    },
    {
      id: "apple_supermarket",
      name: "Apple Supermarket",
      description: "Premium supermarket with fresh fruits and electronics",
      logo: "🍎",
      rating: 4.5,
      categories: ["Fruits", "Electronics", "Health & Wellness", "Premium Grocery", "Beauty & Personal Care"],
      productCount: 350,
      location: "Pondy Bazaar, Chennai",
      deliveryTime: "20-35 mins",
      minOrder: 300
    },
    {
      id: "buynxt_ondc",
      name: "BuyNxt ONDC",
      description: "Tech store specializing in electronics and smart devices",
      logo: "🛒",
      rating: 4.0,
      categories: ["Electronics", "Smart Home", "Fashion", "Home & Kitchen"],
      productCount: 450,
      location: "Electronic City, Bengaluru",
      deliveryTime: "45-60 mins",
      minOrder: 500
    },
    {
      id: "adidas_bengaluru",
      name: "Adidas Store - Bengaluru",
      description: "Premium sports and fashion store",
      logo: "👟",
      rating: 4.3,
      categories: ["Fashion", "Sports", "Health & Wellness"],
      productCount: 280,
      location: "Brigade Road, Bengaluru",
      deliveryTime: "25-40 mins",
      minOrder: 800
    }
  ];

  const { data: storeProducts, isLoading } = useQuery({
    queryKey: ['/api/products/search', { provider: selectedStore }],
    enabled: !!selectedStore,
  });

  const handleStoreSelect = (storeId: string) => {
    navigate(`/search?store=${storeId}`);
  };



  return (
    <MobileContainer>
      <Header
        title="Stores Near You"
        subtitle="Discover local businesses"
        showBack={true}
        onBack={() => navigate('/')}
      />

      <div className="px-4 py-6 space-y-6">
        <h1 className="section-heading-large font-inter">Partner Stores</h1>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="grocery">Grocery</TabsTrigger>
            <TabsTrigger value="fashion">Fashion</TabsTrigger>
            <TabsTrigger value="tech">Tech</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            {stores.map((store) => (
              <Card key={store.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleStoreSelect(store.id)}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">{store.logo}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{store.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{store.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                        <div className="flex items-center space-x-1">
                          <i className="fas fa-star text-yellow-400"></i>
                          <span>{store.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <i className="fas fa-clock"></i>
                          <span>{store.deliveryTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <i className="fas fa-box"></i>
                          <span>{store.productCount}+ items</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {store.categories.slice(0, 3).map((category, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                        {store.categories.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{store.categories.length - 3}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Min order</p>
                      <p className="font-medium text-sm">₹{store.minOrder}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="grocery" className="space-y-4 mt-4">
            {stores.filter(store => store.categories.some(cat => 
              ['Grocery', 'Fruits', 'Premium Grocery'].includes(cat)
            )).map((store) => (
              <Card key={store.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleStoreSelect(store.id)}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">{store.logo}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{store.name}</h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <i className="fas fa-star text-yellow-400"></i>
                          <span>{store.rating}</span>
                        </div>
                        <span>•</span>
                        <span>{store.deliveryTime}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="fashion" className="space-y-4 mt-4">
            {stores.filter(store => store.categories.includes('Fashion')).map((store) => (
              <Card key={store.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleStoreSelect(store.id)}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">{store.logo}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{store.name}</h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <i className="fas fa-star text-yellow-400"></i>
                          <span>{store.rating}</span>
                        </div>
                        <span>•</span>
                        <span>{store.deliveryTime}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="tech" className="space-y-4 mt-4">
            {stores.filter(store => store.categories.includes('Electronics')).map((store) => (
              <Card key={store.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleStoreSelect(store.id)}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">{store.logo}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{store.name}</h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <i className="fas fa-star text-yellow-400"></i>
                          <span>{store.rating}</span>
                        </div>
                        <span>•</span>
                        <span>{store.deliveryTime}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav activeTab="stores" />
    </MobileContainer>
  );
}