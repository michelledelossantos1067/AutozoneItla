import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../store/AuthContext';
import { COLORS, FONTS, SPACING } from '../../core/theme';

export default function CrearTemaScreen({ navigation }) {
  const { usuario } = useAuth();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [vehiculoId, setVehiculoId] = useState('');
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVehiculos = async () => {
    try {
      const { data } = await apiClient.get('/vehiculos', { params: { limit: 100 } });
      setVehiculos(data.data || []);
    } catch (err) {
      console.error('Error cargando vehículos:', err.response?.data || err.message);
    }
  };

  useEffect(() => { fetchVehiculos(); }, []);

  const handleCreate = async () => {
    if (!titulo.trim() || !descripcion.trim()) {
      Alert.alert('Error', 'Título y descripción son requeridos');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('datax', JSON.stringify({
        vehiculo_id: vehiculoId ? parseInt(vehiculoId) : null,
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
      }));
      await apiClient.post('/foro/crear', formData);
      Alert.alert('Éxito', 'Tema creado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      console.error('Error creando tema:', err.response?.data || err.message);
      Alert.alert('Error', 'No se pudo crear el tema');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.container}>
      <Text style={s.label}>Título del tema *</Text>
      <TextInput
        style={s.input}
        placeholder="Escribe el título..."
        value={titulo}
        onChangeText={setTitulo}
        maxLength={200}
      />

      <Text style={s.label}>Descripción *</Text>
      <TextInput
        style={[s.input, s.textArea]}
        placeholder="Describe tu tema..."
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        maxLength={2000}
      />

      <Text style={s.label}>ID del vehículo (opcional)</Text>
      <TextInput
        style={s.input}
        placeholder="Ingresa el ID del vehículo..."
        value={vehiculoId}
        onChangeText={setVehiculoId}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[s.button, loading && s.buttonDisabled]}
        onPress={handleCreate}
        disabled={loading}
      >
        <Text style={s.buttonText}>
          {loading ? 'Creando...' : 'Crear Tema'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.md },
  label: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.sm,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.surface,
  },
  textArea: { minHeight: 120 },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  buttonDisabled: { backgroundColor: COLORS.textMuted },
  buttonText: { color: COLORS.surface, fontSize: FONTS.sizes.md, fontWeight: '600' },
});
