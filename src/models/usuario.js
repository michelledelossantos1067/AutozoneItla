export const fromJson = data => ({
  id: data?.id ?? null,
  nombre: String(data?.nombre ?? ''),
  apellido: String(data?.apellido ?? ''),
  correo: String(data?.correo ?? ''),
  fotoUrl: data?.fotoUrl ?? data?.foto_url ?? null,
  rol: String(data?.rol ?? ''),
  grupo: String(data?.grupo ?? ''),
  token: data?.token ?? null,
  refreshToken: data?.refreshToken ?? data?.refresh_token ?? null,
});

export const nombreCompleto = u => `${u.nombre} ${u.apellido}`.trim();
