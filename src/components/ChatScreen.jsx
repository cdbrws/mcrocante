import React from "react";
import { useState, useRef, useEffect } from 'react';
import { processMessage } from '../engine/aiaEngine';
import { getClima } from '../utils/clima';
import { trackChat } from '../utils/adminStats';
import TypingIndicator from './TypingIndicator';
import PlaceCard from './PlaceCard';
import CookieSend from './CookieSend';

const QUICK_CATS = [
  { emoji: '💸', label: 'Sin un mango', msg: 'No tengo un mango, busco planes gratis' },
  { emoji: '🛋️', label: 'Alta fiaca', msg: 'Alta fiaca de moverme, que hago?' },
  { emoji: '🚪', label: 'Quiero salir!', msg: 'Quiero salir de mi casa, que hay?' },
  { emoji: '🍔', label: 'Comer', msg: 'Quiero comer algo rico' },
  { emoji: '🎈', label: 'Con los pibes', msg: 'Busco planes para hacer con los pibes' },
  { emoji: '🎬', label: 'Ver peli', msg: 'Recomendame una peli para ver' },
  { emoji: '🎸', label: 'Musica', msg: 'Recomendame musica para escuchar' },
  { emoji: '💑', label: 'En pareja', msg: 'Busco un plan para ir en pareja' },
  { emoji: '🌙', label: 'De noche', msg: 'Que hay para hacer de noche?' },
  { emoji: '🌧️', label: 'Llueve', msg: 'Esta lloviendo, que puedo hacer?' },
  { emoji: '🏔️', label: 'Aire libre', msg: 'Quiero algo en aire libre' },
  { emoji: '🧑‍🍳', label: 'Cocinar', msg: 'Quiero cocinar en casa, dame recetas' },
];

const INITIAL_PROMPTS = [
  'Algo tranqui y barato',
  'Salir a comer',
  'Planes gratis',
  'Qué hacer hoy',
  'Lugares para ir',
];

