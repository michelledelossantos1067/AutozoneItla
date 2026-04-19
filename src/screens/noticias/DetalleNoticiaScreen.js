import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient'
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
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

      console.log(response.data);

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
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Text>Registrate para acceder a esta funcion</Text>
      </View>
    )
  }

  if (!noticia) return <Text>Cargando...</Text>;

  const customHTML = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: sans-serif; font-size: 14px; color: #333; line-height: 1.6; }
          img { max-width: 100%; height: auto; }
        </style>
      </head>
      <body>
        ${noticia.contenido}
      </body>
    </html>
  `;

  return (


    <ScrollView contentContainerStyle={s.scrollContainer}>

      <View style={s.screen}>

        <View style={{
          width: 360,
          height: '95%',
          backgroundColor: 'white',
          borderWidth: 1.5,
          marginTop: 20,
          marginBottom: 20,
          padding: 20,
          gap: 15
        }}>


          <Image source={{ uri: noticia.imagenUrl }} style={{ width: '100%', height: 200, alignSelf: 'center', marginTop: 10 }} resizeMode='cover'></Image>

          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{noticia.titulo}</Text>

          <Text><Text style={{ fontWeight: 'bold' }}>Fecha: </Text>{noticia.fecha}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Fuente: </Text>{noticia.fuente}</Text>

          <Text>{noticia.resumen}</Text>

          <View style={s.webViewContainer}>
            <WebView
              originWhitelist={['*']}
              source={{ html: customHTML }}
              style={s.webView}
              scrollEnabled={false} // Se apaga porque el ScrollView de afuera maneja el scroll
            />
          </View>

          <Text><Text style={{ fontWeight: 'bold' }}>Link: </Text>{noticia.link}</Text>

        </View>
      </View >
    </ScrollView>

  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary },
  sub: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, marginTop: 8 },
  TouchableOpacity: {
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: '50%',
    borderRadius: 15,
    height: 40
  },
  webView: { flex: 1 },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 20
  },
  webViewContainer: {
    height: 400, // Ajusta esta altura según el contenido promedio
    width: '100%',
    marginBottom: 20
  },
});
