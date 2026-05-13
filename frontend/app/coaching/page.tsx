'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User as UserIcon, Loader2, Sparkles, History, MoreVertical } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function Coaching() {
  const { settings } = useSettings();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: 'Hello! I am your AI Coach. How can I help you with your fitness journey today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I am having trouble connecting to my brain right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground transition-colors duration-500 overflow-hidden">
      {/* Chat Header */}
      <header className="px-6 h-16 border-b border-surface-border flex justify-between items-center bg-background/80 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <Bot size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="font-display font-black text-lg tracking-tighter uppercase leading-none">KINETIC AI COACH</h1>
            <div className="flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Active Processing</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-foreground/40">
          <button className="hover:text-primary transition-colors"><History size={20} /></button>
          <button className="hover:text-primary transition-colors"><MoreVertical size={20} /></button>
        </div>
      </header>

      {/* Messages Container */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 hide-scrollbar scroll-smooth"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border transition-all duration-300 ${
                m.role === 'user' 
                  ? 'bg-surface border-surface-border' 
                  : 'bg-primary/10 border-primary/20'
              }`}>
                {m.role === 'user' 
                  ? <UserIcon size={18} className="text-foreground/60" /> 
                  : <Sparkles size={18} className="text-primary" />
                }
              </div>
              <div className={`p-5 rounded-2xl transition-all duration-300 ${
                m.role === 'user' 
                  ? 'bg-surface text-foreground rounded-tr-none border border-surface-border shadow-sm' 
                  : 'bg-primary text-black font-medium rounded-tl-none shadow-lg shadow-primary/10'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="flex gap-4 items-center bg-surface p-4 rounded-2xl border border-surface-border shadow-sm">
              <Loader2 className="animate-spin text-primary" size={18} />
              <span className="text-foreground/40 text-xs font-bold uppercase tracking-widest italic">Coach is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 md:p-8 border-t border-surface-border bg-background/80 backdrop-blur-xl shrink-0">
        <div className="max-w-4xl mx-auto relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe your goals or ask for a specialized routine..."
            className="w-full bg-surface border border-surface-border rounded-2xl px-8 py-5 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none pr-20 shadow-inner placeholder:text-foreground/20 font-medium"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary text-black rounded-xl flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-30 disabled:grayscale"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-center text-[10px] text-foreground/20 mt-4 uppercase font-bold tracking-[0.2em]">
          Powered by Volt Kinetic Intelligence Engine v4.2
        </p>
      </div>
    </div>
  );
}
