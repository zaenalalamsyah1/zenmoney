export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string; // ISO string
  type: TransactionType;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  TRANSACTIONS = 'TRANSACTIONS',
  ANALYTICS = 'ANALYTICS',
  AI_ADVISOR = 'AI_ADVISOR',
}

export interface CategoryOption {
  id: string;
  label: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface DailyStat {
  date: string;
  amount: number;
}

export interface CategoryStat {
  name: string;
  value: number;
  color: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isError?: boolean;
}
