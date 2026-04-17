import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, Linking } from 'react-native';
import { COLORS, FONTS } from '../../core/theme';

export default function Videos() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);

  const obtenerVideos = async () => {
    if (loading) return;

    try {

      setLoading(true);

      const response = await apiClient.get('/publico/videos');

      console.log(response.data);

      setLista(response.data.data);

    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }


  }

  useEffect(() => {
    obtenerVideos();
  }, []);

  return (
    <View style={s.screen}>

      <View style={{
        width: 360,
        height: 'auto',
        backgroundColor: 'white',
        borderWidth: 1.5,
        marginBottom: 35,
        alignItems: 'center'
      }}>

        <FlatList style={{
          maxHeight: 650,
          alignContent: 'center',
          padding: 20,
          flexDirection: 'column'
        }}
          data={lista}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (

            <TouchableOpacity onPress={() => Linking.openURL(item.url)}
              style={{
                borderWidth: 2,
                marginBottom: 25,
                gap: 10,
                padding: 15
              }}>
              <Image source={{ uri: item.thumbnail }} style={{ width: '100%', height: 250, alignSelf: 'center', marginTop: 5 }} resizeMode='contain'></Image>

              <Text style={{ fontWeight: 'bold' }}>{item.titulo}</Text>
              <Text>{item.descripcion}</Text>
              <Text><Text style={{ fontWeight: 'bold' }}>Categoria:</Text>{item.categoria}</Text>

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
