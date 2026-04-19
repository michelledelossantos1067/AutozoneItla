import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../store/AuthContext';
import { COLORS, FONTS, SPACING } from '../../core/theme';

export default function CrearTemaScreen({ navigation }) {
  const { usuario, isLoggedIn } = useAuth();
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
    if (!isLoggedIn) {
      Alert.alert('Error', 'Debes iniciar sesión para crear un tema');
      navigation.navigate('Auth', { screen: 'Login' });
      return;
    }

    if (!titulo.trim() || !descripcion.trim() || !vehiculoId) {
      Alert.alert('Error', 'Título, descripción y vehículo son requeridos');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('datax', JSON.stringify({
        vehiculo_id: parseInt(vehiculoId),
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
      }));
      
      console.log('Enviando tema:', params.toString());
      
      await apiClient.post('/foro/crear', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      Alert.alert('Éxito', 'Tema creado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      console.error('Error creando tema:', err.response?.data || err.message);
      Alert.alert('Error', err.response?.data?.message || 'No se pudo crear el tema');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <View style={s.center}>
        <Text style={s.empty}>Debes iniciar sesión para crear un tema.</Text>
        <TouchableOpacity
          style={s.loginButton}
          onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
        >
          <Text style={s.loginButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

      <Text style={s.label}>Vehículo *</Text>
      <View style={s.pickerContainer}>
        <Picker
          selectedValue={vehiculoId}
          onValueChange={setVehiculoId}
          style={s.picker}
        >
          <Picker.Item label="Selecciona un vehículo..." value="" />
          {vehiculos.map((v) => (
            <Picker.Item
              key={v.id}
              label={`${v.marca} ${v.modelo} (${v.placa})`}
              value={v.id.toString()}
            />
          ))}
        </Picker>
      </View>

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
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
  },
  picker: {
    color: COLORS.textPrimary,
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  empty: { fontSize: FONTS.sizes.md, color: COLORS.textMuted, marginBottom: SPACING.lg, textAlign: 'center' },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  loginButtonText: { color: COLORS.surface, fontSize: FONTS.sizes.sm, fontWeight: '600' },
});
