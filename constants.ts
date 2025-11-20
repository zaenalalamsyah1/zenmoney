import { CategoryOption, TransactionType } from './types';
import { 
  Utensils, 
  Bus, 
  ShoppingBag, 
  Home, 
  Zap, 
  Briefcase, 
  Gift, 
  TrendingUp,
  HeartPulse,
  Gamepad2,
  GraduationCap,
  MoreHorizontal
} from 'lucide-react';

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const EXPENSE_CATEGORIES: CategoryOption[] = [
  { id: 'food', label: 'Food & Dining', icon: 'Utensils', color: '#ef4444', type: TransactionType.EXPENSE },
  { id: 'transport', label: 'Transportation', icon: 'Bus', color: '#f97316', type: TransactionType.EXPENSE },
  { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag', color: '#eab308', type: TransactionType.EXPENSE },
  { id: 'housing', label: 'Housing', icon: 'Home', color: '#84cc16', type: TransactionType.EXPENSE },
  { id: 'utilities', label: 'Utilities', icon: 'Zap', color: '#06b6d4', type: TransactionType.EXPENSE },
  { id: 'health', label: 'Health', icon: 'HeartPulse', color: '#ec4899', type: TransactionType.EXPENSE },
  { id: 'entertainment', label: 'Entertainment', icon: 'Gamepad2', color: '#8b5cf6', type: TransactionType.EXPENSE },
  { id: 'education', label: 'Education', icon: 'GraduationCap', color: '#6366f1', type: TransactionType.EXPENSE },
  { id: 'other_expense', label: 'Other', icon: 'MoreHorizontal', color: '#64748b', type: TransactionType.EXPENSE },
];

export const INCOME_CATEGORIES: CategoryOption[] = [
  { id: 'salary', label: 'Salary', icon: 'Briefcase', color: '#22c55e', type: TransactionType.INCOME },
  { id: 'investment', label: 'Investment', icon: 'TrendingUp', color: '#10b981', type: TransactionType.INCOME },
  { id: 'gift', label: 'Gifts', icon: 'Gift', color: '#3b82f6', type: TransactionType.INCOME },
  { id: 'other_income', label: 'Other', icon: 'MoreHorizontal', color: '#94a3b8', type: TransactionType.INCOME },
];

export const INITIAL_TRANSACTIONS_MOCK = [
  {
    id: '1',
    amount: 10000000,
    description: 'Monthly Salary',
    category: 'salary',
    date: new Date(new Date().setDate(1)).toISOString(), // 1st of current month
    type: TransactionType.INCOME,
  },
  {
    id: '2',
    amount: 150000,
    description: 'Grocery Shopping',
    category: 'food',
    date: new Date(new Date().setDate(2)).toISOString(),
    type: TransactionType.EXPENSE,
  },
  {
    id: '3',
    amount: 2500000,
    description: 'Rent Payment',
    category: 'housing',
    date: new Date(new Date().setDate(3)).toISOString(),
    type: TransactionType.EXPENSE,
  },
  {
    id: '4',
    amount: 185000,
    description: 'Netflix & Spotify',
    category: 'entertainment',
    date: new Date(new Date().setDate(5)).toISOString(),
    type: TransactionType.EXPENSE,
  },
  {
    id: '5',
    amount: 1500000,
    description: 'Freelance Project',
    category: 'other_income',
    date: new Date(new Date().setDate(10)).toISOString(),
    type: TransactionType.INCOME,
  },
  {
    id: '6',
    amount: 25000,
    description: 'Coffee',
    category: 'food',
    date: new Date(new Date().setDate(12)).toISOString(),
    type: TransactionType.EXPENSE,
  },
];