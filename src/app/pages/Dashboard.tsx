import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { SavingsProgress } from '../components/SavingsProgress';
import { GamificationBadge } from '../components/GamificationBadge';
import { loadPlansFromStorage, getBadges } from '../utils/savings';
import { SavingsPlan } from '../types';
import { Plus, Trophy } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SavingsPlan[]>([]);
  const [badges, setBadges] = useState(getBadges([]));

  useEffect(() => {
    const loadedPlans = loadPlansFromStorage();
    setPlans(loadedPlans);
    setBadges(getBadges(loadedPlans));
  }, []);

  const activePlans = plans.filter(p => p.status === 'active');
  const completedPlans = plans.filter(p => p.status === 'completed');
  const totalSaved = plans.reduce((sum, p) => sum + p.totalSaved, 0);
  const earnedBadgesCount = badges.filter(b => b.earned).length;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mon Tableau de Bord</h1>
              <p className="text-muted-foreground">
                Suivez vos objectifs d'épargne
              </p>
            </div>
            <Button onClick={() => navigate('/')}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau plan
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
            <p className="text-sm opacity-90 mb-1">Total épargné</p>
            <p className="text-3xl font-bold">{formatPrice(totalSaved)}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
            <p className="text-sm opacity-90 mb-1">Plans actifs</p>
            <p className="text-3xl font-bold">{activePlans.length}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
            <p className="text-sm opacity-90 mb-1">Badges obtenus</p>
            <p className="text-3xl font-bold flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              {earnedBadgesCount}/{badges.length}
            </p>
          </div>
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg border">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Plus className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Aucun plan d'épargne</h3>
            <p className="text-muted-foreground mb-6">
              Commencez votre parcours d'épargne en créant votre premier plan
            </p>
            <Button onClick={() => navigate('/')}>
              Créer mon premier plan
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="plans" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="plans">Mes Plans</TabsTrigger>
              <TabsTrigger value="badges">Mes Badges</TabsTrigger>
            </TabsList>

            <TabsContent value="plans" className="space-y-6">
              {activePlans.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Plans en cours</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activePlans.map(plan => (
                      <SavingsProgress key={plan.id} plan={plan} />
                    ))}
                  </div>
                </div>
              )}

              {completedPlans.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Plans complétés</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedPlans.map(plan => (
                      <SavingsProgress key={plan.id} plan={plan} />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="badges" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Vos Réalisations ({earnedBadgesCount}/{badges.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {badges.map(badge => (
                    <GamificationBadge key={badge.id} badge={badge} />
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  🎯 Comment gagner des badges ?
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Effectuez des versements réguliers</li>
                  <li>• Versez plus que le montant prévu</li>
                  <li>• Complétez vos objectifs d'épargne</li>
                  <li>• Maintenez votre discipline sur le long terme</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
