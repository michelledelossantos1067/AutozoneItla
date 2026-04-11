export const fromJson = data => ({
  id: data?.id ?? null,
  youtubeId: data?.youtubeId ?? data?.youtube_id ?? '',
  titulo: data?.titulo ?? '',
  descripcion: data?.descripcion ?? '',
  categoria: data?.categoria ?? '',
  thumbnail: data?.thumbnail
    ?? (data?.youtubeId
      ? `https://img.youtube.com/vi/${data.youtubeId}/hqdefault.jpg`
      : null),
});
