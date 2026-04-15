import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { getVehiculoDetalle } from '../../api/vehiculos';
import { COLORS, FONTS } from '../../core/theme';

export default function DetalleVehiculoScreen({ route, navigation }) {
  const { id } = route.params;
  const [vehiculo, setVehiculo] = useState(null);

  useEffect(() => {
    getVehiculoDetalle(id).then(res => setVehiculo(res.data)).catch(err => console.error(err));
  }, [id]);

  if (!vehiculo) return <Text>Cargando...</Text>;

  const balanceColor = vehiculo.balance >= 0 ? COLORS.success : COLORS.error;

  return (
    <ScrollView style={s.screen}>
      <FastImage source={{ uri: vehiculo.foto }} style={s.image} />
      <Text style={s.title}>{vehiculo.marca} {vehiculo.modelo} ({vehiculo.ano})</Text>
      <Text style={s.sub}>Placa: {vehiculo.placa} | Chasis: {vehiculo.chasis}</Text>

      <View style={s.financial}>
        <Text style={[s.card, { color: COLORS.error }]}>Mantenimientos: {vehiculo.totalMantenimientos}</Text>
        <Text style={[s.card, { color: COLORS.warning }]}>Combustible: {vehiculo.totalCombustible}</Text>
        <Text style={[s.card, { color: COLORS.error }]}>Gastos: {vehiculo.totalGastos}</Text>
        <Text style={[s.card, { color: COLORS.success }]}>Ingresos: {vehiculo.totalIngresos}</Text>
        <Text style={[s.card, { color: balanceColor }]}>Balance: {vehiculo.balance}</Text>
      </View>

      <TouchableOpacity style={s.btn} onPress={() => navigation.navigate('FormVehiculo', { vehiculo })}>
        <Text style={s.btnText}>Editar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, padding: 10 },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 10 },
  title: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary },
  sub: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, marginBottom: 10 },
  financial: { marginVertical: 10 },
  card: { fontSize: FONTS.sizes.md, marginBottom: 5 },
  btn: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 6, marginTop: 20, alignItems: 'center' },
  btnText: { color: COLORS.textLight, fontWeight: '600' },
});
