import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import apiClient from '../../services/apiClient';
import { fromJson } from '../../models/foroTema';
import { COLORS, FONTS, SPACING } from '../../core/theme';
import { formatDate } from '../../utils/format';
import { useFocusEffect } from '@react-navigation/native';

export default function MisTemasScreen({ navigation }) {
  const { isLoggedIn } = useAuth();
  const [temas, setTemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMisTemas = async (pageNum = 1) => {
    try {
      const { data } = await apiClient.get('/foro/mis-temas', {
        params: { page: pageNum, limit: 20 }
      });

      const newTemas = (data.data || []).map(fromJson);

      setTemas(prev =>
        pageNum === 1 ? newTemas : [...prev, ...newTemas]
      );

      setPage(pageNum);
      setHasMore(newTemas.length === 20);

    } catch (err) {
      console.error('Error cargando mis temas:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) {
        setLoading(true);
        fetchMisTemas(1);
      } else {
        setLoading(false);
      }
    }, [isLoggedIn])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={s.card}
      onPress={() => navigation.navigate('DetalleForo', { id: item.id })}
    >
      <View style={s.header}>
        <Text style={s.title}>{item.titulo}</Text>
        <Text style={s.date}>{formatDate(item.fecha)}</Text>
      </View>

      <Text style={s.description} numberOfLines={2}>
        {item.descripcion}
      </Text>

      <View style={s.footer}>
        {item.vehiculoNombre && (
          <Text style={s.vehicle}>{item.vehiculoNombre}</Text>
        )}

        <Text style={s.responses}>
          {item.cantidadRespuestas} resp.
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (!isLoggedIn) {
    return (
      <View style={s.center}>
        <Text style={s.empty}>Debes iniciar sesión para ver tus temas.</Text>
        <TouchableOpacity
          style={s.loginButton}
          onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
        >
          <Text style={s.loginButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>
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
        onEndReached={() => hasMore && fetchMisTemas(page + 1)}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={s.center}>
            <Text style={s.empty}>No has creado temas aún</Text>
            <TouchableOpacity
              style={s.createButton}
              onPress={() => navigation.navigate('CrearTema')}
            >
              <Text style={s.createButtonText}>Crear primer tema</Text>
            </TouchableOpacity>
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
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.sm,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },

  card: {
    backgroundColor: COLORS.surface,
    marginVertical: 8,
    padding: SPACING.md,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  title: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },

  date: {
    fontSize: 11,
    color: COLORS.textMuted,
  },

  description: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  vehicle: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  responses: {
    backgroundColor: COLORS.primary,
    color: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
  },

  empty: {
    color: COLORS.textMuted,
    marginBottom: 15,
  },

  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 10,
    borderRadius: 12,
  },

  createButtonText: {
    color: COLORS.surface,
    fontWeight: '600',
  },

  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },

  fabText: {
    fontSize: 28,
    color: COLORS.surface,
    fontWeight: 'bold',
  },

  loginButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 10,
    borderRadius: 12,
  },

  loginButtonText: {
    color: COLORS.surface,
    fontWeight: '600',
  },
});