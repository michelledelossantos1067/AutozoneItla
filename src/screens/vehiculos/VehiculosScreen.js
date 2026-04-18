import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import apiClient from '../../services/apiClient';
import { COLORS, FONTS } from '../../core/theme';

export default function VehiculosScreen({ navigation }) {
  const [vehiculos, setVehiculos] = useState([]);
  const [page, setPage] = useState(1);

  const fetchVehiculos = async (pageNum = 1) => {
    try {
      const { data } = await apiClient.get('/vehiculos', {  
        params: { page: pageNum, limit: 20 }
      });

      //  listado está en data.data
      setVehiculos(pageNum === 1 ? data.data : [...vehiculos, ...data.data]);
      setPage(pageNum);
    } catch (err) {
      console.error('Error cargando vehículos:', err.response?.data || err.message);
    }
  };

  useEffect(() => { fetchVehiculos(); }, []);

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
        data={vehiculos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={() => fetchVehiculos(page + 1)}
        onEndReachedThreshold={0.5}
      />

      <TouchableOpacity style={s.addBtn} onPress={() => navigation.navigate('FormVehiculo')}>
        <Text style={s.addText}>+ Agregar Vehículo</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, padding: 10 },
  card: { flexDirection: 'row', backgroundColor: COLORS.card, marginBottom: 10, borderRadius: 8, overflow: 'hidden' },
  image: { width: 100, height: 100 },
  info: { flex: 1, padding: 10 },
  title: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary },
  sub: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },
  addBtn: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 6, marginTop: 10 },
  addText: { color: COLORS.textLight, textAlign: 'center', fontWeight: '700' },
});