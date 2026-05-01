import { useState, useEffect } from 'react';

const CHAT_FLOW = [
  { role: 'user', text: 'Tengo $2.000 y quiero comer algo', delay: 2000 },
  { role: 'aia', text: 'Con $2.000 hay un monton de opciones! 🍽️', delay: 1500 },
  { role: 'aia', text: 'Te tiro 3 lugares:\n\n🥟 Empanadas Dona Rosa - $800\n🍦 Heladeria El Paisano - $1.500\n☕ Cafe del Angel - $1.800', delay: 2000 },
  { role: 'user', text: 'Donde queda Dona Rosa?', delay: 1800 },
  { role: 'aia', text: 'Esta en el Centro! A 5 min de Plaza Pringles 📍', delay: 1500 },
  { role: 'aia', text: 'Tip: si vas antes de las 13hs hay menos fila 😉', delay: 1800 },
];

const CookieProfileSVG = () => (
  <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none">
    <path d="M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28c13.44 0 24.67-9.45 27.44-22.04C58.2 38.8 56 40 53.5 40c-2.5 0-4.5-2-4.5-4.5S51 31 53.5 31c1.38 0 2.6.62 3.44 1.59C58.98 29.54 60 26.37 60 22.5 60 10.07 47.93 4 32 4z" fill="#F97316"/>
    <ellipse cx="20" cy="18" rx="3" ry="2.5" fill="#7C2D12" opacity="0.7"/>
    <ellipse cx="38" cy="14" rx="2.5" ry="2" fill="#7C2D12" opacity="0.7"/>
    <ellipse cx="28" cy="42" rx="3" ry="2.5" fill="#7C2D12" opacity="0.7"/>
  </svg>
);

export default function iPhoneMockup() {
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= CHAT_FLOW.length) return;
    const current = CHAT_FLOW[step];
    const timer = setTimeout(() => {
      setMessages(prev => [...prev, current]);
      setStep(prev => prev + 1);
    }, current.delay);
    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (step < CHAT_FLOW.length) {
      const totalDelay = CHAT_FLOW.slice(0, step).reduce((a, c) => a + c.delay + 800, 0);
      const loopTimer = setTimeout(() => {
        setMessages([]);
        setStep(0);
      }, totalDelay + CHAT_FLOW[CHAT_FLOW.length - 1]?.delay + 3000);
      return () => clearTimeout(loopTimer);
    }
  }, [step]);

  return (
    <div className="relative mx-auto">
      <div className="relative w-[280px] h-[580px] bg-stone-900 rounded-[3rem] p-2 shadow-2xl shadow-stone-900/30">
        <div className="w-full h-full bg-crema rounded-[2.5rem] overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-stone-900 rounded-b-2xl z-20" />

          <div className="flex justify-between items-center px-6 pt-10 pb-2">
            <span className="text-[11px] font-semibold text-stone-400">9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-2 bg-stone-400 rounded-sm" />
              <div className="w-3 h-2 bg-naranja rounded-sm" />
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm">
            <div className="w-7 h-7 bg-naranja/10 rounded-full overflow-hidden">
              <CookieProfileSVG />
            </div>
            <div>
              <div className="text-[13px] font-bold text-stone-800">AIA Puntana</div>
              <div className="text-[10px] text-green-500 font-medium">en linea</div>
            </div>
          </div>

          <div className="flex flex-col gap-2 px-3 py-3 h-[380px] overflow-hidden">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                {msg.role === 'aia' && (
                  <div className="w-5 h-5 bg-naranja/10 rounded-full overflow-hidden mr-1.5 mt-1 shrink-0">
                    <CookieProfileSVG />
                  </div>
                )}
                <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-[11px] leading-relaxed whitespace-pre-line ${msg.role === 'user' ? 'bg-naranja text-white rounded-br-md' : 'bg-white text-stone-700 rounded-bl-md shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {step < CHAT_FLOW.length && (
              <div className="flex gap-1 self-start px-2 py-1">
                <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-white px-3 py-3 flex items-center gap-2">
            <div className="flex-1 bg-crema rounded-full px-3 py-2 text-[10px] text-stone-400">Escribi algo...</div>
            <div className="w-8 h-8 bg-naranja rounded-full flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 64 64" fill="none">
                <path d="M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28c13.44 0 24.67-9.45 27.44-22.04C58.2 38.8 56 40 53.5 40c-2.5 0-4.5-2-4.5-4.5S51 31 53.5 31c1.38 0 2.6.62 3.44 1.59C58.98 29.54 60 26.37 60 22.5 60 10.07 47.93 4 32 4z" fill="white"/>
                <ellipse cx="22" cy="24" rx="2.5" ry="2" fill="#F97316" opacity="0.7"/>
                <ellipse cx="36" cy="20" rx="2" ry="1.5" fill="#F97316" opacity="0.7"/>
                <ellipse cx="30" cy="38" rx="2.5" ry="2" fill="#F97316" opacity="0.7"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="absolute right-[-3px] top-[120px] w-[3px] h-[40px] bg-stone-700 rounded-r" />
        <div className="absolute left-[-3px] top-[100px] w-[3px] h-[25px] bg-stone-700 rounded-l" />
        <div className="absolute left-[-3px] top-[140px] w-[3px] h-[25px] bg-stone-700 rounded-l" />
      </div>

      <div className="absolute -inset-8 bg-naranja/5 rounded-full blur-3xl -z-10" />
    </div>
  );
}
