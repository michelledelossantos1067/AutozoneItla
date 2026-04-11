export const fromJson = data => ({
  id: data?.id ?? null,
  titulo: data?.titulo ?? '',
  resumen: data?.resumen ?? '',
  imagen: data?.imagen ?? null,
  fecha: data?.fecha ?? null,
  contenidoHtml: data?.contenidoHtml ?? data?.contenido_html ?? data?.contenido ?? '',
});
