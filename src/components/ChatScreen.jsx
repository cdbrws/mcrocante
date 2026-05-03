import { useState, useRef, useEffect } from 'react';
import { processMessage } from '../engine/aiaEngine';
import { getClima } from '../utils/clima';
import {
  trackSuggestionClick,
  trackEvent,
  trackUsageTime,
  trackPlaceView,
  trackSave,
} from '../utils/adminStats';
import TypingIndicator from './TypingIndicator';
import PlaceCard from './PlaceCard';
import CookieSend from './CookieSend';

const QUICK_CATS = [
  { emoji: '', label: 'Sin un mango', msg: 'No tengo un mango' },
  { emoji: '', label: 'Casa', msg: 'Algo en casa' },
  { emoji: '', label: 'Pareja', msg: 'Plan en pareja' },
  { emoji: '', label: 'Comer', msg: 'Comer' },
  { emoji: '', label: 'Peli', msg: 'Buscamos una peli' },
  { emoji: '', label: 'Música', msg: 'Escuchamos música' },
  { emoji: '️', label: 'Llueve', msg: 'Está lloviendo' },
  { emoji: '️', label: 'Aire libre', msg: 'Aire libre' },
];

const INITIAL_PROMPTS = [
  'No tengo un mango',
  'Plan en pareja',
  'Algo en casa',
  'Comer',
  'Salir',
  'Peli',
  'Música',
];

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function uniqueThree(list) {
  return [...new Set(list || [])].filter(Boolean).slice(0, 3);
}

function AiaAvatar({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path
        d="M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28c13.44 0 24.67-9.45 27.44-22.04C58.2 38.8 56 40 53.5 40c-2.5 0-4.5-2-4.5-4.5S51 31 53.5 31c1.38 0 2.6.62 3.44 1.59C58.98 29.54 60 26.37 60 22.5 60 10.07 47.93 4 32 4z"
        fill="#F97316"
      />
      <ellipse cx="20" cy="18" rx="3" ry="2.5" fill="#7C2D12" opacity="0.7" />
      <ellipse cx="38" cy="14" rx="2.5" ry="2" fill="#7C2D12" opacity="0.7" />
      <ellipse cx="28" cy="42" rx="3" ry="2.5" fill="#7C2D12" opacity="0.7" />
    </svg>
  );
}

