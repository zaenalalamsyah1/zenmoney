import React, { useState, useEffect } from 'react';
import { ViewState, Transaction, ChatMessage } from './types';
import { getStoredTransactions, saveTransactions } from './services/storage';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './views/DashboardView';
import { TransactionsView } from './views/TransactionsView';
import { AnalyticsView } from './views/AnalyticsView';
import { AIAdvisorView } from './views/AIAdvisorView';
import { TransactionModal } from './components/TransactionModal';
import { v4 as uuidv4 } from 'uuid';
import { Plus } from 'lucide-react';

function App() {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Chat State (Lifted for persistence)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi! I'm your personal finance assistant. Ask me about your spending habits, or for tips on how to save!",
      timestamp: Date.now(),
    }
  ]);

  useEffect(() => {
    const loaded = getStoredTransactions();
    setTransactions(loaded);
  }, []);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const handleSaveTransaction = (txData: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      // Update existing
      setTransactions(prev => prev.map(t => 
        t.id === editingTransaction.id 
          ? { ...txData, id: editingTransaction.id } 
          : t
      ));
    } else {
      // Create new
      const transaction: Transaction = {
        ...txData,
        id: uuidv4(),
      };
      setTransactions(prev => [transaction, ...prev]);
    }
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    setEditingTransaction(null);
  };

  const openAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const openEditModal = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleClearChat = () => {
    setChatMessages([{
      id: uuidv4(),
      role: 'model',
      text: "Chat cleared! How can I help you with your finances now?",
      timestamp: Date.now(),
    }]);
  };

  return (
    <div className="h-full w-full bg-slate-50 relative">
      {/* Main Content Area */}
      <main className="h-full w-full overflow-hidden">
        {view === ViewState.DASHBOARD && (
          <div className="h-full overflow-y-auto no-scrollbar">
            <DashboardView 
              transactions={transactions} 
              onEditTransaction={openEditModal}
            />
          </div>
        )}
        {view === ViewState.TRANSACTIONS && (
          <TransactionsView 
            transactions={transactions} 
            onEditTransaction={openEditModal}
          />
        )}
        {view === ViewState.ANALYTICS && <AnalyticsView transactions={transactions} />}
        {view === ViewState.AI_ADVISOR && (
          <AIAdvisorView 
            transactions={transactions} 
            messages={chatMessages}
            setMessages={setChatMessages}
            onClearChat={handleClearChat}
          />
        )}
      </main>

      {/* Floating Add Button - Visible on Dashboard and Transactions */}
      {(view === ViewState.DASHBOARD || view === ViewState.TRANSACTIONS) && (
        <button
          onClick={openAddModal}
          className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-brand-500 hover:bg-brand-600 text-white rounded-full shadow-xl shadow-brand-500/30 flex items-center justify-center transition-transform active:scale-90 animate-in zoom-in duration-300"
        >
          <Plus size={32} />
        </button>
      )}

      {/* Modals */}
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }} 
        onSave={handleSaveTransaction}
        onDelete={editingTransaction ? handleDeleteTransaction : undefined}
        initialData={editingTransaction}
      />

      {/* Navigation */}
      <BottomNav currentView={view} onNavigate={setView} />
    </div>
  );
}

export default App;