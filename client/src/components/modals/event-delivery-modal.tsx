
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Truck, Clock } from "lucide-react";
import { EventDelivery, xtraMartService } from "@/services/xtraMartService";
import { useToast } from "@/hooks/use-toast";

interface EventDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EventDeliveryModal({ isOpen, onClose }: EventDeliveryModalProps) {
  const [eventDeliveries] = useState<EventDelivery[]>(xtraMartService.getEventDeliveries());
  const [isBooking, setIsBooking] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    eventType: "",
    location: "",
    date: "",
    minOrder: "",
    specialInstructions: ""
  });
  const { toast } = useToast();

  const eventTypes = [
    "Wedding Function",
    "Festival Celebration",
    "Corporate Event",
    "Birthday Party",
    "Religious Ceremony",
    "Cultural Event",
    "Other"
  ];

  const handleBooking = async (event: EventDelivery) => {
    setIsBooking(true);
    try {
      const result = await xtraMartService.bookEventDelivery(event);
      
      toast({
        title: result.success ? "Booked Successfully!" : "Booking Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
      
      if (result.success) {
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleCustomBooking = async () => {
    if (!formData.eventType || !formData.location || !formData.date) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsBooking(true);
    try {
      const result = await xtraMartService.bookEventDelivery(formData);
      
      toast({
        title: result.success ? "Request Submitted!" : "Submission Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
      
      if (result.success) {
        setFormData({
          eventType: "",
          location: "",
          date: "",
          minOrder: "",
          specialInstructions: ""
        });
        setShowBookingForm(false);
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (showBookingForm) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-purple-600" />
              Book Custom Event Delivery
            </DialogTitle>
            <DialogDescription className="sr-only">Schedule a custom delivery for your event or special occasion</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="eventType">Event Type*</Label>
              <Select value={formData.eventType} onValueChange={(value) => setFormData(prev => ({ ...prev, eventType: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Event Location*</Label>
              <Input
                id="location"
                placeholder="Enter event venue address"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="date">Event Date*</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="minOrder">Expected Order Value</Label>
              <Input
                id="minOrder"
                type="number"
                placeholder="Enter expected amount"
                value={formData.minOrder}
                onChange={(e) => setFormData(prev => ({ ...prev, minOrder: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="instructions">Special Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="Any special delivery requirements..."
                value={formData.specialInstructions}
                onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowBookingForm(false)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleCustomBooking}
                disabled={isBooking}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {isBooking ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-purple-600" />
            Event Place Delivery
          </DialogTitle>
          <DialogDescription className="sr-only">Schedule delivery directly to your event venue</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Schedule delivery directly to your event venue. Perfect for weddings, festivals, and celebrations.
          </p>
          
          {/* Available Event Deliveries */}
          {eventDeliveries.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900">{event.eventType}</h4>
                      {event.isFree && (
                        <Badge className="bg-green-100 text-green-800 text-xs mt-1">
                          Free Delivery
                        </Badge>
                      )}
                    </div>
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <strong>Min Order:</strong> ₹{event.minOrder.toLocaleString()}
                  </div>
                  
                  {event.specialInstructions && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 mt-0.5" />
                      {event.specialInstructions}
                    </div>
                  )}
                  
                  <Button
                    onClick={() => handleBooking(event)}
                    disabled={isBooking}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {isBooking ? "Booking..." : "Book This Event"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Custom Event Booking */}
          <div className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setShowBookingForm(true)}
              className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              Book Custom Event Delivery
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
