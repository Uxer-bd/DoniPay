import { SavingsPlan, Payment, Badge } from '../types';

export const calculateMonthlyAmount = (totalPrice: number, months: number): number => {
  return Math.ceil(totalPrice / months);
};

export const calculateProgress = (saved: number, total: number): number => {
  return Math.min((saved / total) * 100, 100);
};

export const calculateRemainingMonths = (plan: SavingsPlan): number => {
  const remaining = plan.productPrice - plan.totalSaved;
  if (remaining <= 0) return 0;
  return Math.ceil(remaining / plan.monthlyAmount);
};

export const getNextPaymentDate = (plan: SavingsPlan): Date => {
  const lastPayment = plan.payments[plan.payments.length - 1];
  if (!lastPayment) {
    return new Date(plan.startDate);
  }
  const nextDate = new Date(lastPayment.date);
  nextDate.setMonth(nextDate.getMonth() + 1);
  return nextDate;
};

export const addPayment = (plan: SavingsPlan, amount: number): SavingsPlan => {
  const newPayment: Payment = {
    id: Date.now().toString(),
    amount,
    date: new Date().toISOString(),
    month: plan.payments.length + 1,
  };

  const newTotalSaved = plan.totalSaved + amount;
  const newStatus = newTotalSaved >= plan.productPrice ? 'completed' : 'active';

  // Recalculate duration if paid more than expected
  let newDuration = plan.duration;
  if (amount > plan.monthlyAmount && newStatus === 'active') {
    const remaining = plan.productPrice - newTotalSaved;
    newDuration = plan.payments.length + Math.ceil(remaining / plan.monthlyAmount);
  }

  return {
    ...plan,
    payments: [...plan.payments, newPayment],
    totalSaved: newTotalSaved,
    status: newStatus,
    duration: newDuration,
  };
};

export const getBadges = (plans: SavingsPlan[]): Badge[] => {
  const allBadges: Badge[] = [
    {
      id: '1',
      name: 'Premier Pas',
      description: 'Effectuez votre premier versement',
      icon: 'Star',
      earned: false,
    },
    {
      id: '2',
      name: 'Régularité',
      description: 'Effectuez 3 versements consécutifs',
      icon: 'Award',
      earned: false,
    },
    {
      id: '3',
      name: 'Généreux',
      description: 'Versez plus que le montant mensuel prévu',
      icon: 'TrendingUp',
      earned: false,
    },
    {
      id: '4',
      name: 'Champion',
      description: 'Complétez votre premier objectif',
      icon: 'Trophy',
      earned: false,
    },
    {
      id: '5',
      name: 'Discipline',
      description: 'Maintenez une épargne active pendant 6 mois',
      icon: 'Target',
      earned: false,
    },
  ];

  // Check which badges are earned
  const totalPayments = plans.reduce((sum, p) => sum + p.payments.length, 0);
  const completedPlans = plans.filter(p => p.status === 'completed').length;
  
  // Premier Pas
  if (totalPayments > 0) {
    allBadges[0].earned = true;
  }

  // Régularité
  const hasThreeConsecutive = plans.some(plan => plan.payments.length >= 3);
  if (hasThreeConsecutive) {
    allBadges[1].earned = true;
  }

  // Généreux
  const hasOverpayment = plans.some(plan => 
    plan.payments.some(payment => payment.amount > plan.monthlyAmount)
  );
  if (hasOverpayment) {
    allBadges[2].earned = true;
  }

  // Champion
  if (completedPlans > 0) {
    allBadges[3].earned = true;
  }

  // Discipline
  const hasSixMonths = plans.some(plan => plan.payments.length >= 6);
  if (hasSixMonths) {
    allBadges[4].earned = true;
  }

  return allBadges;
};

export const getEncouragementMessage = (progress: number): string => {
  if (progress < 25) {
    return "🚀 Excellent départ ! Continuez sur cette lancée !";
  } else if (progress < 50) {
    return "💪 Vous êtes sur la bonne voie ! Continuez comme ça !";
  } else if (progress < 75) {
    return "🔥 Plus que la moitié ! Vous y êtes presque !";
  } else if (progress < 100) {
    return "🎯 Dernière ligne droite ! Vous allez y arriver !";
  } else {
    return "🎉 Félicitations ! Vous avez atteint votre objectif !";
  }
};

export const savePlansToStorage = (plans: SavingsPlan[]): void => {
  localStorage.setItem('savingsPlans', JSON.stringify(plans));
};

export const loadPlansFromStorage = (): SavingsPlan[] => {
  const stored = localStorage.getItem('savingsPlans');
  return stored ? JSON.parse(stored) : [];
};
