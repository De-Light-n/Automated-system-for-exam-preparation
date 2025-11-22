import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { createStudyChat } from '../services/grokService';
import { Send, User, Bot, Loader2, Sparkles, RefreshCw } from 'lucide-react';

interface ChatProps {
  context: string;
}

export const Chat: React.FC<ChatProps> = ({ context }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Привіт! Я твій AI-репетитор. Я прочитав твій конспект і готовий відповідати на питання.',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatSessionRef.current = createStudyChat(context);
  }, [context]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      if (chatSessionRef.current) {
        const result = await chatSessionRef.current.sendMessage({ message: userMsg.text });
        const modelMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: result.text || "Вибач, я не зміг сформулювати відповідь.",
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, modelMsg]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Виникла помилка з'єднання.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center gap-4 sticky top-0 z-10">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-slate-900 text-lg">AI Асистент</h3>
          <div className="flex items-center gap-1.5">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             <p className="text-xs text-slate-500 font-medium">Online • Контекст завантажено</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm
              ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-white text-primary'}
            `}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-6 h-6" />}
            </div>
            
            <div className={`
              max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed shadow-sm
              ${msg.role === 'user' 
                ? 'bg-slate-900 text-white rounded-tr-sm' 
                : 'bg-white text-slate-700 rounded-tl-sm border border-slate-100'}
            `}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-4 animate-in fade-in">
            <div className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center border-2 border-white shadow-sm">
               <Bot className="w-6 h-6" />
            </div>
            <div className="bg-white border border-slate-100 p-5 rounded-3xl rounded-tl-sm flex items-center gap-1.5 shadow-sm">
               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Запитай про щось..."
            className="w-full pl-5 pr-14 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary transition-all shadow-md hover:shadow-lg hover:scale-105"
          >
            {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  );
};