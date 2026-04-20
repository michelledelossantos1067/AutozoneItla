import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import apiClient from '../../services/apiClient';
import { COLORS, FONTS } from '../../core/theme';
import { useFocusEffect } from '@react-navigation/native';

export default function VehiculosScreen({ navigation }) {
  const [vehiculos, setVehiculos] = useState([]);
  const [page, setPage] = useState(1);

  const fetchVehiculos = async (pageNum = 1) => {
    try {
      const { data } = await apiClient.get('/vehiculos', {
        params: { page: pageNum, limit: 20 }
      });

      setVehiculos(prev =>
        pageNum === 1 ? data.data : [...prev, ...data.data]
      );

      setPage(pageNum);
    } catch (err) {
      console.error('Error cargando vehículos:', err.response?.data || err.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchVehiculos(1);
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={s.card}
      onPress={() => navigation.navigate('DetalleVehiculo', { id: item.id })}
    >
      <Image source={{ uri: item.foto_url }} style={s.image} />

      <View style={s.info}>
        <Text style={s.title}>{item.marca} {item.modelo}</Text>

        <Text style={s.sub}>Placa: {item.placa}</Text>
        <Text style={s.sub}>Chasis: {item.chasis}</Text>
        <Text style={s.sub}>Año: {item.anio}</Text>
        <Text style={s.sub}>Ruedas: {item.cantidad_ruedas}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={s.screen}>

      <FlatList
        contentContainerStyle={s.list}
        data={vehiculos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={() => fetchVehiculos(page + 1)}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <Text style={s.empty}>No hay vehículos registrados</Text>
        }
      />

      <TouchableOpacity
        style={s.fab}
        onPress={() => navigation.navigate('FormVehiculo')}
      >
        <Text style={s.fabText}>＋</Text>
      </TouchableOpacity>

    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background
  },

  list: {
    padding: 12,
    paddingBottom: 80
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',

    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },

  image: {
    width: 110,
    height: 110
  },

  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center'
  },

  title: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 5
  },

  sub: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginBottom: 2
  },

  empty: {
    textAlign: 'center',
    marginTop: 30,
    color: COLORS.textMuted
  },

  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',

    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 }
  },

  fabText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700'
  }
});