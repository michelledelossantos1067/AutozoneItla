export const fromJson = data => ({
  id: data?.id ?? null,
  marca: String(data?.marca ?? ''),
  modelo: String(data?.modelo ?? ''),
  anio: data?.anio ?? null,
  precio: parseFloat(data?.precio ?? 0),
  descripcion: String(data?.descripcion ?? ''),
  imagenes: Array.isArray(data?.imagenes) ? data.imagenes : [],
  especificaciones: data?.especificaciones ?? {},
});
