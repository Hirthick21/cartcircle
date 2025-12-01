import { Button } from "@/components/ui/button";

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    images: string[];
    unit?: string;
  };
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  return (
    <div className="flex items-center space-x-3 py-3" data-testid={`cart-item-${item.id}`}>
      <img 
        src={item.images[0]}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h4 className="font-medium text-gray-800" data-testid={`item-name-${item.id}`}>
          {item.name}
        </h4>
        {item.unit && (
          <p className="text-sm text-gray-500" data-testid={`item-unit-${item.id}`}>
            {item.unit}
          </p>
        )}
        <p className="font-semibold text-gray-800" data-testid={`item-price-${item.id}`}>
          ₹{item.price}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleDecrease}
          className="w-8 h-8 p-0"
          data-testid={`button-decrease-${item.id}`}
        >
          <i className="fas fa-minus text-xs"></i>
        </Button>
        <span 
          className="px-3 py-1 bg-gray-50 rounded text-sm min-w-[3rem] text-center" 
          data-testid={`quantity-${item.id}`}
        >
          {item.quantity}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={handleIncrease}
          className="w-8 h-8 p-0"
          data-testid={`button-increase-${item.id}`}
        >
          <i className="fas fa-plus text-xs"></i>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleRemove}
          className="w-8 h-8 p-0 text-red-500 hover:text-red-700"
          data-testid={`button-remove-${item.id}`}
        >
          <i className="fas fa-trash text-xs"></i>
        </Button>
      </div>
    </div>
  );
}
