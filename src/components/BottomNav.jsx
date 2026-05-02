import React from "react";
import CookieLogo from './CookieLogo';

const NAV_ITEMS = [
  { id: 'home', label: 'Inicio', custom: <CookieLogo size={22} /> },
  { id: 'explorar', label: 'Que Hay?', icon: 'building' },
  { id: 'chat', label: 'Nuevo', icon: 'plus', special: true },
  { id: 'admin', label: 'Admin', icon: 'settings' },
];

const ICON_PATHS = {
  building: <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
  plus: <path d="M12 4v16m8-8H4" />,
  bookmark: <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />,
  settings: <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
};

export default function BottomNav({ active, onNavigate }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg flex justify-around py-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-[100] border-t border-stone-100">
      {NAV_ITEMS.map(item => {
        const isActive = active === item.id;
        return (
          <button key={item.id} onClick={() => onNavigate(item.id)} className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-all ${item.special ? '' : isActive ? 'text-naranja' : 'text-stone-400'}`}>
            {item.custom ? (
              <div className={`transition-transform ${isActive ? 'scale-110' : ''}`}>{item.custom}</div>
            ) : (
              item.special ? (
                <div className="w-10 h-10 bg-naranja rounded-full flex items-center justify-center -mt-4 shadow-lg shadow-naranja/30 active:scale-90 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">{ICON_PATHS[item.icon]}</svg>
                </div>
              ) : (
                <svg className={`w-6 h-6 transition-transform ${isActive ? 'scale-110' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{ICON_PATHS[item.icon]}</svg>
              )
            )}
            <span className={`text-[10px] font-medium ${item.special ? 'text-naranja' : ''}`}>{item.label}</span>
            {isActive && !item.special && <div className="w-1 h-1 bg-naranja rounded-full mt-0.5" />}
          </button>
        );
      })}
    </nav>
  );
}
