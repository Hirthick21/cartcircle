import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface OrderCardProps {
  order: {
    id: string;
    ondcOrderId: string;
    status: string;
    totalAmount: string;
    createdAt: string;
    items?: Array<{
      name: string;
      images: string[];
    }>;
  };
  onTrack?: (orderId: string) => void;
  onCancel?: (orderId: string) => void;
  onSupport?: (orderId: string) => void;
  onClick?: (orderId: string) => void;
}

export function OrderCard({ order, onTrack, onCancel, onSupport, onClick }: OrderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'out for delivery':
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCardClick = () => {
    onClick?.(order.id);
  };

  const handleTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTrack?.(order.id);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCancel?.(order.id);
  };

  const handleSupport = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSupport?.(order.id);
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow" 
      onClick={handleCardClick}
      data-testid={`order-card-${order.id}`}
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-gray-800" data-testid={`order-id-${order.id}`}>
              Order #{order.ondcOrderId}
            </h3>
            <p className="text-sm text-gray-500" data-testid={`order-date-${order.id}`}>
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-800" data-testid={`order-total-${order.id}`}>
              ₹{order.totalAmount}
            </p>
            <span 
              className={`inline-block text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}
              data-testid={`order-status-${order.id}`}
            >
              {order.status}
            </span>
          </div>
        </div>

        {order.items && order.items.length > 0 && (
          <div className="flex items-center space-x-2 mb-2">
            <img 
              src={order.items[0].images?.[0] || 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60'}
              alt="Order items"
              className="w-10 h-10 object-cover rounded-lg"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-800" data-testid={`order-items-${order.id}`}>
                {order.items[0].name}
                {order.items.length > 1 && ` +${order.items.length - 1} more`}
              </p>
              <p className="text-xs text-gray-500">
                {order.items.length} item{order.items.length > 1 ? 's' : ''} from seller
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleTrack}
            className="text-primary font-medium"
            data-testid={`button-track-${order.id}`}
          >
            Track Order
          </Button>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSupport}
              className="text-gray-500"
              data-testid={`button-help-${order.id}`}
            >
              Help
            </Button>
            {order.status.toLowerCase() !== 'delivered' && order.status.toLowerCase() !== 'cancelled' && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleCancel}
                className="text-red-500"
                data-testid={`button-cancel-${order.id}`}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
