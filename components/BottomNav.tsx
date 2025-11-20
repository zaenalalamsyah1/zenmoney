import React from 'react';
import { LayoutDashboard, List, PieChart, Sparkles } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { view: ViewState.DASHBOARD, label: 'Home', icon: LayoutDashboard },
    { view: ViewState.TRANSACTIONS, label: 'History', icon: List },
    { view: ViewState.ANALYTICS, label: 'Insights', icon: PieChart },
    { view: ViewState.AI_ADVISOR, label: 'Ask AI', icon: Sparkles },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 pb-safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${
              currentView === item.view 
                ? 'text-brand-600' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <item.icon 
              size={24} 
              strokeWidth={currentView === item.view ? 2.5 : 2}
              className={currentView === item.view ? 'scale-110 transition-transform' : ''}
            />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
