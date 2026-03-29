
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, ShoppingBag } from "lucide-react";
import { PartnerSeller, xtraMartService } from "@/services/xtraMartService";
import { useToast } from "@/hooks/use-toast";

interface PartnerSellersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PartnerSellersModal({ isOpen, onClose }: PartnerSellersModalProps) {
  const [sellers] = useState<PartnerSeller[]>(xtraMartService.getPartnerSellers());
  const { toast } = useToast();

  const handlePartnerSelect = (seller: PartnerSeller) => {
    toast({
      title: "Partner Selected!",
      description: `Now shopping from ${seller.name} with ${seller.discount}% discount`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-600" />
            Partner Sellers Network
          </DialogTitle>
          <DialogDescription className="sr-only">Browse our network of verified partner sellers</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Choose from our exclusive partner sellers for better prices and quality products.
          </p>
          
          {sellers.map((seller) => (
            <Card key={seller.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <img
                    src={seller.image}
                    alt={seller.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">{seller.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{seller.category}</p>
                    
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{seller.rating}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-3">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{seller.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <Badge className="bg-green-100 text-green-800 text-xs w-fit mb-1">
                          {seller.discount}% OFF
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Min Order: ₹{seller.minOrder}
                        </span>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => handlePartnerSelect(seller)}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        Shop Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
