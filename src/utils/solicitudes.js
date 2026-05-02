const STORAGE_KEY = 'mcrocante_solicitudes';

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags.map(t => String(t).trim().toLowerCase()).filter(Boolean);
  }

  return String(tags || '')
    .split(',')
    .map(t => t.trim().toLowerCase())
    .filter(Boolean);
}

function normalizeSolicitud(s = {}) {
  return {
    id: s.id || Date.now(),
    nombre: s.nombre || s.nombreEmp || s.nombreEmpresa || 'Emprendimiento',
    rubro: s.rubro || 'Otro',
    zona: s.zona || s.localidad || 'San Luis',
    whatsapp: s.whatsapp || '',
    instagram: s.instagram || '',
    desc: s.desc || s.descripcion || '',
    imagen: s.imagen || s.image || s.foto || '',
    tags: normalizeTags(s.tags),
    estado: s.estado || s.etiqueta || 'pendiente',
    destacado: Boolean(s.destacado),
    sponsor: Boolean(s.sponsor),
    prioridad: s.prioridad || 'normal',
    notasAdmin: s.notasAdmin || '',
    origen: s.origen || 'formulario-publico',
    fecha: s.fecha || new Date().toISOString(),
  };
}

export function getSolicitudes() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(data) ? data.map(normalizeSolicitud) : [];
  } catch {
    return [];
  }
}

export function saveSolicitudes(solicitudes) {
  const normalized = Array.isArray(solicitudes)
    ? solicitudes.map(normalizeSolicitud)
    : [];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
}

export function addSolicitud(solicitud) {
  const solicitudes = getSolicitudes();
  const nueva = normalizeSolicitud({
    ...solicitud,
    id: solicitud.id || Date.now(),
    estado: solicitud.estado || 'pendiente',
    fecha: solicitud.fecha || new Date().toISOString(),
  });

  solicitudes.push(nueva);
  saveSolicitudes(solicitudes);

  return nueva;
}

export function updateSolicitud(id, updates) {
  const solicitudes = getSolicitudes();

  const updated = solicitudes.map(solicitud => {
    if (String(solicitud.id) !== String(id)) return solicitud;

    return normalizeSolicitud({
      ...solicitud,
      ...updates,
      id: solicitud.id,
      fecha: solicitud.fecha,
    });
  });

  saveSolicitudes(updated);
  return updated;
}

export function deleteSolicitud(id) {
  const solicitudes = getSolicitudes().filter(
    solicitud => String(solicitud.id) !== String(id)
  );

  saveSolicitudes(solicitudes);
  return solicitudes;
}

export function approveSolicitud(id) {
  return updateSolicitud(id, { estado: 'aprobado' });
}

export function rejectSolicitud(id) {
  return updateSolicitud(id, { estado: 'rechazado' });
}

export function toggleDestacado(id) {
  const solicitud = getSolicitudes().find(s => String(s.id) === String(id));
  if (!solicitud) return getSolicitudes();

  return updateSolicitud(id, { destacado: !solicitud.destacado });
}

export function toggleSponsor(id) {
  const solicitud = getSolicitudes().find(s => String(s.id) === String(id));
  if (!solicitud) return getSolicitudes();

  return updateSolicitud(id, { sponsor: !solicitud.sponsor });
}

export function getSolicitudesByEstado(estado) {
  return getSolicitudes().filter(solicitud => solicitud.estado === estado);
}

export function getNegociosAprobados() {
  return getSolicitudes().filter(solicitud => solicitud.estado === 'aprobado');
}

export function getSolicitudesCount() {
  const solicitudes = getSolicitudes();

  return {
    total: solicitudes.length,
    pendientes: solicitudes.filter(s => s.estado === 'pendiente').length,
    aprobados: solicitudes.filter(s => s.estado === 'aprobado').length,
    rechazados: solicitudes.filter(s => s.estado === 'rechazado').length,
    destacados: solicitudes.filter(s => s.destacado).length,
    sponsors: solicitudes.filter(s => s.sponsor).length,
  };
}
