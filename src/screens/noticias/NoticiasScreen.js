import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import { COLORS, FONTS } from '../../core/theme';
import { useAuth } from '../../store/AuthContext';

export default function Noticias({ navigation }) {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAuth();
  const obtenerNoticas = async () => {
    if (loading) return;

    try {

      setLoading(true);

      const response = await apiClient.get('/publico/noticias');

      console.log(response.data);

      setLista(response.data.data);

    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }


  }

  useEffect(() => {
    obtenerNoticas();
  }, []);

  return (
    <View style={s.screen}>

      <View style={{
        width: 360,
        height: '95%',
        backgroundColor: 'white',
        borderWidth: 1.5,
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center'
      }}>

        <FlatList style={{
          maxHeight: 'auto',
          alignContent: 'center',
          padding: 20
        }}
          data={lista}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (

            <TouchableOpacity onPress={() => navigation.navigate('DetalleNoticia', { id: item.id })}
              style={{
                borderWidth: 2,
                marginBottom: 25,
                gap: 10,
                padding: 15
              }}>
              <Image source={{ uri: item.imagenUrl }} style={{ width: '100%', height: 150, alignSelf: 'center', marginTop: 10 }} resizeMode='contain'></Image>

              <Text style={{ fontWeight: 'bold' }}>{item.titulo}</Text>
              <Text>{item.resumen}</Text>
              <Text><Text style={{ fontWeight: 'bold' }}>Fecha: </Text>{item.fecha}</Text>

            </TouchableOpacity>

          )}
        />

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
