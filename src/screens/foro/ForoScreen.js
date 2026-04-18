import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../store/AuthContext';
import { fromJson } from '../../models/foroTema';
import { COLORS, FONTS, SPACING } from '../../core/theme';
import { formatDate } from '../../utils/format';

export default function ForoScreen({ navigation }) {
  const { isLoggedIn } = useAuth();
  const [temas, setTemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchTemas = async (pageNum = 1) => {
    try {
      const { data } = await apiClient.get('/foro/temas', {
        params: { page: pageNum, limit: 20 }
      });

      const newTemas = (data.data || []).map(fromJson);
      setTemas(pageNum === 1 ? newTemas : [...temas, ...newTemas]);
      setPage(pageNum);
      setHasMore(newTemas.length === 20);
    } catch (err) {
      console.error('Error cargando temas:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchTemas();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={s.card}
      onPress={() => navigation.navigate('DetalleForo', { id: item.id })}
    >
      <View style={s.header}>
        <Text style={s.title}>{item.titulo}</Text>
        <Text style={s.date}>{formatDate(item.fecha)}</Text>
      </View>
      <Text style={s.description} numberOfLines={2}>{item.descripcion}</Text>
      <View style={s.footer}>
        <Text style={s.author}>Por: {item.autor}</Text>
        {item.vehiculoNombre && (
          <Text style={s.vehicle}>Vehículo: {item.vehiculoNombre}</Text>
        )}
        <Text style={s.responses}>{item.cantidadRespuestas} respuesta{item.cantidadRespuestas !== 1 ? 's' : ''}</Text>
      </View>
    </TouchableOpacity>
  );

  if (!isLoggedIn) {
    return (
      <View style={s.screen}>
        <View style={s.guestPanel}>
          <Text style={s.guestTitle}>Debe iniciar sesión</Text>
          <Text style={s.guestText}>
            Para ver y participar en el foro, necesitas iniciar sesión.
          </Text>
          <TouchableOpacity
            style={s.loginButton}
            onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
          >
            <Text style={s.loginButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading && temas.length === 0) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={s.screen}>
      <FlatList
        data={temas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={() => hasMore && fetchTemas(page + 1)}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={s.center}>
            <Text style={s.empty}>No hay temas disponibles</Text>
          </View>
        }
      />
      <TouchableOpacity
        style={s.fab}
        onPress={() => navigation.navigate('CrearTema')}
      >
        <Text style={s.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: COLORS.surface,
    margin: SPACING.sm,
    padding: SPACING.md,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.xs },
  title: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.textPrimary, flex: 1 },
  date: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },
  description: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  author: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, flex: 1 },
  vehicle: { fontSize: FONTS.sizes.sm, color: COLORS.primary, flex: 1, textAlign: 'center' },
  responses: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, flex: 1, textAlign: 'right' },
  empty: { fontSize: FONTS.sizes.md, color: COLORS.textMuted },
  fab: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: { fontSize: FONTS.sizes.lg, color: COLORS.surface, fontWeight: 'bold' },
  guestPanel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  guestTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  guestText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 10,
  },
  loginButtonText: {
    color: COLORS.surface,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
});
