import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient'
import { View, ScrollView, Text, StyleSheet, Image, ActivityIndicator, Linking, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview'
import { COLORS, FONTS } from '../../core/theme';
import { useAuth } from '../../store/AuthContext';

export default function DetallesNoticias({ route }) {

  const { id } = route.params;
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAuth();

  const obtenerDetalle = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const response = await apiClient.get(`/noticias/detalle?id=${id}`);
      setNoticia(response.data.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      obtenerDetalle();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <View style={s.center}>
        <Text style={s.warning}>Regístrate para acceder a esta función</Text>
      </View>
    )
  }

  if (loading || !noticia) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const customHTML = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: sans-serif; font-size: 15px; color: #333; line-height: 1.6; padding: 0; margin: 0;}
          img { max-width: 100%; height: auto; border-radius: 10px; }
        </style>
      </head>
      <body>
        ${noticia.contenido}
      </body>
    </html>
  `;

  return (
    <ScrollView contentContainerStyle={s.container}>

      <View style={s.card}>

        <Image
          source={{ uri: noticia.imagenUrl }}
          style={s.image}
        />

        <View style={s.content}>
          <Text style={s.title}>{noticia.titulo}</Text>

          <Text style={s.meta}>Fecha: {noticia.fecha}</Text>
          <Text style={s.meta}>Fuente: {noticia.fuente}</Text>

          <Text style={s.resumen}>{noticia.resumen}</Text>

          <View style={s.webViewContainer}>
            <WebView
              originWhitelist={['*']}
              source={{ html: customHTML }}
              style={s.webView}
              scrollEnabled={false}
            />
          </View>

          {noticia.link && (
            <TouchableOpacity onPress={() => Linking.openURL(noticia.link)}>
              <Text style={s.link}>Ver noticia completa</Text>
            </TouchableOpacity>
          )}
        </View>

      </View>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.background
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background
  },

  warning: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.md
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',

    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },

  image: {
    width: '100%',
    height: 220
  },

  content: {
    padding: 16
  },

  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 10
  },

  meta: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginBottom: 4
  },

  resumen: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    marginTop: 10,
    marginBottom: 15,
    lineHeight: 20
  },

  webViewContainer: {
    height: 350,
    width: '100%',
    marginBottom: 15
  },

  webView: {
    flex: 1,
    borderRadius: 10
  },

  link: {
    color: COLORS.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10
  }
});