import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Modal, ActivityIndicator } from 'react-native';
import { COLORS, FONTS } from '../../core/theme';

export default function CombustibleScreen({ route }) {
  const { vehiculo_id } = route.params || {};

  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const [filtroTipo, setFiltroTipo] = useState('');
  const [tipo, setTipo] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState('');
  const [monto, setMonto] = useState('');


  const obtenerCombustibles = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const response = await apiClient.get('/combustibles', {
        params: {
          vehiculo_id,
          tipo: filtroTipo || undefined
        }
      });

      setLista(response.data?.data || []);

    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const guardarCombustible = async () => {
    if (!vehiculo_id || !tipo) {
      alert('El tipo es obligatorio');
      return;
    }

    try {
      setLoading(true);

      const data = {
        vehiculo_id: Number(vehiculo_id),
        tipo: tipo.trim(),
        cantidad: Number(cantidad),
        unidad: unidad.trim(),
        monto: Number(monto),
      };

      const response = await apiClient.post('/combustibles',
        new URLSearchParams({
          datax: JSON.stringify(data)
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      setVisible(false);
      setTipo('');
      setCantidad('');
      setUnidad('');
      setMonto('');

      obtenerCombustibles();

    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerCombustibles();
  }, [filtroTipo]);

  return (
    <View style={s.screen}>

      <Modal transparent visible={visible} animationType="fade">
        <View style={s.centeredView}>
          <View style={s.modalView}>
            <Text style={s.title}>Registrar Combustible</Text>

            <TextInput placeholder="Tipo (Gasolina, Gasoil)" value={tipo} onChangeText={setTipo} style={s.input} />
            <TextInput placeholder="Cantidad" value={cantidad} onChangeText={setCantidad} keyboardType="numeric" style={s.input} />
            <TextInput placeholder="Unidad (Litros)" value={unidad} onChangeText={setUnidad} style={s.input} />
            <TextInput placeholder="Monto" value={monto} onChangeText={setMonto} keyboardType="numeric" style={s.input} />

            <TouchableOpacity style={s.btn} onPress={guardarCombustible}>
              <Text style={s.btnText}>Guardar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      <View style={s.card}>
        <Text style={s.title}>Combustible</Text>

        <TextInput
          placeholder="Filtrar por tipo (Gasolina, Gasoil)"
          value={filtroTipo}
          onChangeText={setFiltroTipo}
          style={s.input}
        />

        <TouchableOpacity style={s.btn} onPress={() => setVisible(true)}>
          <Text style={s.btnText}>+ Agregar Combustible</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[s.btn, { backgroundColor: COLORS.primary }]} onPress={obtenerCombustibles}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={s.btnText}>Buscar</Text>}
        </TouchableOpacity>

        <FlatList
          data={lista}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={s.item}>
              <Text><Text style={s.bold}>Tipo: </Text>{item.tipo}</Text>
              <Text><Text style={s.bold}>Cantidad: </Text>{item.cantidad} {item.unidad}</Text>
              <Text><Text style={s.bold}>Monto: </Text>{item.monto}</Text>
              <Text><Text style={s.bold}>Fecha: </Text>{item.fecha}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary },
  sub: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, marginTop: 8 },
  TouchableOpacity: { backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginBottom: 10, width: '50%', borderRadius: 15, height: 40 },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
