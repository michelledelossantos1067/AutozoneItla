import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../../services/apiClient';
import { COLORS, FONTS, SPACING } from '../../core/theme';
import { formatDate } from '../../utils/format';
import { fromJson } from '../../models/foroTema';

export default function DetalleForoScreen({ route, navigation }) {
  const { id } = route.params;
  const [tema, setTema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  const fetchTema = async () => {
    try {
      const { data } = await apiClient.get('/foro/detalle', { params: { id } });
      console.log('Tema cargado:', data.data);
      setTema(fromJson(data.data));
    } catch (err) {
      console.error('Error cargando tema:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTema(); }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchTema();
    }, [id])
  );

  const handleReply = async () => {
    if (!replyText.trim()) return;

    setReplying(true);
    try {
      const params = new URLSearchParams();
      params.append('datax', JSON.stringify({ tema_id: id, contenido: replyText.trim() }));
      const response = await apiClient.post('/foro/responder', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      console.log('Respuesta enviada:', response.data);
      setReplyText('');
      // Wait a moment for the backend to process, then refresh
      setTimeout(() => {
        fetchTema();
      }, 1000);
    } catch (err) {
      console.error('Error respondiendo:', err.response?.data || err.message);
      alert('Error al enviar respuesta');
    } finally {
      setReplying(false);
    }
  };

  const renderRespuesta = ({ item }) => (
    <View style={s.respuestaCard}>
      <View style={s.respuestaHeader}>
        <Text style={s.respuestaAuthor}>{item.autor}</Text>
        <Text style={s.respuestaDate}>{formatDate(item.fecha)}</Text>
      </View>
      <Text style={s.respuestaContent}>{item.contenido}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!tema) {
    return (
      <View style={s.center}>
        <Text style={s.error}>Tema no encontrado</Text>
      </View>
    );
  }

  return (
    <View style={s.screen}>
      <FlatList
        data={tema.respuestas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRespuesta}
        ListHeaderComponent={
          <View style={s.temaCard}>
            <View style={s.temaHeader}>
              <Text style={s.temaTitle}>{tema.titulo}</Text>
              <Text style={s.temaDate}>{formatDate(tema.fecha)}</Text>
            </View>
            <Text style={s.temaDescription}>{tema.descripcion}</Text>
            <View style={s.temaFooter}>
              <Text style={s.temaAuthor}>Por: {tema.autor}</Text>
              {tema.vehiculoNombre && (
                <Text style={s.temaVehicle}>Vehículo: {tema.vehiculoNombre}</Text>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={s.center}>
            <Text style={s.empty}>No hay respuestas aún</Text>
          </View>
        }
      />
      <View style={s.replyContainer}>
        <TextInput
          style={s.replyInput}
          placeholder="Escribe tu respuesta..."
          value={replyText}
          onChangeText={setReplyText}
          multiline
          numberOfLines={3}
        />
        <TouchableOpacity
          style={[s.replyButton, (!replyText.trim() || replying) && s.replyButtonDisabled]}
          onPress={handleReply}
          disabled={!replyText.trim() || replying}
        >
          <Text style={s.replyButtonText}>
            {replying ? 'Enviando...' : 'Responder'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  center: { justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  temaCard: {
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
  temaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.xs },
  temaTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary, flex: 1 },
  temaDate: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },
  temaDescription: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  temaFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  temaAuthor: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },
  temaVehicle: { fontSize: FONTS.sizes.sm, color: COLORS.primary },
  respuestaCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.sm,
    marginVertical: SPACING.xs,
    padding: SPACING.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  respuestaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  respuestaAuthor: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textPrimary },
  respuestaDate: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },
  respuestaContent: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  empty: { fontSize: FONTS.sizes.md, color: COLORS.textMuted },
  error: { fontSize: FONTS.sizes.md, color: COLORS.danger },
  replyContainer: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  replyInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.sm,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  replyButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.sm,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  replyButtonDisabled: { backgroundColor: COLORS.textMuted },
  replyButtonText: { color: COLORS.surface, fontSize: FONTS.sizes.sm, fontWeight: '600' },
});
