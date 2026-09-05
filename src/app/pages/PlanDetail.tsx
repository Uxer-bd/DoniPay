import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Coins, Calendar, TrendingUp, Sparkles } from 'lucide-react';
import { loadPlansFromStorage, savePlansToStorage, addPayment, calculateProgress, getEncouragementMessage } from '../utils/savings';
import { SavingsPlan } from '../types';
import { toast } from 'sonner';

export default function PlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<SavingsPlan | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => {
    const plans = loadPlansFromStorage();
    const foundPlan = plans.find(p => p.id === id);
    if (foundPlan) {
      setPlan(foundPlan);
      setPaymentAmount(foundPlan.monthlyAmount.toString());
    }
  }, [id]);

  if (!plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Plan non trouvé</p>
          <Button onClick={() => navigate('/dashboard')}>Retour au tableau de bord</Button>
        </div>
      </div>
    );
  }

  const progress = calculateProgress(plan.totalSaved, plan.productPrice);
  const encouragement = getEncouragementMessage(progress);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handlePayment = () => {
    const amount = parseFloat(paymentAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast.error('Veuillez entrer un montant valide');
      return;
    }

    const plans = loadPlansFromStorage();
    const planIndex = plans.findIndex(p => p.id === id);
    
    if (planIndex === -1) return;

    const updatedPlan = addPayment(plans[planIndex], amount);
    plans[planIndex] = updatedPlan;
    savePlansToStorage(plans);
    setPlan(updatedPlan);

    // Check if overpayment
    if (amount > plan.monthlyAmount) {
      toast.success('🎉 Excellent ! Vous avez versé plus que prévu !', {
        description: 'Votre durée d\'épargne a été réduite. Continuez comme ça !',
      });
    } else {
      toast.success('✅ Versement enregistré avec succès !', {
        description: encouragement,
      });
    }

    // Check if plan completed
    if (updatedPlan.status === 'completed') {
      toast.success('🎊 Félicitations ! Objectif atteint !', {
        description: 'Vous avez complété votre plan d\'épargne avec succès !',
        duration: 5000,
      });
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Product Info */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={plan.productImage}
              alt={plan.productName}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold mb-1">{plan.productName}</h1>
              <p className="text-xl text-primary font-semibold">{formatPrice(plan.productPrice)}</p>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Votre Progression
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Progression globale</span>
                <span className="font-bold">{progress.toFixed(1)}%</span>
              </div>
              <Progress value={progress} className="h-4 mb-2" />
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-primary">{formatPrice(plan.totalSaved)}</span>
                <span className="text-muted-foreground">{formatPrice(plan.productPrice)}</span>
              </div>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-center font-semibold text-primary">{encouragement}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <TrendingUp className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground mb-1">Par mois</p>
                <p className="font-semibold">{formatPrice(plan.monthlyAmount)}</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Calendar className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground mb-1">Versements</p>
                <p className="font-semibold">{plan.payments.length}</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Coins className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground mb-1">Restant</p>
                <p className="font-semibold">{formatPrice(plan.productPrice - plan.totalSaved)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        {plan.status === 'active' && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Effectuer un versement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="amount">Montant à verser</Label>
                <Input
                  id="amount"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Entrez le montant"
                  className="text-lg"
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPaymentAmount(plan.monthlyAmount.toString())}
                  >
                    Montant mensuel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPaymentAmount((plan.productPrice - plan.totalSaved).toString())}
                  >
                    Solde restant
                  </Button>
                </div>
              </div>

              {parseFloat(paymentAmount) > plan.monthlyAmount && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    🌟 Super ! En versant <span className="font-semibold">{formatPrice(parseFloat(paymentAmount))}</span>,
                    vous réduisez la durée de votre épargne !
                  </p>
                </div>
              )}

              <Button className="w-full" size="lg" onClick={handlePayment}>
                Confirmer le versement
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Historique des versements</CardTitle>
          </CardHeader>
          <CardContent>
            {plan.payments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aucun versement effectué pour le moment
              </p>
            ) : (
              <div className="space-y-3">
                {plan.payments.slice().reverse().map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">Versement #{payment.month}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{formatPrice(payment.amount)}</p>
                      {payment.amount > plan.monthlyAmount && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Bonus
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
