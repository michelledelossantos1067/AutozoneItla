export const fromJson = data => ({
  id: data?.id ?? null,
  nombre: data?.nombre ?? '',
  apellido: data?.apellido ?? '',
  correo: data?.correo ?? '',
  fotoUrl: data?.fotoUrl ?? data?.foto_url ?? null,
  rol: data?.rol ?? '',
  grupo: data?.grupo ?? '',
  token: data?.token ?? null,
  refreshToken: data?.refreshToken ?? data?.refresh_token ?? null,
});

export const nombreCompleto = u => `${u.nombre} ${u.apellido}`.trim();
