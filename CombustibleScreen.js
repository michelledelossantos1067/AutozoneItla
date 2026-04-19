import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import api from '../../services/api';

export default function CombustibleScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [tipo, setTipo] = useState('combustible');

  useEffect(() => {
    loadData();
  }, [tipo]);

  const loadData = async () => {
    const res = await api.get(`/combustible?vehiculo_id=1&tipo=${tipo}`);
    setData(res.data);
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <TouchableOpacity onPress={() => setTipo('combustible')}>
          <Text>Combustible</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setTipo('aceite')}>
          <Text style={{ marginLeft: 20 }}>Aceite</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 15, backgroundColor: '#eee', marginBottom: 10 }}>
            <Text>{item.tipo}</Text>
            <Text>{item.cantidad} {item.unidad}</Text>
            <Text>RD$ {item.monto}</Text>
          </View>
        )}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('FormCombustible')}
        style={{
          backgroundColor: 'green',
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
