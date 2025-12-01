
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CartValidation } from "@/components/cart/cart-validation";

interface CheckoutStepsProps {
  cartItems: any[];
  onComplete: (orderData: any) => void;
}

export function CheckoutSteps({ cartItems, onComplete }: CheckoutStepsProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [addressData, setAddressData] = useState({
    street: "",
    building: "",
    city: "",
    state: "",
    pinCode: "",
    tag: "Home"
  });

  const steps = [
    { number: 1, title: "Cart", icon: "shopping-cart" },
    { number: 2, title: "Customer", icon: "user" },
    { number: 3, title: "Fulfillment", icon: "truck" },
    { number: 4, title: "Add Address", icon: "map-marker-alt" },
    { number: 5, title: "Payment", icon: "credit-card" }
  ];

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="space-y-6">
      {/* Step Progress */}
      <div className="flex items-center space-x-4 overflow-x-auto pb-2">
        {steps.map((step) => (
          <div key={step.number} className="flex items-center space-x-2 min-w-fit">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              currentStep >= step.number 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {currentStep > step.number ? (
                <i className="fas fa-check text-xs"></i>
              ) : (
                step.number
              )}
            </div>
            <span className={`text-sm font-medium ${
              currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Cart */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold">Cart</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <CartValidation cartItems={cartItems} />
            
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img 
                    src={item.image || 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=80&h=80&fit=crop'} 
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-600">{item.storeName || "Store Name"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">₹{item.price}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm mb-1">
                <span>Subtotal</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Delivery</span>
                <span>₹31.50</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{totalAmount + 31.50}</span>
              </div>
            </div>

            <Button 
              onClick={() => setCurrentStep(2)}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Add Address */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">4</span>
              </div>
              <h3 className="text-lg font-bold">Add Address</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={customerData.email}
                onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                placeholder="Email address"
              />
            </div>

            {/* Interactive Map Section */}
            <div className="bg-gray-100 rounded-lg p-3 text-center">
              <div className="h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center mb-2 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute w-full h-0.5 bg-gray-400 top-1/4"></div>
                  <div className="absolute w-full h-0.5 bg-gray-400 top-3/4"></div>
                  <div className="absolute h-full w-0.5 bg-gray-400 left-1/4"></div>
                  <div className="absolute h-full w-0.5 bg-gray-400 left-3/4"></div>
                </div>
                <div className="relative z-10 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <i className="fas fa-map-marker-alt text-white text-xs"></i>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-2">Move the map to get desired location.</p>
              <Button size="sm" variant="outline">Done</Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="street">Street *</Label>
                <Input
                  id="street"
                  value={addressData.street}
                  onChange={(e) => setAddressData({...addressData, street: e.target.value})}
                  placeholder="Street address"
                />
              </div>
              <div>
                <Label htmlFor="building">Building *</Label>
                <Input
                  id="building"
                  value={addressData.building}
                  onChange={(e) => setAddressData({...addressData, building: e.target.value})}
                  placeholder="Building/House no"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pinCode">Pin Code *</Label>
                <Input
                  id="pinCode"
                  value={addressData.pinCode}
                  onChange={(e) => setAddressData({...addressData, pinCode: e.target.value})}
                  placeholder="110041"
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={addressData.city}
                  onChange={(e) => setAddressData({...addressData, city: e.target.value})}
                  placeholder="City"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={addressData.state}
                onChange={(e) => setAddressData({...addressData, state: e.target.value})}
                placeholder="State"
              />
            </div>

            {/* Address Tag */}
            <div>
              <Label>Tag</Label>
              <div className="flex space-x-2 mt-2">
                {['Home', 'Office', 'Other'].map((tag) => (
                  <Button
                    key={tag}
                    variant={addressData.tag === tag ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAddressData({...addressData, tag})}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                variant="outline"
                onClick={() => setCurrentStep(3)}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={() => setCurrentStep(5)}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Payment */}
      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">5</span>
              </div>
              <h3 className="text-lg font-bold">Payment</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Order Summary</h4>
              <div className="flex justify-between text-sm mb-1">
                <span>Order Total</span>
                <span>₹{totalAmount + 31.50}</span>
              </div>
            </div>

            <Button 
              onClick={() => onComplete({ customerData, addressData, cartItems, totalAmount })}
              className="w-full bg-blue-500 hover:bg-blue-600 py-3"
            >
              Proceed to Pay
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
