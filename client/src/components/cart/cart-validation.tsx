
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CartValidationProps {
  cartItems: Array<{
    id: string;
    storeId: string;
    storeName: string;
    category: string;
  }>;
}

export function CartValidation({ cartItems }: CartValidationProps) {
  const stores = [...new Set(cartItems.map(item => item.storeId))];
  const categories = [...new Set(cartItems.map(item => item.category))];

  const hasMultipleStores = stores.length > 1;
  const hasMultipleCategories = categories.length > 1;

  if (!hasMultipleStores && !hasMultipleCategories) {
    return null;
  }

  return (
    <div className="space-y-2 mb-4">
      {hasMultipleStores && (
        <Alert className="bg-red-50 border-red-200">
          <i className="fas fa-exclamation-triangle text-red-500"></i>
          <AlertDescription className="text-red-700 text-sm">
            You are ordering from different store. Please check your order again.
          </AlertDescription>
        </Alert>
      )}
      
      {hasMultipleCategories && (
        <Alert className="bg-orange-50 border-orange-200">
          <i className="fas fa-info-circle text-orange-500"></i>
          <AlertDescription className="text-orange-700 text-sm">
            You are ordering from different category. Please check your order again.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
