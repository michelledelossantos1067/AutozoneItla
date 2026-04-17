import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Modal, Image } from 'react-native';
import { COLORS, FONTS } from '../../core/theme';
export default function DetallesNoticias({ route }) {

  const { id } = route.params;
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(false);

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
    obtenerDetalle();
  }, []);

  if (!noticia) return <Text>Cargando...</Text>;

  return (
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


        <Image source={{ uri: noticia.imagenUrl }} style={{ width: '100%', height: 200, alignSelf: 'center', marginTop: 10 }} resizeMode='contain'></Image>

        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{noticia.titulo}</Text>

        <Text><Text style={{ fontWeight: 'bold' }}>Fecha: </Text>{noticia.fecha}</Text>
        <Text><Text style={{ fontWeight: 'bold' }}>Fuente: </Text>{noticia.fuente}</Text>

        <Text>{noticia.resumen}</Text>

        <Text><Text style={{ fontWeight: 'bold' }}>Link: </Text>{noticia.link}</Text>

      </View>
    </View >
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary },
  sub: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, marginTop: 8 },
  TouchableOpacity: { backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginBottom: 10, width: '50%', borderRadius: 15, height: 40 }
});
