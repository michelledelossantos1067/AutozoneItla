import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Linking } from 'react-native';
import { COLORS, FONTS } from '../../core/theme';

export default function Videos() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);

  const obtenerVideos = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const response = await apiClient.get('/publico/videos');
      setLista(response.data?.data || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerVideos();
  }, []);

  return (
    <View style={s.screen}>
      <View style={s.container}>
        <FlatList
          style={s.list}
          data={lista}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={<Text style={s.empty}>No hay videos</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => Linking.openURL(item.url)}
              style={s.card}
            >
              <Image
                source={{ uri: item.thumbnail }}
                style={s.image}
                resizeMode="cover"
              />

              <Text style={s.title}>{item.titulo}</Text>
              <Text style={s.description}>{item.descripcion}</Text>
              <Text style={s.category}>Categoría: {item.categoria}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10
  },

  container: {
    width: 350,
    maxHeight: '95%',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    elevation: 6
  },

  list: {
    width: '100%',
    paddingHorizontal: 15
  },

  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 20,
    padding: 12,
    elevation: 4
  },

  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#EEE'
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 5
  },

  description: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 6
  },

  category: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600'
  },

  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.textMuted
  }
});