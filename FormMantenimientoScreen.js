import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import api from '../../services/api';

export default function FormMantenimientoScreen({ navigation }) {
  const [tipo, setTipo] = useState('');
  const [costo, setCosto] = useState('');

  const guardar = async () => {
    try {
      await api.post('/mantenimientos', {
        vehiculo_id: 1,
        tipo,
        costo
      });

      Alert.alert('Guardado correctamente');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Tipo"
        value={tipo}
        onChangeText={setTipo}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Costo"
        value={costo}
        onChangeText={setCosto}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Button title="Guardar" onPress={guardar} />
    </View>
  );
}
