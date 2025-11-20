import React, { useMemo, useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis } from 'recharts';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, formatCurrency } from '../constants';

interface AnalyticsViewProps {
  transactions: Transaction[];
}

type TimeFilter = 'MONTH' | 'YEAR' | 'ALL';

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ transactions }) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('MONTH');

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions.filter(t => {
      const tDate = new Date(t.date);
      if (timeFilter === 'MONTH') {
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
      }
      if (timeFilter === 'YEAR') {
        return tDate.getFullYear() === currentYear;
      }
      return true;
    });
  }, [transactions, timeFilter]);
  
  const expenseCategoryData = useMemo(() => {
    const expenses = filteredTransactions.filter(t => t.type === TransactionType.EXPENSE);
    const grouped: Record<string, number> = {};
    
    expenses.forEach(t => {
      grouped[t.category] = (grouped[t.category] || 0) + t.amount;
    });

    return Object.entries(grouped)
      .map(([catId, amount]) => {
        const catDef = EXPENSE_CATEGORIES.find(c => c.id === catId);
        return {
          name: catDef?.label || catId,
          value: amount,
          color: catDef?.color || '#cbd5e1'
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const incomeCategoryData = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === TransactionType.INCOME);
    const grouped: Record<string, number> = {};
    
    income.forEach(t => {
      grouped[t.category] = (grouped[t.category] || 0) + t.amount;
    });

    return Object.entries(grouped)
      .map(([catId, amount]) => {
        const catDef = INCOME_CATEGORIES.find(c => c.id === catId);
        return {
          name: catDef?.label || catId,
          value: amount,
          color: catDef?.color || '#cbd5e1'
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const monthlyData = useMemo(() => {
    // Trend Logic
    const months: Record<string, number> = {};
    
    if (timeFilter === 'YEAR') {
       for(let i=0; i<12; i++) {
         const d = new Date(new Date().getFullYear(), i, 1);
         const key = d.toLocaleString('default', { month: 'short' });
         months[key] = 0;
       }
    }
    
    filteredTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        const d = new Date(t.date);
        const key = d.toLocaleString('default', { month: 'short' });
        if (months[key] !== undefined || timeFilter !== 'YEAR') {
           months[key] = (months[key] || 0) + t.amount;
        }
      });
      
    let result = Object.entries(months).map(([name, value]) => ({ name, value }));
    
    if (timeFilter === 'YEAR') {
        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        result.sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name));
    }
    
    return result;
  }, [filteredTransactions, timeFilter]);

  const totalExpense = expenseCategoryData.reduce((sum, item) => sum + item.value, 0);
  const totalIncome = incomeCategoryData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="p-6 pb-32 h-full overflow-y-auto no-scrollbar">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Insights</h1>

      {/* Filters */}
      <div className="bg-slate-100 p-1 rounded-xl flex mb-6">
        {(['MONTH', 'YEAR', 'ALL'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setTimeFilter(f)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              timeFilter === f 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {f === 'MONTH' ? 'This Month' : f === 'YEAR' ? 'This Year' : 'All Time'}
          </button>
        ))}
      </div>

      {/* Chart 1: Expense Breakdown */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mb-6">
        <h2 className="text-sm font-bold text-slate-500 uppercase mb-4 tracking-wide">Expense Breakdown</h2>
        
        {totalExpense > 0 ? (
          <>
            <div className="h-64 w-full relative">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {expenseCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Amount']}
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: 'white' }}
                    itemStyle={{ color: 'white' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                   <span className="block text-xs text-slate-400 font-semibold uppercase">Total</span>
                   <span className="block text-xl font-bold text-slate-900">
                     {new Intl.NumberFormat('id-ID', { notation: "compact", compactDisplay: "short" }).format(totalExpense)}
                   </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              {expenseCategoryData.slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="font-medium text-slate-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 text-xs">
                      {((item.value / totalExpense) * 100).toFixed(0)}%
                    </span>
                    <span className="font-bold text-slate-900">{formatCurrency(item.value)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
           <div className="h-40 flex items-center justify-center text-slate-400 text-sm">
             No expense data for this period.
           </div>
        )}
      </div>

      {/* Chart 2: Income Breakdown */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mb-6">
        <h2 className="text-sm font-bold text-slate-500 uppercase mb-4 tracking-wide">Income Breakdown</h2>
        
        {totalIncome > 0 ? (
          <>
            <div className="h-64 w-full relative">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {incomeCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Amount']}
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: 'white' }}
                    itemStyle={{ color: 'white' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                   <span className="block text-xs text-slate-400 font-semibold uppercase">Total</span>
                   <span className="block text-xl font-bold text-slate-900">
                     {new Intl.NumberFormat('id-ID', { notation: "compact", compactDisplay: "short" }).format(totalIncome)}
                   </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              {incomeCategoryData.slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="font-medium text-slate-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 text-xs">
                      {((item.value / totalIncome) * 100).toFixed(0)}%
                    </span>
                    <span className="font-bold text-slate-900">{formatCurrency(item.value)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
           <div className="h-40 flex items-center justify-center text-slate-400 text-sm">
             No income data for this period.
           </div>
        )}
      </div>

      {/* Chart 3: Expense Trend */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-sm font-bold text-slate-500 uppercase mb-4 tracking-wide">Expense Trend</h2>
        {monthlyData.length > 0 ? (
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }} 
                  dy={10}
                  interval={0}
                />
                <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: 'white' }}
                    formatter={(value: number) => [formatCurrency(value), '']}
                    labelStyle={{ display: 'none' }}
                  />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 4, 4]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-slate-400 text-sm">
             Not enough data.
           </div>
        )}
      </div>
    </div>
  );
};