export const fromJson = data => ({
  id: data?.id ?? null,
  marca: data?.marca ?? '',
  modelo: data?.modelo ?? '',
  anio: data?.anio ?? null,
  precio: parseFloat(data?.precio ?? 0),
  descripcion: data?.descripcion ?? '',
  imagenes: Array.isArray(data?.imagenes) ? data.imagenes : [],
  especificaciones: data?.especificaciones ?? {},
});
