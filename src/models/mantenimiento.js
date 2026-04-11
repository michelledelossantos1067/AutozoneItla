export const fromJson = data => ({
  id: data?.id ?? null,
  vehiculoId: data?.vehiculoId ?? data?.vehiculo_id ?? null,
  tipo: data?.tipo ?? '',
  costo: parseFloat(data?.costo ?? 0),
  piezas: data?.piezas ?? '',
  fecha: data?.fecha ?? null,
  fotos: Array.isArray(data?.fotos) ? data.fotos : [],
});

export const TIPOS_SUGERIDOS = [
  'Cambio de aceite',
  'Cambio de frenos',
  'Cambio de bateria',
  'Cambio de gomas',
  'Revision general',
  'Cambio de filtros',
  'Alineacion y balanceo',
  'Otro',
];
