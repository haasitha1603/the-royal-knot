import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  X,
  MessageSquare,
  Send,
  CreditCard,
  Calendar,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  action?: {
    label: string;
    path?: string;
    onClick?: () => void;
  };
}

export const AIWeddingAssistant: React.FC = () => {
  const navigate = useNavigate();
  const { user, activeWeddingId } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: 'Namaste! I am your Royal Knot AI Concierge. I am grounded in your live celebration at Rambagh Palace (400 guests, ₹50L budget). How may I assist your wedding planning today?'
    }
  ]);

  const quickPrompts = [
    'Next pending payment?',
    'What tasks are upcoming?',
    'Simulate 60 extra guests',
    'Special Marriage Act documents',
    'Open Visual Seating'
  ];

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');

    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let reply: Message;

      if (lower.includes('payment') || lower.includes('escrow') || lower.includes('money') || lower.includes('bill')) {
        reply = {
          sender: 'assistant',
          text: 'You have 1 pending staged payment: Milestone 2 (Catering & Banquet 40% Advance) for ₹5,60,000 due to Royal Mewar Caterers. Escrow balance currently stands at ₹35,80,000.',
          action: {
            label: 'Go to Financial Milestones',
            path: '/dashboard'
          }
        };
      } else if (lower.includes('task') || lower.includes('todo') || lower.includes('schedule')) {
        reply = {
          sender: 'assistant',
          text: 'You have 2 key pending actions: 1) Countersign the Royal Mewar Catering Agreement, and 2) Review the lawn seating extension for the Grand Reception.',
          action: {
            label: 'Review Tasks in Dashboard',
            path: '/dashboard'
          }
        };
      } else if (lower.includes('60') || lower.includes('extra guest') || lower.includes('simulator') || lower.includes('capacity')) {
        reply = {
          sender: 'assistant',
          text: 'Adding +60 guests (Total: 460) projects an estimated commitment of ₹2,74,200 (including catering at ₹2,800/plate, 18% GST, tableware, and hampers). Note: 460 guests exceeds the Rambagh Ballroom standard capacity of 420; a garden marquee extension is recommended.',
          action: {
            label: 'Open Guest Impact Simulator',
            path: '/dashboard'
          }
        };
      } else if (lower.includes('seat') || lower.includes('table') || lower.includes('chair')) {
        reply = {
          sender: 'assistant',
          text: 'Visual Seating is active with 6 banquet tables. VIP Head Tables #1 & #2 are assigned to family dignitaries. You can drag and drop unassigned guests or view capacity limits.',
          action: {
            label: 'Open Visual Seating Planner',
            path: '/guests'
          }
        };
      } else if (lower.includes('marriage registration') || lower.includes('special marriage') || lower.includes('legal') || lower.includes('court')) {
        reply = {
          sender: 'assistant',
          text: 'For legal marriage solemnization under the Special Marriage Act (1954), you require: 3 adult witnesses with Government IDs, 30-day notice filing at the Sub-Registrar office, age/residence proof, and affidavits.',
          action: {
            label: 'View Marriage Registration Checklist',
            path: '/marriage-registration'
          }
        };
      } else if (lower.includes('approve') || lower.includes('sign for me') || lower.includes('release funds')) {
        reply = {
          sender: 'assistant',
          text: 'In accordance with platform governance (Section 5.9), I cannot autonomously execute digital signatures or release escrow payouts. Legally binding authorizations require your explicit authenticated sign-off.'
        };
      } else {
        reply = {
          sender: 'assistant',
          text: `I understand your query regarding "${textToSend}". I can guide you through palace venues, catering comparisons, budget projections, and guest management across Jaipur, Udaipur, and Jodhpur.`
        };
      }

      setMessages(prev => [...prev, reply]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-5 py-3 rounded-full bg-burgundy-700 hover:bg-burgundy-800 text-white font-medium text-xs sm:text-sm uppercase tracking-wider shadow-royal-lg border border-gold-400/50 transition-all duration-300 hover:scale-105"
          aria-label="Open AI Wedding Concierge"
        >
          <Sparkles className="w-4 h-4 text-gold-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span>AI Concierge</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* Concierge Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] max-h-[580px] h-[550px] rounded-3xl bg-white border border-gold-300 shadow-royal-lg flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-burgundy-900 to-burgundy-800 text-white border-b border-gold-400/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-gold-300 flex items-center justify-center text-gold-300">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-sm font-bold tracking-tight">Royal Knot AI Concierge</h3>
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-300" />
                </div>
                <span className="text-[10px] text-gold-200/80 block">Grounded in Aarav & Meera (Jaipur)</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-gold-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Grounded Chips */}
          <div className="px-4 py-2 bg-ivory-100 border-b border-gold-200 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-gold-300 text-[10px] text-charcoal-700 hover:border-burgundy-700 hover:text-burgundy-800 transition-colors font-medium"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF7F2]/40 text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-burgundy-700 text-white rounded-br-none shadow-sm'
                      : 'bg-white text-charcoal-800 border border-gold-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p>{m.text}</p>
                </div>

                {/* Grounded Action Navigation Link */}
                {m.action && (
                  <button
                    onClick={() => {
                      if (m.action?.path) {
                        navigate(m.action.path);
                        setIsOpen(false);
                      }
                    }}
                    className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gold-100 border border-gold-300 text-[11px] font-semibold text-gold-900 hover:bg-gold-200 transition-colors"
                  >
                    <span>{m.action.label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-gold-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about payments, seating, schedule..."
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-burgundy-700 text-white hover:bg-burgundy-800 transition-colors"
              title="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
