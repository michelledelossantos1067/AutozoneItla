export const fromJson = data => {
  const respuestas = Array.isArray(data?.respuestas) ? data.respuestas.map(respuestaFromJson) : [];
  const respuestasCount = typeof data?.respuestas === 'number'
    ? data.respuestas
    : Number(
      data?.totalRespuestas ??
      data?.total_respuestas ??
      data?.cantidadRespuestas ??
      data?.cantidad_respuestas ??
      0
    );

  return {
    id: data?.id ?? null,
    titulo: String(data?.titulo ?? ''),
    descripcion: String(data?.descripcion ?? ''),
    autor: String(data?.autor ?? ''),
    vehiculoId: data?.vehiculoId ?? data?.vehiculo_id ?? null,
    vehiculoFoto: String(data?.vehiculoFoto ?? data?.vehiculo_foto ?? ''),
    vehiculoNombre: String(data?.vehiculoNombre ?? data?.vehiculo_nombre ?? ''),
    cantidadRespuestas: respuestas.length > 0 ? respuestas.length : respuestasCount,
    fecha: data?.fecha ?? null,
    respuestas: respuestas,
  };
};

export const respuestaFromJson = data => ({
  id: data?.id ?? null,
  temaId: data?.temaId ?? data?.tema_id ?? null,
  contenido: String(data?.contenido ?? ''),
  autor: String(data?.autor ?? ''),
  fecha: data?.fecha ?? null,
});
