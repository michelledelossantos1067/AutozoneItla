import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import api from '../../services/api';

export default function FormCombustibleScreen({ navigation }) {
  const [cantidad, setCantidad] = useState('');
  const [monto, setMonto] = useState('');

  const guardar = async () => {
    try {
      await api.post('/combustible', {
        vehiculo_id: 1,
        tipo: 'combustible',
        cantidad,
        unidad: 'galones',
        monto
      });

      Alert.alert('Guardado');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Cantidad"
        value={cantidad}
        onChangeText={setCantidad}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Monto"
        value={monto}
        onChangeText={setMonto}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Button title="Guardar" onPress={guardar} />
    </View>
  );
}
