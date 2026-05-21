'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User as UserIcon, Loader2, Sparkles, History, MoreVertical } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import TopAppBar from '@/components/TopAppBar';

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
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background text-foreground transition-colors duration-500">
      <TopAppBar title="KINETIC AI COACH" />

      {/* Messages Container */}
      <div 
        ref={scrollRef}
        className="hide-scrollbar flex-1 space-y-6 overflow-y-auto p-4 scroll-smooth sm:p-6 md:space-y-8 md:p-12 pt-20"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex max-w-[92%] gap-3 sm:max-w-[85%] sm:gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border transition-all duration-300 sm:flex ${
                m.role === 'user' 
                  ? 'bg-surface border-surface-border' 
                  : 'bg-primary/10 border-primary/20'
              }`}>
                {m.role === 'user' 
                  ? <UserIcon size={18} className="text-foreground/60" /> 
                  : <Sparkles size={18} className="text-primary" />
                }
              </div>
              <div className={`rounded-2xl p-4 transition-all duration-300 sm:p-5 ${
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
      <div className="shrink-0 border-t border-surface-border bg-background/80 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-xl sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe your goals or ask for a specialized routine..."
            className="w-full rounded-2xl border border-surface-border bg-surface px-4 py-4 pr-16 font-medium text-foreground shadow-inner outline-none transition-all placeholder:text-foreground/20 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:px-8 sm:py-5 sm:pr-20"
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
