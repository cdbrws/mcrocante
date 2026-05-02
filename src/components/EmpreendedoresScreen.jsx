import React from "react";
import { useState, useEffect } from 'react';
import CookieLogo from './CookieLogo';
import EntrepreneurCard from './EntrepreneurCard';
import { EMPRENDEDORES } from '../data/places';
import { getSolicitudes } from '../utils/solicitudes';

const EMPTY_FORM = {
  nombre: '',
  rubro: '',
  zona: '',
  whatsapp: '',
  instagram: '',
  desc: '',
  imagen: '',
  tags: '',
};

const RUBROS = [
  'Comida',
  'Café / Merienda',
  'Helado',
  'Ropa',
  'Artesania',
  'Servicios',
  'Tecnologia',
  'Belleza',
  'Eventos',
  'Otro',
];

function shuffleArray(arr) {
  const shuffled = [...arr];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function normalizeTags(tagsText) {
  return String(tagsText || '')
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
}

function getDefaultTags({ rubro, zona, desc }) {
  const base = [];

  if (rubro) base.push(rubro.toLowerCase());
  if (zona) base.push(zona.toLowerCase());

  const text = `${rubro || ''} ${zona || ''} ${desc || ''}`.toLowerCase();

  if (text.includes('comida') || text.includes('hamburg') || text.includes('pizza') || text.includes('lomo') || text.includes('empanada')) {
    base.push('comida', 'comer barato');
  }

  if (text.includes('cafe') || text.includes('café') || text.includes('merienda')) {
    base.push('cafe', 'merienda');
  }

  if (text.includes('niño') || text.includes('chico') || text.includes('familia')) {
    base.push('familia', 'modo luchon');
  }

  if (text.includes('promo') || text.includes('barato') || text.includes('descuento')) {
    base.push('barato', 'promo');
  }

  return [...new Set(base)];
}

export default function EmpreendedoresScreen() {
  const [form, setForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const aprobadas = getSolicitudes().filter((solicitud) => solicitud.estado === 'aprobado');
    const allItems = [...EMPRENDEDORES, ...aprobadas];

    setItems(shuffleArray(allItems));
  }, []);

  const resetForm = () => {
    setSubmitted(false);
    setForm(false);
    setFormData(EMPTY_FORM);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const manualTags = normalizeTags(formData.tags);
    const autoTags = getDefaultTags(formData);

    const nueva = {
      id: Date.now(),
      nombre: formData.nombre.trim(),
      rubro: formData.rubro,
      zona: formData.zona.trim(),
      whatsapp: formData.whatsapp.trim(),
      instagram: formData.instagram.trim(),
      desc: formData.desc.trim(),
      imagen: formData.imagen.trim(),
      tags: [...new Set([...manualTags, ...autoTags])],
      estado: 'pendiente',
      destacado: false,
      sponsor: false,
      prioridad: 'normal',
      fecha: new Date().toISOString(),
      notasAdmin: '',
      origen: 'formulario-publico',
    };

    const solicitudes = JSON.parse(localStorage.getItem('mcrocante_solicitudes') || '[]');
    solicitudes.push(nueva);
    localStorage.setItem('mcrocante_solicitudes', JSON.stringify(solicitudes));

    setSubmitted(true);

    setTimeout(() => {
      resetForm();
    }, 2200);
  };

  return (
    <div className="px-5 pt-safe">
      <div className="pt-6 pb-4 flex items-center gap-3">
        <CookieLogo size={32} />
        <div>
          <h2 className="text-2xl font-extrabold text-stone-800">Qué hay</h2>
          <p className="text-xs text-stone-400">Comercios y emprendimientos de San Luis</p>
        </div>
      </div>

      {/* SUMA TU EMPRENDIMIENTO */}
      {!form ? (
        <div className="relative mb-6 group">
          <div className="absolute inset-0 bg-gradient-to-r from-naranja to-amber-400 rounded-2xl transform rotate-[1deg] group-hover:rotate-0 transition-transform" />
          <button
            onClick={() => setForm(true)}
            className="relative w-full bg-white rounded-2xl p-5 font-bold text-[14px] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <div className="w-8 h-8 bg-naranja rounded-full flex items-center justify-center text-white text-lg font-bold">
              +
            </div>
            <span className="text-stone-800">Sumá tu emprendimiento</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6 border border-stone-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-naranja via-amber-400 to-naranja" />

          {submitted ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🎉</div>
              <p className="font-bold text-stone-800">¡Enviado!</p>
              <p className="text-sm text-stone-500 mt-1">
                Tu emprendimiento queda pendiente de aprobación.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <h3 className="font-bold text-stone-800 text-sm">Nuevo emprendimiento</h3>
                <p className="text-xs text-stone-400 mt-1">
                  Cargá datos simples. No pongas precios: se desactualizan rápido.
                </p>
              </div>

              <input
                required
                placeholder="Nombre del negocio"
                value={formData.nombre}
                onChange={(event) => setFormData({ ...formData, nombre: event.target.value })}
                className="border-2 border-stone-100 rounded-xl px-4 py-3 text-sm outline-none bg-crema/50 focus:border-naranja/50 transition-colors"
              />

              <select
                value={formData.rubro}
                onChange={(event) => setFormData({ ...formData, rubro: event.target.value })}
                required
                className="border-2 border-stone-100 rounded-xl px-4 py-3 text-sm outline-none bg-crema/50 focus:border-naranja/50 transition-colors text-stone-500"
              >
                <option value="">Rubro</option>
                {RUBROS.map((rubro) => (
                  <option key={rubro}>{rubro}</option>
                ))}
              </select>

              <input
                required
                placeholder="Barrio / Localidad"
                value={formData.zona}
                onChange={(event) => setFormData({ ...formData, zona: event.target.value })}
                className="border-2 border-stone-100 rounded-xl px-4 py-3 text-sm outline-none bg-crema/50 focus:border-naranja/50 transition-colors"
              />

              <input
                placeholder="WhatsApp"
                value={formData.whatsapp}
                onChange={(event) => setFormData({ ...formData, whatsapp: event.target.value })}
                className="border-2 border-stone-100 rounded-xl px-4 py-3 text-sm outline-none bg-crema/50 focus:border-naranja/50 transition-colors"
              />

              <input
                placeholder="Instagram"
                value={formData.instagram}
                onChange={(event) => setFormData({ ...formData, instagram: event.target.value })}
                className="border-2 border-stone-100 rounded-xl px-4 py-3 text-sm outline-none bg-crema/50 focus:border-naranja/50 transition-colors"
              />

              <input
                placeholder="URL de imagen / foto del negocio"
                value={formData.imagen}
                onChange={(event) => setFormData({ ...formData, imagen: event.target.value })}
                className="border-2 border-stone-100 rounded-xl px-4 py-3 text-sm outline-none bg-crema/50 focus:border-naranja/50 transition-colors"
              />

              <textarea
                required
                placeholder="¿Qué ofrece tu negocio?"
                value={formData.desc}
                onChange={(event) => setFormData({ ...formData, desc: event.target.value })}
                rows={3}
                className="border-2 border-stone-100 rounded-xl px-4 py-3 text-sm outline-none bg-crema/50 focus:border-naranja/50 transition-colors resize-none"
              />

              <input
                placeholder="Tags separados por coma: comida, barato, familia, café"
                value={formData.tags}
                onChange={(event) => setFormData({ ...formData, tags: event.target.value })}
                className="border-2 border-stone-100 rounded-xl px-4 py-3 text-sm outline-none bg-crema/50 focus:border-naranja/50 transition-colors"
              />

              <div className="bg-naranja/5 border border-naranja/10 rounded-xl px-4 py-3">
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  La AIA usa rubro, zona y tags para recomendar mejor. Ejemplo:
                  <b> comida, barato, amigos, familia, lluvia</b>.
                </p>
              </div>

              <button
                type="submit"
                className="bg-naranja text-white rounded-xl py-3 font-bold text-[14px] active:bg-naranja-hover transition-colors mt-1"
              >
                Enviar solicitud
              </button>

              <button
                type="button"
                onClick={() => setForm(false)}
                className="text-sm text-stone-400 py-2"
              >
                Cancelar
              </button>
            </form>
          )}
        </div>
      )}

      {/* LIST */}
      <div className="flex flex-col gap-3">
        {items.map((emp) => (
          <EntrepreneurCard key={emp.id} item={emp} featured={emp.destacado} />
        ))}
      </div>
    </div>
  );
}
