
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { MobileContainer } from "@/components/layout/mobile-container";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useOndcConfirm } from "@/hooks/use-ondc";
import { useToast } from "@/hooks/use-toast";
import { CartValidation } from "@/components/cart/cart-validation";
import { useCart } from "@/hooks/use-cart";
import { LocationModal } from "@/components/modals/location-modal";

export default function Checkout() {
  const [, navigate] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState("Bengaluru, Karnataka");
  const { toast } = useToast();
  const confirmOrder = useOndcConfirm();
  const { cartItems, clearCart } = useCart();

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Load saved location on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) {
      setDeliveryLocation(savedLocation);
    }
  }, []);

  const handleLocationSelect = (location: string) => {
    setDeliveryLocation(location);
    toast({
      title: "Delivery Location Updated",
      description: `Delivering to: ${location}`,
    });
  };

  // Derive checkout data from cart state
  const checkoutData = {
    items: cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      images: item.images
    })),
    subtotal: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    deliveryCharges: 40,
    taxes: Math.round(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.05),
    total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 40 + Math.round(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.05),
    deliveryAddress: {
      name: 'John Doe',
      phone: '+91 9876543210',
      addressLine1: '123, MG Road, Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560034'
    },
    providerId: 'provider1',
    bppId: 'bpp1',
    bppUri: 'https://bpp1.ondc.org',
    providerName: 'FreshMart Store'
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);

    try {
      if (!paymentMethod) {
        toast({
          title: "Payment Method Required",
          description: "Please select a payment method",
          variant: "destructive",
        });
        return;
      }

      if (cartItems.length === 0) {
        toast({
          title: "Cart is Empty",
          description: "Please add items to your cart before checkout.",
          variant: "destructive",
        });
        return;
      }

      if (paymentMethod === 'card') {
        const cardProcessed = await new Promise((resolve) => {
          setTimeout(() => resolve(Math.random() > 0.1), 2000);
        });

        if (!cardProcessed) {
          toast({
            title: "Payment Failed",
            description: "Your card payment was declined. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }

      const billing = {
        name: checkoutData.deliveryAddress.name,
        phone: checkoutData.deliveryAddress.phone,
        address: {
          door: '123',
          building: 'MG Road',
          street: 'Koramangala',
          locality: 'Koramangala',
          ward: 'Ward 76',
          city: checkoutData.deliveryAddress.city,
          state: checkoutData.deliveryAddress.state,
          country: 'IND',
          area_code: checkoutData.deliveryAddress.postalCode
        }
      };

      const fulfillment = {
        end: {
          location: {
            gps: '12.9352,77.6245',
            address: `${checkoutData.deliveryAddress.addressLine1}, ${checkoutData.deliveryAddress.city}`
          },
          contact: {
            phone: checkoutData.deliveryAddress.phone
          }
        }
      };

      const payment = {
        type: paymentMethod,
        collected_by: 'BAP',
        status: paymentMethod === 'cod' ? 'NOT-PAID' : 'PAID'
      };

      const quote = {
        price: {
          currency: 'INR',
          value: checkoutData.total.toString()
        },
        breakup: [
          {
            title: 'Subtotal',
            price: {
              currency: 'INR',
              value: checkoutData.subtotal.toString()
            }
          },
          {
            title: 'Delivery Charges',
            price: {
              currency: 'INR',
              value: checkoutData.deliveryCharges.toString()
            }
          },
          {
            title: 'Taxes',
            price: {
              currency: 'INR',
              value: checkoutData.taxes.toString()
            }
          }
        ]
      };

      await confirmOrder.mutateAsync({
        providerId: checkoutData.providerId,
        items: checkoutData.items,
        billing,
        fulfillment,
        payment,
        bppId: checkoutData.bppId,
        bppUri: checkoutData.bppUri,
        providerName: checkoutData.providerName,
        totalAmount: checkoutData.total.toString(),
        quote
      });

      clearCart();

      toast({
        title: "Order Placed Successfully!",
        description: `Your order will be delivered by ${new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleTimeString()}`,
      });

      navigate('/orders');

    } catch (error) {
      console.error('Order placement failed:', error);
      toast({
        title: "Order Failed",
        description: "Unable to place your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="page-seamless-wrapper">
      <MobileContainer className="seamless-content-container">
        {/* Header - Matching Cart Page Style */}
        <div className="sticky top-0 z-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFEDD5] via-[#FFEDD5] to-[#FFEDD5]"></div>
          <div className="relative p-4 pb-6">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/cart')}
                className="bg-white/30 text-gray-800 hover:bg-white/40 rounded-full transition-all duration-300 p-0 w-10 h-10 flex items-center justify-center backdrop-blur-md border border-white/50 shadow-xl hover:scale-105"
              >
                <i className="fas fa-chevron-left text-lg font-bold drop-shadow-sm"></i>
              </button>
              <div>
                <h1 className="text-xl font-bold drop-shadow-sm tracking-wide" style={{ color: '#F76B1E' }}>Checkout</h1>
                <p className="text-orange-400 text-sm font-medium drop-shadow-sm">Review and confirm your order</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative px-4 pt-6 pb-24" style={{
          background: 'linear-gradient(180deg, rgba(255,237,213,0.8) 0%, rgba(255,240,219,0.7) 5%, rgba(255,243,225,0.6) 10%, rgba(255,246,231,0.5) 15%, rgba(255,248,237,0.4) 20%, rgba(255,250,243,0.3) 25%, rgba(255,252,248,0.2) 30%, rgba(255,254,253,0.1) 40%, white 50%)'
        }}>
        {/* Order Items Section */}
        <div className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🛍️</span>
                  <h2 className="font-bold text-lg text-gray-900">Your Order</h2>
                </div>
                <Badge className="bg-gradient-to-r from-fuel-yellow to-orange-500 text-white border-0 shadow-md px-3 py-1">
                  {checkoutData.items.length} items
                </Badge>
              </div>

              <div className="cart-items-container">
                {checkoutData.items.map((item) => (
                  <div key={item.id} className="cart-item-enhanced" data-testid={`checkout-item-${item.id}`}>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl shadow-sm"
                        />
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-fuel-yellow rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{item.quantity}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-800 truncate">{item.name}</h3>
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-bold text-fuel-yellow text-lg">₹{item.price}</span>
                          <span className="text-sm text-gray-600 font-medium">Total: ₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Method */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50/30 mt-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <i className="fas fa-credit-card text-primary text-base"></i>
              <h3 className="font-bold text-lg text-gray-900">Payment Method</h3>
            </div>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} data-testid="payment-methods" className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-xl border-2 border-gray-200 hover:border-primary transition-all duration-200 cursor-pointer bg-white shadow-sm hover:shadow-md">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="flex items-center space-x-3 cursor-pointer flex-1">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                    <i className="fas fa-mobile-alt text-purple-600"></i>
                  </div>
                  <span className="font-semibold text-gray-900">UPI</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl border-2 border-gray-200 hover:border-primary transition-all duration-200 cursor-pointer bg-white shadow-sm hover:shadow-md">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center space-x-3 cursor-pointer flex-1">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <i className="fas fa-credit-card text-blue-600"></i>
                  </div>
                  <span className="font-semibold text-gray-900">Card</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl border-2 border-gray-200 hover:border-primary transition-all duration-200 cursor-pointer bg-white shadow-sm hover:shadow-md">
                <RadioGroupItem value="wallet" id="wallet" />
                <Label htmlFor="wallet" className="flex items-center space-x-3 cursor-pointer flex-1">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                    <i className="fas fa-wallet text-green-600"></i>
                  </div>
                  <span className="font-semibold text-gray-900">Wallet</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl border-2 border-gray-200 hover:border-primary transition-all duration-200 cursor-pointer bg-white shadow-sm hover:shadow-md">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod" className="flex items-center space-x-3 cursor-pointer flex-1">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                    <i className="fas fa-money-bill-wave text-orange-600"></i>
                  </div>
                  <span className="font-semibold text-gray-900">Cash on Delivery</span>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50/30 mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <i className="fas fa-map-marker-alt text-primary text-base"></i>
                <h3 className="font-bold text-lg text-gray-900">Delivery Address</h3>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary font-semibold h-auto p-0 hover:underline"
                onClick={() => setIsLocationModalOpen(true)}
                data-testid="button-change-address"
              >
                Change
              </Button>
            </div>
            
            {/* Delivery Location Button */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="w-full bg-gradient-to-r from-fuel-yellow-50 to-orange-50 border-2 border-fuel-yellow-200 rounded-xl p-4 hover:from-fuel-yellow-100 hover:to-orange-100 hover:border-fuel-yellow-300 transition-all duration-200 text-left mb-4 shadow-sm hover:shadow-md"
              data-testid="button-delivery-location"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-fuel-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-map-marker-alt text-white text-base"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-fuel-yellow-800 uppercase tracking-wide mb-1">Delivering to</p>
                  <p className="text-base font-bold text-gray-900 break-words leading-relaxed">
                    {deliveryLocation}
                  </p>
                </div>
                <i className="fas fa-chevron-right text-gray-400 text-base flex-shrink-0 mt-1"></i>
              </div>
            </button>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200" data-testid="delivery-address">
              <p className="font-bold text-gray-900 mb-2 text-base">{checkoutData.deliveryAddress.name}</p>
              <p className="text-gray-700 text-sm leading-relaxed">{checkoutData.deliveryAddress.addressLine1}</p>
              <p className="text-gray-700 text-sm leading-relaxed">{checkoutData.deliveryAddress.city}, {checkoutData.deliveryAddress.state} - {checkoutData.deliveryAddress.postalCode}</p>
            </div>
          </CardContent>
        </Card>

        {/* Bill Summary */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-yellow-50/20 to-orange-50/40 mt-6 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <i className="fas fa-calculator text-primary text-base"></i>
              <h3 className="font-bold text-lg text-gray-900">Bill Summary</h3>
            </div>
            <div className="cart-total-section">
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>Item total</span>
                  <span data-testid="text-items-total">₹{checkoutData.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>Delivery fee</span>
                  <span data-testid="text-delivery-charges">₹{checkoutData.deliveryCharges}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>Taxes & fees</span>
                  <span data-testid="text-taxes-fees">₹{checkoutData.taxes}</span>
                </div>
                <div className="border-t border-fuel-yellow/20 pt-4 pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-gray-800">Total Amount</span>
                    <span className="text-xl font-bold text-fuel-yellow" data-testid="text-final-total">₹{checkoutData.total}</span>
                  </div>
                  
                  {/* Place Order Button */}
                  <Button 
                    className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder || cartItems.length === 0}
                    data-testid="button-place-order"
                  >
                    {isPlacingOrder ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Placing Order...</span>
                      </div>
                    ) : (
                      `Place Order • ₹${checkoutData.total}`
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>

      <BottomNav activeTab="cart" showCartButton={true} />

      {/* Location Modal */}
      <LocationModal
        open={isLocationModalOpen}
        onOpenChange={setIsLocationModalOpen}
        onLocationSelect={handleLocationSelect}
      />
      </MobileContainer>
    </div>
  );
}
