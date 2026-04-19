export const fromJson = data => ({
  id: data?.id ?? null,
  titulo: String(data?.titulo ?? ''),
  resumen: String(data?.resumen ?? ''),
  imagen: data?.imagen ?? null,
  fecha: data?.fecha ?? null,
  contenidoHtml: String(data?.contenidoHtml ?? data?.contenido_html ?? data?.contenido ?? ''),
});
