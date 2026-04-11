export const fromJson = data => ({
  id: data?.id ?? null,
  vehiculoId: data?.vehiculoId ?? data?.vehiculo_id ?? null,
  categoriaId: data?.categoriaId ?? data?.categoria_id ?? null,
  categoriaNombre: data?.categoriaNombre ?? data?.categoria_nombre ?? data?.categoria ?? '',
  descripcion: data?.descripcion ?? '',
  monto: parseFloat(data?.monto ?? 0),
  fecha: data?.fecha ?? null,
});

export const categoriaFromJson = data => ({
  id: data?.id ?? null,
  nombre: data?.nombre ?? '',
});
