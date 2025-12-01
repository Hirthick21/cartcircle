import { ProductCard } from "./product-card";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";

interface ProductGridProps {
  products: Array<{
    id: string;
    name: string;
    price: string;
    originalPrice?: string;
    images: string[];
    ratings?: number;
    reviewCount?: number;
  }>;
  onProductClick?: (productId: string) => void;
}

export function ProductGrid({ products, onProductClick }: ProductGridProps) {
  const { toast } = useToast();
  const { addToCart } = useCart();

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        images: product.images || [],
        unit: '1 unit',
        sellerId: 'featured-store',
        sellerName: 'Featured Store'
      });
    }
  };

  const handleProductClick = (productId: string) => {
    if (onProductClick) {
      onProductClick(productId);
    } else {
      // Default behavior - navigate to product detail
      console.log('Navigate to product detail:', productId);
    }
  };

  if (!products?.length) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <i className="fas fa-box text-gray-400 text-xl"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">No products found</h3>
        <p className="text-gray-500 text-sm">Check back later for new products</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4" data-testid="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
          onClick={handleProductClick}
        />
      ))}
    </div>
  );
}
