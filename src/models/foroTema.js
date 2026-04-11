export const fromJson = data => ({
  id: data?.id ?? null,
  titulo: data?.titulo ?? '',
  descripcion: data?.descripcion ?? '',
  autor: data?.autor ?? '',
  vehiculoId: data?.vehiculoId ?? data?.vehiculo_id ?? null,
  vehiculoFoto: data?.vehiculoFoto ?? data?.vehiculo_foto ?? null,
  vehiculoNombre: data?.vehiculoNombre ?? data?.vehiculo_nombre ?? '',
  cantidadRespuestas: data?.cantidadRespuestas ?? data?.cantidad_respuestas ?? 0,
  fecha: data?.fecha ?? null,
  respuestas: Array.isArray(data?.respuestas) ? data.respuestas.map(respuestaFromJson) : [],
});

export const respuestaFromJson = data => ({
  id: data?.id ?? null,
  temaId: data?.temaId ?? data?.tema_id ?? null,
  contenido: data?.contenido ?? '',
  autor: data?.autor ?? '',
  fecha: data?.fecha ?? null,
});
