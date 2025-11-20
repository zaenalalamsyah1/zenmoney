import { Transaction } from '../types';
import { INITIAL_TRANSACTIONS_MOCK } from '../constants';

const STORAGE_KEY = 'zenmoney_transactions_v1';

export const getStoredTransactions = (): Transaction[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Seed with mock data for first time users for better UX
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TRANSACTIONS_MOCK));
      return INITIAL_TRANSACTIONS_MOCK;
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse transactions', e);
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (e) {
    console.error('Failed to save transactions', e);
  }
};
