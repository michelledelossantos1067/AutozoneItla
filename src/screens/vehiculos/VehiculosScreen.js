import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { getVehiculos } from '../../api/vehiculos';
import { COLORS, FONTS } from '../../core/theme';

export default function VehiculosScreen({ navigation }) {
  const [vehiculos, setVehiculos] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const timeoutRef = useRef(null);

  const fetchVehiculos = async (marca = '', modelo = '', pageNum = 1) => {
    try {
      const { data } = await getVehiculos({ marca, modelo, page: pageNum, limit: 10 });
      setVehiculos(pageNum === 1 ? data : [...vehiculos, ...data]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchVehiculos(); }, []);

  const handleSearch = (text) => {
    setSearch(text);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fetchVehiculos(text, text, 1);
      setPage(1);
    }, 500);
  };

  return (
    <View style={s.screen}>
      <TextInput placeholder="Buscar por marca/modelo" value={search} onChangeText={handleSearch} style={s.input} />
      <FlatList
        data={vehiculos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.card} onPress={() => navigation.navigate('DetalleVehiculo', { id: item.id })}>
            <FastImage source={{ uri: item.foto }} style={s.image} />
            <Text style={s.cardTitle}>{item.marca} {item.modelo} ({item.ano})</Text>
            <Text style={s.cardSub}>Placa: {item.placa}</Text>
          </TouchableOpacity>
        )}
        onEndReached={() => { const nextPage = page + 1; fetchVehiculos(search, search, nextPage); setPage(nextPage); }}
        ListEmptyComponent={<Text style={s.empty}>🚗 No tienes vehículos registrados</Text>}
      />
      <TouchableOpacity style={s.addBtn} onPress={() => navigation.navigate('FormVehiculo')}>
        <Text style={s.addText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, padding: 10 },
  input: { borderWidth: 1, borderColor: COLORS.border, padding: 10, borderRadius: 6, marginBottom: 10 },
  card: { borderWidth: 1, borderColor: COLORS.border, padding: 10, marginBottom: 10, borderRadius: 6 },
  image: { width: '100%', height: 120, marginBottom: 8, borderRadius: 6 },
  cardTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary },
  cardSub: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },
  empty: { textAlign: 'center', marginTop: 20, color: COLORS.textMuted },
  addBtn: { position: 'absolute', bottom: 20, right: 20, backgroundColor: COLORS.primary, padding: 15, borderRadius: 30 },
  addText: { color: COLORS.textLight, fontSize: 20, fontWeight: '700' },
});
