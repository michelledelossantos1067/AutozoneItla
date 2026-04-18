export const fromJson = data => ({
  id: data?.id ?? null,
  titulo: String(data?.titulo ?? ''),
  descripcion: String(data?.descripcion ?? ''),
  autor: String(data?.autor ?? ''),
  vehiculoId: data?.vehiculoId ?? data?.vehiculo_id ?? null,
  vehiculoFoto: String(data?.vehiculoFoto ?? data?.vehiculo_foto ?? ''),
  vehiculoNombre: String(data?.vehiculoNombre ?? data?.vehiculo_nombre ?? ''),
  cantidadRespuestas: Number(data?.cantidadRespuestas ?? data?.cantidad_respuestas ?? 0),
  fecha: data?.fecha ?? null,
  respuestas: Array.isArray(data?.respuestas) ? data.respuestas.map(respuestaFromJson) : [],
});

export const respuestaFromJson = data => ({
  id: data?.id ?? null,
  temaId: data?.temaId ?? data?.tema_id ?? null,
  contenido: String(data?.contenido ?? ''),
  autor: String(data?.autor ?? ''),
  fecha: data?.fecha ?? null,
});