export default function ChatScreen({ messages, onAddMessage, savedIds, onToggleSave, onBack, chatKey }) {
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [lastSuggestions, setLastSuggestions] = useState([]);
  const [fadeOut, setFadeOut] = useState(false);
  const [initialPrompts, setInitialPrompts] = useState(() => INITIAL_PROMPTS.slice(0,5).sort(() => Math.random() - 0.5));
  const scrollRef = useRef(null);

  useEffect(() => {
    if (typeof chatKey !== 'undefined') {
      setInitialPrompts(INITIAL_PROMPTS.sort(() => Math.random() - 0.5).slice(0,5));
    }
  }, [chatKey]);

  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'user') {
      setTyping(true);
      const clima = getClima();
      const timer = setTimeout(() => {
        const resp = processMessage(messages[0].text, clima);
        setTimeout(() => {
          onAddMessage({ role: 'system', text: resp.text, results: resp.results });
          setLastSuggestions(resp.suggestions);
          setTyping(false);
          trackChat(messages[0].text, resp.intent, resp.results);
        }, 600);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current && !typing) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const triggerSend = (text) => {
    if (!text.trim()) return;
    setInput('');
    setFadeOut(true);
    setTimeout(() => { setLastSuggestions([]); setFadeOut(false); }, 200);
    onAddMessage({ role: 'user', text });
    setTyping(true);
    setTimeout(() => {
      const clima = getClima();
      const resp = processMessage(text, clima);
      setTimeout(() => {
        onAddMessage({ role: 'system', text: resp.text, results: resp.results });
        setLastSuggestions(resp.suggestions);
        setTyping(false);
        trackChat(text, resp.intent, resp.results);
      }, 600);
    }, 500);
  };

  const handleSend = () => { triggerSend(input); };
  const handleSuggestion = (s) => { triggerSend(s); };
  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSend(); };
  const hasResponse = messages.some(m => m.role === 'system');

  return (
    <div className="flex flex-col h-[100dvh] bg-crema">
      <div className="bg-white/80 backdrop-blur-lg px-4 py-3 pt-safe flex items-center gap-3 shadow-sm sticky top-0 z-10 border-b border-stone-100">
        <button onClick={onBack} className="text-xl text-stone-500 p-1 active:text-naranja transition-colors">←</button>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-naranja/10 rounded-full flex items-center justify-center overflow-hidden">
            <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
              <path d="M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28c13.44 0 24.67-9.45 27.44-22.04C58.2 38.8 56 40 53.5 40c-2.5 0-4.5-2-4.5-4.5S51 31 53.5 31c1.38 0 2.6.62 3.44 1.59C58.98 29.54 60 26.37 60 22.5 60 10.07 47.93 4 32 4z" fill="#F97316"/>
              <ellipse cx="20" cy="18" rx="3" ry="2.5" fill="#7C2D12" opacity="0.7"/>
              <ellipse cx="38" cy="14" rx="2.5" ry="2" fill="#7C2D12" opacity="0.7"/>
              <ellipse cx="28" cy="42" rx="3" ry="2.5" fill="#7C2D12" opacity="0.7"/>
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-800">AIA Crocante</h2>
            <p className="text-[10px] text-green-500 font-medium">en linea</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1">
          {(() => { const c = getClima(); return <span className="text-sm" title={c.desc}>{c.emoji} {c.temperatura}°</span>; })()}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {!hasResponse && !typing && messages.length === 0 && (
          <div className="px-4 py-2" aria-label="prompts-inicial">
            <div className="flex flex-wrap gap-2">
              {initialPrompts.map(p => (
                <button key={p} onClick={() => handleSuggestion(p)} className="bg-stone-100 text-stone-600 rounded-full px-3 py-2 text-[11px] font-semibold whitespace-nowrap hover:bg-naranja hover:text-white transition-colors">
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className="flex flex-col">
            {msg.role === 'user' ? (
              <div className="self-end max-w-[85%]">
                <div className="bg-stone-800 text-white px-4 py-3 rounded-2xl rounded-br-md text-[14px] leading-relaxed shadow-sm">{msg.text}</div>
              </div>
            ) : (
              <div className="self-start max-w-[92%]">
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 bg-naranja/10 rounded-full flex items-center justify-center mt-0.5 shrink-0 overflow-hidden">
                    <svg width="14" height="14" viewBox="0 0 64 64" fill="none">
                      <path d="M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28c13.44 0 24.67-9.45 27.44-22.04C58.2 38.8 56 40 53.5 40c-2.5 0-4.5-2-4.5-4.5S51 31 53.5 31c1.38 0 2.6.62 3.44 1.59C58.98 29.54 60 26.37 60 22.5 60 10.07 47.93 4 32 4z" fill="#F97316"/>
                      <ellipse cx="20" cy="18" rx="3" ry="2.5" fill="#7C2D12" opacity="0.7"/>
                      <ellipse cx="38" cy="14" rx="2.5" ry="2" fill="#7C2D12" opacity="0.7"/>
                      <ellipse cx="28" cy="42" rx="3" ry="2.5" fill="#7C2D12" opacity="0.7"/>
                    </svg>
                  </div>
                  <div>
                    <div className="bg-white text-stone-700 px-4 py-3 rounded-2xl rounded-bl-md text-[14px] leading-relaxed shadow-sm whitespace-pre-line">{msg.text}</div>
                    {msg.results && msg.results.length > 0 && (
                      <div className="mt-2 flex flex-col gap-2 pl-1">
                        {msg.results.map(item => (
                          <PlaceCard key={item.id} item={item} saved={savedIds.includes(item.id)} onToggleSave={onToggleSave} compact />
                        ))}
                      </div>
                    )}
                    {lastSuggestions.length > 0 && i === messages.length - 1 && !typing && (
                      <div className={`mt-2 transition-all duration-200 ${fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                          {lastSuggestions.slice(0, 3).map(s => (
                            <button key={s} onClick={() => handleSuggestion(s)} className="bg-stone-100 text-stone-500 rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap active:bg-naranja active:text-white transition-colors shrink-0">{s}</button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div className="self-start flex items-center gap-2">
            <div className="w-7 h-7 bg-naranja/10 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
              <svg width="14" height="14" viewBox="0 0 64 64" fill="none">
                <path d="M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28c13.44 0 24.67-9.45 27.44-22.04C58.2 38.8 56 40 53.5 40c-2.5 0-4.5-2-4.5-4.5S51 31 53.5 31c1.38 0 2.6.62 3.44 1.59C58.98 29.54 60 26.37 60 22.5 60 10.07 47.93 4 32 4z" fill="#F97316"/>
                <ellipse cx="20" cy="18" rx="3" ry="2.5" fill="#7C2D12" opacity="0.7"/>
                <ellipse cx="38" cy="14" rx="2.5" ry="2" fill="#7C2D12" opacity="0.7"/>
                <ellipse cx="28" cy="42" rx="3" ry="2.5" fill="#7C2D12" opacity="0.7"/>
              </svg>
            </div>
            <div className="bg-white rounded-2xl rounded-bl-md shadow-sm"><TypingIndicator /></div>
          </div>
        )}
      </div>

      <div className="bg-white/90 backdrop-blur-lg border-t border-stone-100 px-4 py-2">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {QUICK_CATS.map(cat => (
            <button key={cat.label} onClick={() => triggerSend(cat.msg)} className="flex items-center gap-1.5 bg-stone-100 rounded-full px-3 py-1.5 whitespace-nowrap shrink-0 active:bg-naranja active:text-white transition-colors">
              <span className="text-sm">{cat.emoji}</span>
              <span className="text-[11px] font-medium text-stone-600">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-lg px-4 py-3 pb-safe flex gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] border-t border-stone-100">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Escribi algo..." className="flex-1 border-2 border-stone-100 rounded-full px-4 py-3 text-[14px] outline-none bg-crema/50 focus:border-naranja/50 transition-colors" />
        <button onClick={handleSend} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shrink-0 ${input.trim() ? 'bg-naranja shadow-lg shadow-naranja/30 active:scale-90' : 'bg-crema-dark'}`}>
          <CookieSend size={22} className={input.trim() ? 'drop-shadow' : 'opacity-50'} />
        </button>
      </div>
    </div>
  );
}
