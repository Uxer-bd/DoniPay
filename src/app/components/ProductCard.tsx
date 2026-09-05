import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Product } from '../types';
import { useNavigate } from 'react-router';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
          {product.category}
        </Badge>
      </div>
      <CardContent className="pt-4">
        <h3 className="font-semibold mb-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
        <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => navigate(`/product/${product.id}`)}
        >
          Planifier mon épargne
        </Button>
      </CardFooter>
    </Card>
  );
}
