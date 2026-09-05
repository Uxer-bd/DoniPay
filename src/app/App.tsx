import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { loadPlansFromStorage } from './utils/savings';

export default function App() {
  useEffect(() => {
    // Check for reminders on mount
    const plans = loadPlansFromStorage();
    const activePlans = plans.filter(p => p.status === 'active');
    
    if (activePlans.length > 0) {
      // Show a reminder if there are active plans
      const hasRecentPayment = activePlans.some(plan => {
        if (plan.payments.length === 0) return false;
        const lastPayment = plan.payments[plan.payments.length - 1];
        const daysSinceLastPayment = Math.floor(
          (Date.now() - new Date(lastPayment.date).getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysSinceLastPayment < 7;
      });

      if (!hasRecentPayment && activePlans.length > 0) {
        setTimeout(() => {
          toast.info('💰 Rappel de cotisation', {
            description: `Vous avez ${activePlans.length} plan(s) d'épargne en cours. N'oubliez pas votre versement mensuel !`,
            duration: 6000,
          });
        }, 2000);
      }
    }
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </>
  );
}
