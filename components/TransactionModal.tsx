import React, { useState, useEffect } from 'react';
import { X, Check, Trash2, AlertTriangle } from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants';
import { Icon } from './Icon';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (t: Omit<Transaction, 'id'>) => void;
  onDelete?: (id: string) => void;
  initialData?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave, onDelete, initialData }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Delete confirmation state
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsDeleteConfirming(false); // Reset delete state on open
      if (initialData) {
        setType(initialData.type);
        setAmount(initialData.amount.toString());
        setDescription(initialData.description);
        setCategoryId(initialData.category);
        setDate(initialData.date.split('T')[0]);
      } else {
        setAmount('');
        setDescription('');
        setCategoryId('');
        setDate(new Date().toISOString().split('T')[0]);
        setType(TransactionType.EXPENSE);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const categories = type === TransactionType.EXPENSE ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !categoryId) return;

    onSave({
      amount: parseFloat(amount),
      description,
      category: categoryId,
      date: new Date(date).toISOString(),
      type,
    });
    onClose();
  };

  const handleDeleteClick = () => {
    if (isDeleteConfirming) {
      // Actually delete
      if (initialData && onDelete) {
        onDelete(initialData.id);
        onClose();
      }
    } else {
      // First click - show confirmation state
      setIsDeleteConfirming(true);
      // Reset after 3 seconds if not clicked again
      setTimeout(() => setIsDeleteConfirming(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-xl pointer-events-auto transform transition-transform animate-in slide-in-from-bottom-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {initialData ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setType(TransactionType.EXPENSE)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                type === TransactionType.EXPENSE ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-500'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType(TransactionType.INCOME)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                type === TransactionType.INCOME ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              Income
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Amount (IDR)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">Rp</span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Category Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Category</label>
            <div className="grid grid-cols-4 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                    categoryId === cat.id
                      ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500'
                      : 'border-slate-100 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Icon name={cat.icon} size={20} className="mb-1" />
                  <span className="text-[10px] font-medium truncate w-full">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label>
              <input
                type="text"
                placeholder="e.g. Lunch"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
            >
              <Check size={20} />
              {initialData ? 'Update Transaction' : 'Save Transaction'}
            </button>
            
            {initialData && onDelete && (
              <button
                type="button"
                onClick={handleDeleteClick}
                className={`w-full py-3 border font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ${
                  isDeleteConfirming 
                    ? 'bg-rose-600 border-rose-600 text-white animate-pulse' 
                    : 'bg-white border-rose-100 text-rose-500 hover:bg-rose-50'
                }`}
              >
                {isDeleteConfirming ? (
                  <>
                    <AlertTriangle size={18} />
                    Tap again to Confirm Delete
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete Transaction
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};