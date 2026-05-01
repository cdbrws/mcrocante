export function getSolicitudes() {
  try { return JSON.parse(localStorage.getItem('mcrocante_solicitudes') || '[]'); } catch { return []; }
}

export function saveSolicitudes(solicitudes) {
  localStorage.setItem('mcrocante_solicitudes', JSON.stringify(solicitudes));
}

export function updateSolicitud(id, updates) {
  const solicitudes = getSolicitudes();
  const idx = solicitudes.findIndex(s => s.id === id);
  if (idx !== -1) {
    solicitudes[idx] = { ...solicitudes[idx], ...updates };
    saveSolicitudes(solicitudes);
  }
  return solicitudes;
}

export function deleteSolicitud(id) {
  const solicitudes = getSolicitudes().filter(s => s.id !== id);
  saveSolicitudes(solicitudes);
  return solicitudes;
}

export function getSolicitudesCount() {
  const s = getSolicitudes();
  return {
    total: s.length,
    pendientes: s.filter(x => x.estado === 'pendiente').length,
    aprobados: s.filter(x => x.estado === 'aprobado').length,
    rechazados: s.filter(x => x.estado === 'rechazado').length
  };
}
