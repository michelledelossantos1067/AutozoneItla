export const fromJson = data => ({
  id: data?.id ?? null,
  vehiculoId: data?.vehiculoId ?? data?.vehiculo_id ?? null,
  tipo: String(data?.tipo ?? 'combustible'),
  cantidad: parseFloat(data?.cantidad ?? 0),
  unidad: String(data?.unidad ?? 'galones'),
  monto: parseFloat(data?.monto ?? 0),
  fecha: data?.fecha ?? null,
});

export const TIPOS = [
  { label: 'Combustible', value: 'combustible' },
  { label: 'Aceite', value: 'aceite' },
];

export const UNIDADES = [
  { label: 'Galones', value: 'galones' },
  { label: 'Litros', value: 'litros' },
  { label: 'Quarts (qt)', value: 'qt' },
];
