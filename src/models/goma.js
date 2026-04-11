export const fromJson = data => ({
  id: data?.id ?? null,
  vehiculoId: data?.vehiculoId ?? data?.vehiculo_id ?? null,
  posicion: data?.posicion ?? '',
  estado: data?.estado ?? 'buena',
  pinchazos: Array.isArray(data?.pinchazos) ? data.pinchazos : [],
});

export const ESTADOS = [
  { label: 'Buena', value: 'buena', color: '#27AE60' },
  { label: 'Regular', value: 'regular', color: '#F39C12' },
  { label: 'Mala', value: 'mala', color: '#E74C3C' },
  { label: 'Reemplazada', value: 'reemplazada', color: '#95A5A6' },
];

export const colorPorEstado = estado =>
  ESTADOS.find(e => e.value === estado)?.color ?? '#95A5A6';
