import React, { Component, ErrorInfo, ReactNode } from "react";
import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Import pages directly - no lazy loading
import Home from "@/pages/home";
import Search from "@/pages/search";
import Cart from "@/pages/cart";
import Orders from "@/pages/orders";
import OrderDetail from "@/pages/order-detail";
import Profile from "@/pages/profile";
import Support from "@/pages/support";
import Checkout from "@/pages/checkout";
import Rating from "@/pages/rating";
import XtraMart from "@/pages/xtra-mart";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Wishlist from "@/pages/wishlist";
import Addresses from "@/pages/addresses";
import Payments from "@/pages/payments";
import Settings from "@/pages/settings";
import Rewards from "@/pages/rewards";
import Coupons from "@/pages/coupons";
import Notifications from "@/pages/notifications";
import Help from "@/pages/help";
import ContactInfo from "@/pages/contact-info";
import ProductDetail from "@/pages/product-detail";
import Stores from "@/pages/stores";
import StoreDetail from "@/pages/store-detail";

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">Please refresh the page to continue</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/home" component={Home} />
      <Route path="/search" component={Search} />
      <Route path="/cart" component={Cart} />
      <Route path="/orders" component={Orders} />
      <Route path="/orders/:id" component={OrderDetail} />
      <Route path="/profile" component={Profile} />
      <Route path="/support" component={Support} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/rating/:orderId" component={Rating} />
      <Route path="/xtra-mart" component={XtraMart} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/search" component={Search} />
      <Route path="/stores" component={Stores} />
      <Route path="/store/:id" component={StoreDetail} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/addresses" component={Addresses} />
      <Route path="/payments" component={Payments} />
      <Route path="/settings" component={Settings} />
      <Route path="/rewards" component={Rewards} />
      <Route path="/coupons" component={Coupons} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/help" component={Help} />
      <Route path="/contact-info" component={ContactInfo} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppRoutes />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;