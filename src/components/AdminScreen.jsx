import { useState } from 'react';
import CookieLogo from './CookieLogo';
import AdminPanel from './AdminPanel';

const ADMIN_USER = 'cdbrws';
const ADMIN_PASS = 'asdluana';

export default function AdminScreen() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleLogin = () => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      setLoggedIn(true);
      setError(false);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  if (loggedIn) return <AdminPanel />;

  return (
    <div className="px-5 pt-safe max-w-md mx-auto flex flex-col items-center justify-center min-h-[80dvh]">
      <div className="mb-8 flex flex-col items-center">
        <CookieLogo size={56} />
        <h2 className="text-2xl font-extrabold text-stone-800 mt-4">Admin</h2>
        <p className="text-sm text-stone-400 mt-1">Modo Crocante</p>
      </div>

      <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
        <div className="flex flex-col gap-3">
          <input
            value={user}
            onChange={e => { setUser(e.target.value); setError(false); }}
            placeholder="Usuario"
            className={`w-full border-2 rounded-xl px-4 py-3 text-[14px] outline-none transition-colors ${error ? 'border-red-300 bg-red-50' : 'border-stone-100 bg-crema/50 focus:border-naranja/50'}`}
            onKeyDown={e => { if (e.key === 'Enter') handleLogin(); }}
          />
          <input
            type="password"
            value={pass}
            onChange={e => { setPass(e.target.value); setError(false); }}
            placeholder="Contraseña"
            className={`w-full border-2 rounded-xl px-4 py-3 text-[14px] outline-none transition-colors ${error ? 'border-red-300 bg-red-50' : 'border-stone-100 bg-crema/50 focus:border-naranja/50'}`}
            onKeyDown={e => { if (e.key === 'Enter') handleLogin(); }}
          />
          {error && (
            <p className="text-xs text-red-500 font-medium text-center">Usuario o contraseña incorrectos</p>
          )}
          <button
            onClick={handleLogin}
            className={`w-full bg-stone-800 text-white font-bold rounded-xl py-3 text-[14px] active:scale-[0.98] transition-all ${shake ? 'animate-shake' : ''}`}
          >
            Entrar
          </button>
        </div>
      </div>

      <p className="text-[10px] text-stone-300 mt-6">Solo personal autorizado</p>
    </div>
  );
}
