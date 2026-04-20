import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import apiClient from '../../services/apiClient';
import { COLORS, FONTS } from '../../core/theme';
import { useFocusEffect } from '@react-navigation/native';


export default function DetalleVehiculoScreen({ route, navigation }) {
  const { id } = route.params || {};
  const [vehiculo, setVehiculo] = useState(null);

  if (!id) {
    console.error("No se recibio el parametro 'id' en DetalleVehiculoScreen");
    console.error(" No se recibio el parámetro 'id' en DetalleVehiculoScreen");
    return <Text style={s.error}>Error: No se recibió el ID del vehículo</Text>;
  }

  const fetchDetalle = async () => {
    try {
      const { data } = await apiClient.get('/vehiculos/detalle', { params: { id } });
      setVehiculo(data.data);
      setVehiculo(data.data);
    } catch (err) {
      console.error('Error cargando detalle del vehiculo:', err.response?.data || err.message);
    }
  };

  useEffect(() => { fetchDetalle(); }, []);

  useEffect(() => {
    fetchDetalle();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDetalle();
    }, [])
  );

  if (!vehiculo) {
    return <Text style={s.loading}>Cargando detalle...</Text>;
  }

  const resumen = vehiculo.resumen || {};

  return (
    <ScrollView style={s.screen}>
      {vehiculo.fotoUrl && <Image source={{ uri: vehiculo.fotoUrl }} style={s.image} />}
      <Text style={s.title}>{vehiculo.marca} {vehiculo.modelo} ({vehiculo.anio})</Text>
      <Text style={s.sub}>Placa: {vehiculo.placa}</Text>
      <Text style={s.sub}>Chasis: {vehiculo.chasis}</Text>
      <Text style={s.sub}>Ruedas: {vehiculo.cantidadRuedas}</Text>

      <View style={s.section}>
        <Text style={s.sectionTitle}>Resumen Financiero</Text>
        <Text style={[s.card, { color: COLORS.danger }]}>Mantenimientos: RD$ {resumen.totalMantenimientos}</Text>
        <Text style={[s.card, { color: COLORS.warning }]}>Combustible: RD$ {resumen.totalCombustible}</Text>
        <Text style={[s.card, { color: COLORS.danger }]}>Gastos: RD$ {resumen.totalGastos}</Text>
        <Text style={[s.card, { color: COLORS.success }]}>Ingresos: RD$ {resumen.totalIngresos}</Text>
        <Text style={[s.card, { color: COLORS.info }]}>Invertido: RD$ {resumen.totalInvertido}</Text>
        <Text style={[s.card, { color: resumen.balance >= 0 ? COLORS.success : COLORS.danger }]}>
          Balance: RD$ {resumen.balance}
        </Text>
      </View>


      <View style={s.quickAccess}>
        <TouchableOpacity
          style={s.btn}
          onPress={() => {
            console.log("➡ Navegando a Mantenimientos con vehiculo_id:", vehiculo.id);
            navigation.navigate('Mantenimientos', { vehiculo_id: vehiculo.id });
          }}
        >
          <Text style={s.btnText}>Mantenimientos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.btn}
          onPress={() => {
            console.log("➡ Navegando a Combustible con vehiculo_id:", vehiculo.id);
            navigation.navigate('Combustible', { vehiculo_id: vehiculo.id });
          }}
        >
          <Text style={s.btnText}>Combustible</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.btn}
          onPress={() => {
            console.log("➡ Navegando a Gomas con vehiculo_id:", vehiculo.id);
            navigation.navigate('Gomas', { vehiculo_id: vehiculo.id });
          }}
        >
          <Text style={s.btnText}>Gomas</Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={s.btn}
          onPress={() => {
            console.log("➡ Navegando a Gastos/", vehiculo.id);
            navigation.navigate('Gastos', { vehiculo_id: vehiculo.id });
          }}
        >
          <Text style={s.btnText}>Gastos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.btn}
          onPress={() => {
            console.log("➡ Navegando a ingresos/", vehiculo.id);
            navigation.navigate('Ingresos', { vehiculo_id: vehiculo.id });
          }}
        >
          <Text style={s.btnText}>Ingresos</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={s.editBtn}
        onPress={() => {
          console.log("➡ Navegando a FormVehiculo con vehiculo:", vehiculo);
          navigation.navigate('FormVehiculo', { vehiculo });
        }}
      >
        <Text style={s.editText}>Editar Vehículo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 15,
  },

  error: {
    textAlign: 'center',
    marginTop: 30,
    color: COLORS.danger,
    fontSize: 16,
    fontWeight: '600'
  },

  loading: {
    textAlign: 'center',
    marginTop: 30,
    color: COLORS.textMuted,
    fontSize: 15
  },

  image: {
    width: '100%',
    height: 220,
    borderRadius: 15,
    marginBottom: 15,
    backgroundColor: '#EEE'
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 5
  },

  sub: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginBottom: 4
  },

  section: {
    marginTop: 25,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    elevation: 5
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: COLORS.primary
  },

  card: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500'
  },

  quickAccess: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20
  },

  btn: {
    width: '48%',
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 3
  },

  btnText: {
    color: COLORS.textLight,
    fontWeight: '600',
    fontSize: 13
  },

  editBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 25,
    alignItems: 'center',
    elevation: 4
  },

  editText: {
    color: COLORS.textLight,
    fontWeight: '700',
    fontSize: 16
  }
});
