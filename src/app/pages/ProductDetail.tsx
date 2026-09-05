import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { products } from '../data/products';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { ArrowLeft, Calendar, TrendingUp, Target } from 'lucide-react';
import { calculateMonthlyAmount, savePlansToStorage, loadPlansFromStorage } from '../utils/savings';
import { SavingsPlan } from '../types';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);
  
  const [duration, setDuration] = useState([6]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Produit non trouvé</p>
          <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
        </div>
      </div>
    );
  }

  const monthlyAmount = calculateMonthlyAmount(product.price, duration[0]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCreatePlan = () => {
    const startDate = new Date();
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + duration[0]);

    const newPlan: SavingsPlan = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      productImage: product.image,
      monthlyAmount,
      duration: duration[0],
      startDate: startDate.toISOString(),
      targetDate: targetDate.toISOString(),
      totalSaved: 0,
      payments: [],
      status: 'active',
    };

    const existingPlans = loadPlansFromStorage();
    const updatedPlans = [...existingPlans, newPlan];
    savePlansToStorage(updatedPlans);

    toast.success('🎉 Plan d\'épargne créé avec succès !', {
      description: `Vous devrez épargner ${formatPrice(monthlyAmount)} par mois pendant ${duration[0]} mois.`,
    });

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground mb-4">{product.description}</p>
              <p className="text-4xl font-bold text-primary">{formatPrice(product.price)}</p>
            </div>
          </div>

          {/* Savings Plan Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Planifier mon épargne</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-4 block">
                    Durée d'épargne : <span className="font-bold">{duration[0]} mois</span>
                  </Label>
                  <Slider
                    value={duration}
                    onValueChange={setDuration}
                    min={3}
                    max={24}
                    step={1}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>3 mois</span>
                    <span>24 mois</span>
                  </div>
                </div>

                <div className="space-y-4 p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span className="text-sm">Montant mensuel</span>
                    </div>
                    <span className="font-bold text-xl">{formatPrice(monthlyAmount)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="text-sm">Date cible</span>
                    </div>
                    <span className="font-semibold">
                      {new Date(new Date().setMonth(new Date().getMonth() + duration[0])).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      <span className="text-sm">Objectif total</span>
                    </div>
                    <span className="font-semibold">{formatPrice(product.price)}</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-900">
                    💡 <span className="font-semibold">Astuce :</span> Vous pouvez verser plus que le montant mensuel prévu. 
                    Cela réduira automatiquement la durée de votre épargne !
                  </p>
                </div>

                <Button className="w-full" size="lg" onClick={handleCreatePlan}>
                  Commencer mon épargne
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
