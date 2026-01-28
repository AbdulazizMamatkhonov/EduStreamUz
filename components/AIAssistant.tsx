
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isClassroom = !document.getElementById('courses'); 

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      content: 'Welcome to EduStream Support! How can we help you with your learning today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Mocking a simple support response instead of calling an AI API
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: "Thanks for your message! Our support team is currently offline, but you can check the 'Resources' tab for course materials or ask your teacher during the live session.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsLoading(false);
    }, 1000);
  };

  const content = (
    <div className={`bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/5 flex flex-col overflow-hidden h-full ${!isOpen && !isClassroom ? 'hidden' : ''}`}>
      <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <i className="fas fa-headset text-xs"></i>
          </div>
          <div>
            <h3 className="font-bold text-xs tracking-tight">Support Chat</h3>
            <p className="text-[8px] text-indigo-100 font-bold uppercase tracking-widest">Active Learning Help</p>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50"
      >
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-[13px] leading-relaxed ${
              m.sender === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-none shadow-sm'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
              <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-black/40 border-t border-white/5">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-slate-800 border-none rounded-xl px-4 py-2.5 text-xs text-white focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
          >
            <i className="fas fa-paper-plane text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  );

  if (isClassroom) {
    return content;
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-[60] ring-4 ring-white"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-comment-alt'} text-xl`}></i>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 z-[60] h-[500px]">
          {content}
        </div>
      )}
    </>
  );
};

export default AIAssistant;
