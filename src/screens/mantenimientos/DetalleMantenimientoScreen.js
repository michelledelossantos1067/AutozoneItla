import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient'
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { COLORS, FONTS } from '../../core/theme';

export default function DetalleMantenimientoScreen({ route }) {
  const { id } = route.params;
  const [mantenimiento, setMantenimiento] = useState(null);
  const [loading, setLoading] = useState(false);

  const [mantenimiento_id, setMantenimiento_Id] = useState('')

  const obtenerDetalle = async () => {
    if (loading) return;

    try {

      setLoading(true);

      const response = await apiClient.get(`/mantenimientos/detalle?id=${id}`);

      console.log(response.data);

      setMantenimiento(response.data.data);

    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }

  const guardarFoto = async () => {
    if (loading) return;

    try {

      setLoading(true);

      const data = {
        mantenimiento_id: Number(mantenimiento_id),
      };

      const response = await apiClient.post('/mantenimientos/fotos',
        new URLSearchParams({
          datax: JSON.stringify(data)
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      console.log(response.data);

      setLista(response.data.data);

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


        <Image source={{ uri: mantenimiento.fotos }} style={{ width: '100%', height: 200, alignSelf: 'center', marginTop: 10 }} resizeMode='contain'></Image>

        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{mantenimiento.tipo}</Text>

        <Text><Text style={{ fontWeight: 'bold' }}>Fecha: </Text>{mantenimiento.costo}</Text>
        <Text><Text style={{ fontWeight: 'bold' }}>Fuente: </Text>{mantenimiento.piezas}</Text>

        <Text>{mantenimiento.fecha}</Text>

        <Text><Text style={{ fontWeight: 'bold' }}>Link: </Text>{mantenimiento.fotos}</Text>

      </View>
    </View >
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary },
  sub: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, marginTop: 8 },
});
