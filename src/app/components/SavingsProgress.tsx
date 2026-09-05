import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { SavingsPlan } from '../types';
import { calculateProgress, calculateRemainingMonths } from '../utils/savings';
import { Calendar, TrendingUp, Target } from 'lucide-react';
import { useNavigate } from 'react-router';

interface SavingsProgressProps {
  plan: SavingsPlan;
}

export function SavingsProgress({ plan }: SavingsProgressProps) {
  const navigate = useNavigate();
  const progress = calculateProgress(plan.totalSaved, plan.productPrice);
  const remainingMonths = calculateRemainingMonths(plan);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'active':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Complété';
      case 'active':
        return 'En cours';
      default:
        return 'Annulé';
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative h-32 overflow-hidden">
        <img
          src={plan.productImage}
          alt={plan.productName}
          className="w-full h-full object-cover"
        />
        <Badge className={`absolute top-2 right-2 ${getStatusColor(plan.status)} text-white`}>
          {getStatusText(plan.status)}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{plan.productName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progression</span>
            <span className="font-semibold">{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between text-sm mt-1">
            <span className="font-semibold">{formatPrice(plan.totalSaved)}</span>
            <span className="text-muted-foreground">{formatPrice(plan.productPrice)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Par mois</p>
              <p className="font-semibold text-sm">{formatPrice(plan.monthlyAmount)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Mois restants</p>
              <p className="font-semibold text-sm">{remainingMonths}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
          <Target className="h-4 w-4 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Versements effectués</p>
            <p className="font-semibold text-sm">{plan.payments.length} paiements</p>
          </div>
        </div>

        {plan.status === 'active' && (
          <Button 
            className="w-full" 
            onClick={() => navigate(`/plan/${plan.id}`)}
          >
            Effectuer un versement
          </Button>
        )}

        {plan.status === 'completed' && (
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-green-700 font-semibold">🎉 Objectif atteint !</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
