import React, { useState, useRef, useEffect } from 'react';
import { Transaction, ChatMessage } from '../types';
import { Send, Bot, User, Sparkles, Trash2 } from 'lucide-react';
import { generateFinancialAdvice } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid';

interface AIAdvisorViewProps {
  transactions: Transaction[];
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onClearChat: () => void;
}

export const AIAdvisorView: React.FC<AIAdvisorViewProps> = ({ transactions, messages, setMessages, onClearChat }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      text: input.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // API Call
    const responseText = await generateFinancialAdvice(userMsg.text, transactions);

    const modelMsg: ChatMessage = {
      id: uuidv4(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Helper to render formatted text (bold and bullet points)
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1">
        {lines.map((line, i) => {
          const trimmed = line.trim();
          // Handle bullet points
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
            const content = trimmed.replace(/^[\*\-•]\s/, '');
            return (
              <div key={i} className="flex items-start gap-2 ml-1">
                <span className="text-current opacity-60 mt-1.5 text-[8px]">●</span>
                <span className="flex-1">{parseBold(content)}</span>
              </div>
            );
          }
          // Handle numbered lists (simple detection)
          if (/^\d+\.\s/.test(trimmed)) {
             return (
               <div key={i} className="ml-1">
                 {parseBold(trimmed)}
               </div>
             );
          }
          // Handle empty lines
          if (!trimmed) {
            return <div key={i} className="h-2" />;
          }
          // Regular text
          return <p key={i}>{parseBold(line)}</p>;
        })}
      </div>
    );
  };

  const parseBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white">
              <Sparkles size={16} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">AI Advisor</h1>
         </div>
         <button 
           onClick={onClearChat}
           className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
           title="Clear Chat"
         >
           <Trash2 size={20} />
         </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 no-scrollbar pb-32">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-end max-w-[85%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200' : 'bg-brand-100 text-brand-600'}`}>
                {msg.role === 'user' ? <User size={16} className="text-slate-600" /> : <Bot size={16} />}
              </div>

              <div 
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-br-none' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                {renderFormattedText(msg.text)}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div className="px-4 py-3 bg-white border border-slate-200 rounded-2xl rounded-bl-none shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-20 left-0 right-0 px-4">
         <div className="max-w-md mx-auto relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your finances..."
              className="w-full pl-4 pr-12 py-4 rounded-full border border-slate-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-slate-900"
              disabled={isLoading}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-90"
            >
              <Send size={18} />
            </button>
         </div>
      </div>
    </div>
  );
};