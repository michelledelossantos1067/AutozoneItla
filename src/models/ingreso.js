export const fromJson = data => ({
  id: data?.id ?? null,
  vehiculoId: data?.vehiculoId ?? data?.vehiculo_id ?? null,
  descripcion: String(data?.descripcion ?? ''),
  monto: parseFloat(data?.monto ?? 0),
  fecha: data?.fecha ?? null,
});
