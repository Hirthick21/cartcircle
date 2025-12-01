
import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: string;
    originalPrice?: string;
    images: string[];
    ratings?: number;
    reviewCount?: number;
  };
  onAddToCart?: (productId: string) => void;
  onClick?: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart, onClick }: ProductCardProps) {
  const [, navigate] = useLocation();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    setIsAdding(true);
    
    addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      images: product.images || [],
      unit: '1 unit',
      sellerId: 'featured-store',
      sellerName: 'Featured Store'
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
      duration: 2000,
    });
    
    setTimeout(() => setIsAdding(false), 600);
    
    onAddToCart?.(product.id);
  };

  const handleClick = () => {
    if (onClick) {
      onClick(product.id);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  const discountPercentage = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price)
    ? Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)
    : 0;

  return (
    <Card 
      className="overflow-hidden hover:shadow-xl transition-all duration-200 cursor-pointer border border-gray-100 rounded-2xl bg-white shadow-sm" 
      onClick={handleClick}
      data-testid={`product-card-${product.id}`}
    >
      <CardContent className="p-0">
        {/* Product Image with curved corners */}
        <div className="relative bg-white p-3">
          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden" style={{ height: '140px' }}>
            <img 
              src={product.images[0] || 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200'}
              alt={product.name}
              className="w-full h-full object-contain p-3"
            />
            {discountPercentage > 0 && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md">
                SALE
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="px-3 pb-3 bg-white">
          <h3 className="text-sm font-semibold text-gray-900 mb-0.5 min-h-[38px] line-clamp-2 leading-snug" data-testid={`product-name-${product.id}`}>
            {product.name}
          </h3>
          <p className="text-[11px] text-gray-500 mb-2 font-normal">Premium Quality</p>
          
          {product.ratings && (
            <div className="flex items-center space-x-1 mb-1.5">
              <div className="flex text-[10px]">
                {[...Array(5)].map((_, i) => (
                  <i 
                    key={i} 
                    className={`fas fa-star ${i < Math.floor(product.ratings || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-gray-500 font-normal">({product.reviewCount || 0})</span>
            </div>
          )}

          {/* Price Section */}
          <div className="mb-2.5">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-bold text-gray-900" data-testid={`product-price-${product.id}`}>
                ₹{product.price}
              </span>
              {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                <span className="text-xs text-gray-400 line-through font-normal">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button - Matches reference design */}
          <Button 
            size="sm"
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-full text-white font-bold py-2 text-sm rounded-lg transition-all duration-200 shadow-sm ${
              isAdding ? 'scale-95 opacity-70' : 'hover:scale-[1.01] hover:shadow-md'
            }`}
            style={{
              backgroundColor: '#FF9800',
              borderColor: '#FF9800'
            }}
            data-testid={`button-add-${product.id}`}
          >
            {isAdding ? (
              <>
                <i className="fas fa-check mr-1.5 text-xs animate-bounce"></i>
                <span className="text-xs">Added</span>
              </>
            ) : (
              'Add to Cart'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
