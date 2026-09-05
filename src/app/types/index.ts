export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export interface SavingsPlan {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  monthlyAmount: number;
  duration: number;
  startDate: string;
  targetDate: string;
  totalSaved: number;
  payments: Payment[];
  status: 'active' | 'completed' | 'cancelled';
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  month: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}
