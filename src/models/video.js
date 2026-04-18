export const fromJson = data => ({
  id: data?.id ?? null,
  youtubeId: String(data?.youtubeId ?? data?.youtube_id ?? ''),
  titulo: String(data?.titulo ?? ''),
  descripcion: String(data?.descripcion ?? ''),
  categoria: String(data?.categoria ?? ''),
  thumbnail: data?.thumbnail
    ?? (data?.youtubeId
      ? `https://img.youtube.com/vi/${data.youtubeId}/hqdefault.jpg`
      : null),
});
