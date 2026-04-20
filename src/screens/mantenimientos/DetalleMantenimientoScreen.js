import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';
import { COLORS, FONTS } from '../../core/theme';

export default function DetalleMantenimientoScreen({ route }) {
  const { id } = route.params;
  const [mantenimiento, setMantenimiento] = useState(null);
  const [loading, setLoading] = useState(false);

  const obtenerDetalle = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const response = await apiClient.get(`/mantenimientos/detalle?id=${id}`);
      setMantenimiento(response.data.data);

    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerDetalle();
  }, []);

  if (!mantenimiento) {
    return (
      <View style={s.center}>
        <Text style={s.loading}>Cargando detalle...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={s.container}>
      <View style={s.card}>

        {/* GALERÍA */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.gallery}
        >
          {mantenimiento.fotos && mantenimiento.fotos.length > 0 ? (
            mantenimiento.fotos.map((foto, index) => (
              <Image
                key={index}
                source={{ uri: foto }}
                style={s.image}
                resizeMode="cover"
              />
            ))
          ) : (
            <View style={s.noImage}>
              <Text style={s.noImageText}>Sin imágenes</Text>
            </View>
          )}
        </ScrollView>

        {/* INFO */}
        <Text style={s.title}>{mantenimiento.tipo}</Text>

        <View style={s.infoBlock}>
          <Text style={s.label}>Costo</Text>
          <Text style={s.value}>RD$ {mantenimiento.costo}</Text>
        </View>

        <View style={s.infoBlock}>
          <Text style={s.label}>Piezas</Text>
          <Text style={s.value}>{mantenimiento.piezas || 'N/A'}</Text>
        </View>

        <View style={s.infoBlock}>
          <Text style={s.label}>Fecha</Text>
          <Text style={s.value}>{mantenimiento.fecha}</Text>
        </View>

      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loading: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.md,
  },

  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,

    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  gallery: {
    marginBottom: 15,
  },

  image: {
    width: 260,
    height: 180,
    borderRadius: 15,
    marginRight: 10,
  },

  noImage: {
    width: 260,
    height: 180,
    borderRadius: 15,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  noImageText: {
    color: COLORS.textMuted,
  },

  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 15,
  },

  infoBlock: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.background,
  },

  label: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginBottom: 3,
  },

  value: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});