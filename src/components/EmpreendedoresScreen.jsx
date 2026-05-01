import React from "react";
import { useState, useEffect } from 'react';
import CookieLogo from './CookieLogo';
import EntrepreneurCard from './EntrepreneurCard';
import { EMPRENDEDORES } from '../data/places';
import { getSolicitudes } from '../utils/solicitudes';

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function EmpreendedoresScreen() {
  const [form, setForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '', rubro: '', zona: '', whatsapp: '', instagram: '', desc: '', promo: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const aprobadas = getSolicitudes().filter(s => s.estado === 'aprobado');
    const allItems = [...EMPRENDEDORES, ...aprobadas];
    setItems(shuffleArray(allItems));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = Date.now();
    const nueva = {
      id,
      nombre: formData.nombre,
      rubro: formData.rubro,
      zona: formData.zona,
      whatsapp: formData.whatsapp,
      instagram: formData.instagram,
      desc: formData.desc,
      promo: formData.promo,
      etiqueta: 'pendiente',
      fecha: new Date().toISOString()
    };
    const solicitudes = JSON.parse(localStorage.getItem('mcrocante_solicitudes') || '[]');
    solicitudes.push(nueva);
    localStorage.setItem('mcrocante_solicitudes', JSON.stringify(solicitudes));
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setForm(false); setFormData({ nombre: '', rubro: '', zona: '', whatsapp: '', instagram: '', desc: '', promo: '' }); }, 2000);
  };

  return (
    <div className="px-5 pt-safe">
      <div className="pt-6 pb-4 flex items-center gap-3">
        <CookieLogo size={32} />
        <div>
          <h2 className="text-2xl font-extrabold text-stone-800">Explorar</h2>
          <p className="text-xs text-stone-400">Emprendimientos de San Luis</p>
        </div>
      </div>

      {/* SUMA TU EMPRENDIMIENTO - Slice design */}
      {!form ? (
        <div className="relative mb-6 group">
          <div className="absolute inset-0 bg-gradient-to-r from-naranja to-amber-400 rounded-2xl transform rotate-[1deg] group-hover:rotate-0 transition-transform" />
          <button onClick={() => setForm(true)} className="relative w-full bg-white rounded-2xl p-5 font-bold text-[14px] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-naranja rounded-full flex items-center justify-center text-white text-lg font-bold">+</div>
            <span className="text-stone-800">Suma tu emprendimiento</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6 border border-stone-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-naranja via-amber-400 to-naranja" />
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🎉</div>
              <p className="font-bold text-stone-800">Enviado!</p>
              <p className="text-sm text-stone-500 mt-1">Tu emprendimiento aparecera pronto.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <h3 className="font-bold text-stone-800 text-sm">Nuevo emprendimiento</h3>
              <input required placeholder="Nombre" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="border-2 border-stone-100 rounded-xl px-4 py-3 text-sm outline-none bg-crema/50 focus:border-naranja/50 transition-colors" />
              <select value={formData.rubro} onChange={e => setFormData({...formData, rubro: e.target.value})} required className="border-2 border-stone-100 rounded-xl px-4 py-3 text-sm outline-none bg-crema/50 focus:border-naranja/50 transition-colors text-stone-500">
                <option value="">Rubro</option>
                <option>Comida</option><option>Artesania</option><option>Ropa</option><option>Servicios</option><option>Tecnologia</option><option>Otro</option>
              </select>
              <input required placeholder="Barrio / Localidad" value={formData.zona} onChange={e => setFormData({...formData, zona: e.target.value})} className="border-2 border-stone-100 rounded-xl px-4 py-3 text-sm outline-none bg-crema/50 focus:border-naranja/50 transition-colors" />
              <input placeholder="WhatsApp" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="border-2 border-stone-100 rounded-xl px-4 py-3 text-sm outline-none bg-crema/50 focus:border-naranja/50 transition-colors" />
              <input placeholder="Instagram" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} className="border-2 border-stone-100 rounded-xl px-4 py-3 text-sm outline-none bg-crema/50 focus:border-naranja/50 transition-colors" />
              <textarea required placeholder="Que ofrece tu negocio?" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} rows={3} className="border-2 border-stone-100 rounded-xl px-4 py-3 text-sm outline-none bg-crema/50 focus:border-naranja/50 transition-colors resize-none" />
              <input placeholder="Promo (opcional)" value={formData.promo} onChange={e => setFormData({...formData, promo: e.target.value})} className="border-2 border-stone-100 rounded-xl px-4 py-3 text-sm outline-none bg-crema/50 focus:border-naranja/50 transition-colors" />
              <button type="submit" className="bg-naranja text-white rounded-xl py-3 font-bold text-[14px] active:bg-naranja-hover transition-colors mt-1">Enviar</button>
              <button type="button" onClick={() => setForm(false)} className="text-sm text-stone-400 py-2">Cancelar</button>
            </form>
          )}
        </div>
      )}

      {/* LIST */}
      <div className="flex flex-col gap-3">
        {items.map(emp => (
          <EntrepreneurCard key={emp.id} item={emp} featured={emp.destacado} />
        ))}
      </div>
    </div>
  );
}
