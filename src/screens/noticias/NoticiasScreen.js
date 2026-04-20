import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { COLORS, FONTS } from '../../core/theme';

export default function Noticias({ navigation }) {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);

  const obtenerNoticas = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const response = await apiClient.get('/publico/noticias');
      setLista(response.data.data || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerNoticas();
  }, []);

  return (
    <View style={s.screen}>
      {loading && lista.length === 0 ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          contentContainerStyle={s.list}
          data={lista}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('DetalleNoticia', { id: item.id })}
              style={s.card}
            >
              <Image
                source={{ uri: item.imagenUrl }}
                style={s.image}
                resizeMode="cover"
              />

              <View style={s.cardContent}>
                <Text style={s.title}>{item.titulo}</Text>
                <Text style={s.resumen} numberOfLines={2}>{item.resumen}</Text>
                <Text style={s.fecha}>Fecha: {item.fecha}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={s.empty}>No hay noticias disponibles</Text>
          }
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16
  },

  list: {
    paddingBottom: 20
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 15,
    overflow: 'hidden',

    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },

  image: {
    width: '100%',
    height: 180
  },

  cardContent: {
    padding: 12
  },

  title: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 5
  },

  resumen: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginBottom: 6
  },

  fecha: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted
  },

  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.textMuted
  }
});