import React, { useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, formatCurrency } from '../constants';
import { Icon } from '../components/Icon';

interface DashboardViewProps {
  transactions: Transaction[];
  onEditTransaction: (transaction: Transaction) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ transactions, onEditTransaction }) => {
  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      income,
      expense,
      balance: income - expense
    };
  }, [transactions]);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getCategoryDetails = (id: string, type: TransactionType) => {
    const list = type === TransactionType.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    return list.find(c => c.id === id) || { label: 'Unknown', icon: 'HelpCircle', color: '#94a3b8' };
  };

  return (
    <div className="p-6 pb-32 space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hello, Owner</h1>
          <p className="text-slate-500 text-sm">Here is your financial summary</p>
        </div>
      </header>

      {/* Total Balance Card */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Wallet size={18} />
            <span className="text-sm font-medium">Total Balance</span>
          </div>
          <div className="text-3xl sm:text-4xl font-bold tracking-tight mb-6 break-words">
            {formatCurrency(stats.balance)}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-1 text-emerald-400 text-xs mb-1 font-medium">
                <ArrowUpCircle size={14} /> Income
              </div>
              <div className="text-sm sm:text-base font-bold truncate">{formatCurrency(stats.income)}</div>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-1 text-rose-400 text-xs mb-1 font-medium">
                <ArrowDownCircle size={14} /> Expense
              </div>
              <div className="text-sm sm:text-base font-bold truncate">{formatCurrency(stats.expense)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h2>
        {recentTransactions.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 text-slate-400">
            <p>No transactions yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map(t => {
              const cat = getCategoryDetails(t.category, t.type);
              return (
                <div 
                  key={t.id} 
                  onClick={() => onEditTransaction(t)}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between active:scale-[0.99] transition-transform cursor-pointer"
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-sm shrink-0"
                      style={{ backgroundColor: cat.color }}
                    >
                      <Icon name={cat.icon} size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 text-sm truncate">{t.description}</h3>
                      <p className="text-xs text-slate-500">{cat.label}</p>
                    </div>
                  </div>
                  <div className={`font-bold text-sm whitespace-nowrap ml-2 ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(t.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};