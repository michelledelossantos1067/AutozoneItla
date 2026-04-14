import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import api from '../../services/api';

export default function MantenimientosScreen({ navigation }) {
  const [data, setData] = useState([]);
  const vehiculo_id = 1;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await api.get(`/mantenimientos?vehiculo_id=${vehiculo_id}`);
    setData(res.data);
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('FormMantenimiento')}
            style={{ padding: 15, backgroundColor: '#eee', marginBottom: 10 }}
          >
            <Text>{item.tipo}</Text>
            <Text>RD$ {item.costo}</Text>
            <Text>{item.fecha}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('FormMantenimiento')}
        style={{
          backgroundColor: 'blue',
          padding: 15,
          position: 'absolute',
          bottom: 20,
          right: 20,
          borderRadius: 50
        }}
      >
        <Text style={{ color: '#fff' }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
