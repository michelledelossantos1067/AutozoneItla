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
      const endpoint = isLoggedIn ? '/foro/temas' : '/publico/foro';

      const { data } = await apiClient.get(endpoint, {
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
    fetchTemas(1);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTemas(1);
    });
    return unsubscribe;
  }, [navigation]);

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
        <Text style={s.author}>👤 {item.autor}</Text>

        {item.vehiculoNombre && (
          <Text style={s.vehicle}>🚗 {item.vehiculoNombre}</Text>
        )}

        <Text style={s.responses}>
          💬 {item.cantidadRespuestas}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && temas.length === 0) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={s.screen}>
      <View style={s.topBar}>
        <Text style={s.screenTitle}>Foro</Text>

        {isLoggedIn && (
          <TouchableOpacity
            style={s.myTopicsBtn}
            onPress={() => navigation.navigate('MisTemas')}
          >
            <Text style={s.myTopicsText}>Mis temas</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={temas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={() => hasMore && fetchTemas(page + 1)}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={s.center}>
            <Text style={s.empty}>No hay temas disponibles</Text>
          </View>
        }
      />


      {!isLoggedIn && (
        <View style={s.loginPrompt}>
          <Text style={s.loginPromptText}>
            Inicia sesión para crear temas y responder
          </Text>

          <TouchableOpacity
            style={s.loginPromptButton}
            onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
          >
            <Text style={s.loginPromptButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={s.fab}
        onPress={() =>
          isLoggedIn
            ? navigation.navigate('CrearTema')
            : navigation.navigate('Auth', { screen: 'Login' })
        }
      >
        <Text style={s.fabText}>+</Text>
      </TouchableOpacity>

    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background
  },


  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm
  },

  screenTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary
  },

  myTopicsBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 20
  },

  myTopicsText: {
    color: COLORS.surface,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600'
  },


  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  card: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    padding: SPACING.md,
    borderRadius: 12,
    elevation: 4
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },

  title: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 10
  },

  date: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted
  },

  description: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: 10
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  author: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted
  },

  vehicle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary
  },

  responses: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted
  },

  empty: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted
  },

  loginPrompt: {
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    elevation: 3,
    paddingBottom: 35
  },

  loginPromptText: {
    color: COLORS.textSecondary,
    marginBottom: 10,
    textAlign: 'center'
  },

  loginPromptButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 10,
    borderRadius: 8
  },

  loginPromptButtonText: {
    color: COLORS.surface,
    fontWeight: '600'
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
    elevation: 6
  },

  fabText: {
    fontSize: 24,
    color: COLORS.surface,
    fontWeight: 'bold'
  }
});