import React, { useMemo, useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, formatCurrency } from '../constants';
import { Icon } from '../components/Icon';
import { Search, Calendar, X } from 'lucide-react';

interface TransactionsViewProps {
  transactions: Transaction[];
  onEditTransaction: (transaction: Transaction) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ transactions, onEditTransaction }) => {
  const [filter, setFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  // Default to current month "YYYY-MM"
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7));

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        // 1. Filter by Type
        if (filter !== 'ALL' && t.type !== filter) return false;
        
        // 2. Filter by Search (Description)
        if (searchQuery && !t.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        
        // 3. Filter by Month
        // t.date is ISO string (YYYY-MM-DD...), selectedMonth is YYYY-MM
        if (!t.date.startsWith(selectedMonth)) return false;

        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filter, searchQuery, selectedMonth]);

  const getCategoryDetails = (id: string, type: TransactionType) => {
    const list = type === TransactionType.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    return list.find(c => c.id === id) || { label: 'Unknown', icon: 'HelpCircle', color: '#94a3b8' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-6 pb-32 h-full overflow-y-auto no-scrollbar bg-slate-50">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">History</h1>

      <div className="space-y-3 mb-6 sticky top-0 bg-slate-50 pt-1 z-10">
        {/* Controls Row: Month Picker & Search */}
        <div className="flex gap-2">
          {/* Month Picker */}
          <div className="relative shrink-0">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
               <Calendar size={16} />
            </div>
            <input 
              type="month" 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="pl-9 pr-3 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm w-36" 
            />
          </div>

          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
               <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {['ALL', 'INCOME', 'EXPENSE'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors border shadow-sm ${
                filter === f 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f === 'ALL' ? 'All' : f === 'INCOME' ? 'Income' : 'Expense'}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filteredTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 opacity-60">
          <Search size={48} className="mb-4" strokeWidth={1.5} />
          <p>No transactions found for this period</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((t) => {
            const cat = getCategoryDetails(t.category, t.type);
            return (
              <div 
                key={t.id} 
                onClick={() => onEditTransaction(t)}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between animate-in slide-in-from-bottom-2 duration-300 cursor-pointer active:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: cat.color }}
                  >
                    <Icon name={cat.icon} size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{t.description}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <span>{formatDate(t.date)}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="truncate">{cat.label}</span>
                    </p>
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
  );
};