export default function ChatScreen({
  messages,
  onAddMessage,
  savedIds,
  onToggleSave,
  onBack,
  chatKey,
}) {
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [lastSuggestions, setLastSuggestions] = useState([]);
  const [fadeOut, setFadeOut] = useState(false);
  const [initialPrompts, setInitialPrompts] = useState(() =>
    shuffleArray(INITIAL_PROMPTS).slice(0, 3)
  );

  const scrollRef = useRef(null);
  const sessionStartRef = useRef(Date.now());

  useEffect(() => {
    trackEvent('chat_screen_open', {
      source: 'ChatScreen',
    });

    return () => {
      trackUsageTime(Date.now() - sessionStartRef.current);
      trackEvent('chat_screen_close', {
        source: 'ChatScreen',
      });
    };
  }, []);

  useEffect(() => {
    if (typeof chatKey !== 'undefined') {
      setInitialPrompts(shuffleArray(INITIAL_PROMPTS).slice(0, 3));
      setLastSuggestions([]);
      setInput('');
      setTyping(false);

      trackEvent('chat_reset', {
        chatKey,
      });
    }
  }, [chatKey]);

  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'user') {
      setTyping(true);
      setLastSuggestions([]);

      const timer = setTimeout(() => {
        const clima = getClima();
        const resp = processMessage(messages[0].text, clima);

        setTimeout(() => {
          onAddMessage({
            role: 'system',
            text: resp.text,
            results: resp.results || [],
          });

          setLastSuggestions(uniqueThree(resp.suggestions));
          setTyping(false);
        }, 600);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current && !typing) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, typing]);

  const triggerSend = (text, meta = {}) => {
    const cleanText = String(text || '').trim();
    if (!cleanText) return;

    trackEvent('chat_send', {
      text: cleanText,
      source: meta.source || 'manual',
      label: meta.label || null,
    });

    setInput('');
    setFadeOut(true);

    setTimeout(() => {
      setLastSuggestions([]);
      setFadeOut(false);
    }, 160);

    onAddMessage({ role: 'user', text: cleanText });
    setTyping(true);

    setTimeout(() => {
      const clima = getClima();
      const resp = processMessage(cleanText, clima);

      setTimeout(() => {
        onAddMessage({
          role: 'system',
          text: resp.text,
          results: resp.results || [],
        });

        setLastSuggestions(uniqueThree(resp.suggestions));
        setTyping(false);
      }, 600);
    }, 450);
  };

  const handleSend = () => {
    triggerSend(input, { source: 'input' });
  };

  const handleSuggestion = (suggestion, source = 'suggestion') => {
    trackSuggestionClick(suggestion, { source });
    triggerSend(suggestion, { source, label: suggestion });
  };

  const handleQuickCategory = (cat) => {
    trackSuggestionClick(cat.msg, {
      source: 'quick_category',
      label: cat.label,
    });

    triggerSend(cat.msg, {
      source: 'quick_category',
      label: cat.label,
    });
  };

  const handleToggleSave = (itemId) => {
    trackSave(itemId);
    onToggleSave(itemId);
  };

  const handlePlaceView = (item) => {
    if (!item?.id) return;
    trackPlaceView(item.id);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const hasResponse = messages.some((message) => message.role === 'system');

  return (
    <div className="flex flex-col h-[100dvh] bg-crema">
      <div className="bg-white/80 backdrop-blur-lg px-4 py-3 pt-safe flex items-center gap-3 shadow-sm sticky top-0 z-10 border-b border-stone-100">
        <button
          onClick={onBack}
          className="text-xl text-stone-500 p-1 active:text-naranja transition-colors"
        >
          ←
        </button>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-naranja/10 rounded-full flex items-center justify-center overflow-hidden">
            <AiaAvatar size={22} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-stone-800">AIA Crocante</h2>
            <p className="text-[10px] text-green-500 font-medium">en línea</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1">
          {(() => {
            const clima = getClima();

            return (
              <span className="text-sm" title={clima.desc}>
                {clima.emoji} {clima.temperatura}°
              </span>
            );
          })()}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4"
      >
        {!hasResponse && !typing && messages.length === 0 && (
          <div className="px-1 py-2" aria-label="prompts-inicial">
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm text-stone-700 text-[14px] leading-relaxed mb-3 max-w-[92%]">
              Buenas! Buscando que hacer hoy?
              <br />
              Acá te dejo algunas opciones:
            </div>

            <div className="flex flex-wrap gap-2">
              {initialPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSuggestion(prompt, 'initial_prompt')}
                  className="bg-naranja/10 text-naranja border border-naranja/10 rounded-full px-3 py-2 text-[11px] font-bold whitespace-nowrap active:bg-naranja active:text-white transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={`${msg.role}-${index}`} className="flex flex-col">
            {msg.role === 'user' ? (
              <div className="self-end max-w-[85%]">
                <div className="bg-stone-800 text-white px-4 py-3 rounded-2xl rounded-br-md text-[14px] leading-relaxed shadow-sm">
                  {msg.text}
                </div>
              </div>
            ) : (
              <div className="self-start max-w-[92%]">
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 bg-naranja/10 rounded-full flex items-center justify-center mt-0.5 shrink-0 overflow-hidden">
                    <AiaAvatar size={14} />
                  </div>

                  <div>
                    <div className="bg-white text-stone-700 px-4 py-3 rounded-2xl rounded-bl-md text-[14px] leading-relaxed shadow-sm whitespace-pre-line">
                      {msg.text}
                    </div>

                    {msg.results && msg.results.length > 0 && (
                      <div className="mt-2 flex flex-col gap-2 pl-1">
                        {msg.results.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handlePlaceView(item)}
                            role="button"
                            tabIndex={0}
                          >
                            <PlaceCard
                              item={item}
                              saved={savedIds.includes(item.id)}
                              onToggleSave={handleToggleSave}
                              compact
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {lastSuggestions.length > 0 && index === messages.length - 1 && !typing && (
                      <div
                        className={`mt-2 transition-all duration-200 ${
                          fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                        }`}
                      >
                        <div className="flex flex-wrap gap-2 pb-1">
                          {lastSuggestions.map((suggestion) => (
                            <button
                              key={suggestion}
                              onClick={() => handleSuggestion(suggestion, 'aia_suggestion')}
                              className="bg-naranja/10 text-naranja border border-naranja/10 rounded-full px-3 py-1.5 text-[11px] font-bold whitespace-nowrap active:bg-naranja active:text-white transition-colors"
                            >
                              {suggestion}
                            </button>
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
              <AiaAvatar size={14} />
            </div>

            <div className="bg-white rounded-2xl rounded-bl-md shadow-sm">
              <TypingIndicator />
            </div>
          </div>
        )}
      </div>

      <div className="bg-white/90 backdrop-blur-lg border-t border-stone-100 px-4 py-2">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {QUICK_CATS.map((cat) => (
            <button
              key={cat.label}
              onClick={() => handleQuickCategory(cat)}
              className="flex items-center gap-1.5 bg-stone-100 rounded-full px-3 py-1.5 whitespace-nowrap shrink-0 active:bg-naranja active:text-white transition-colors"
            >
              <span className="text-sm">{cat.emoji}</span>
              <span className="text-[11px] font-medium text-stone-600">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-lg px-4 py-3 pb-safe flex gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] border-t border-stone-100">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribí algo..."
          className="flex-1 border-2 border-stone-100 rounded-full px-4 py-3 text-[14px] outline-none bg-crema/50 focus:border-naranja/50 transition-colors"
        />

        <button
          onClick={handleSend}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shrink-0 ${
            input.trim()
              ? 'bg-naranja shadow-lg shadow-naranja/30 active:scale-90'
              : 'bg-crema-dark'
          }`}
        >
          <CookieSend size={22} className={input.trim() ? 'drop-shadow' : 'opacity-50'} />
        </button>
      </div>
    </div>
  );
}
