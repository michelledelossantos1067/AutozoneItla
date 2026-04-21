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

      await apiClient.post(
        '/combustibles',
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
            <Text style={s.modalTitle}>Registrar Combustible</Text>

            <TextInput placeholder="Tipo (aceite/combustible)" value={tipo} onChangeText={setTipo} style={s.input} placeholderTextColor={COLORS.textMuted || '#110101'}/>
            <TextInput placeholder="Cantidad" value={cantidad} onChangeText={setCantidad} keyboardType="numeric" style={s.input} placeholderTextColor={COLORS.textMuted || '#110101'}/>
            <TextInput placeholder="Unidad (Litros)" value={unidad} onChangeText={setUnidad} style={s.input} placeholderTextColor={COLORS.textMuted || '#110101'}/>
            <TextInput placeholder="Monto" value={monto} onChangeText={setMonto} keyboardType="numeric" style={s.input} placeholderTextColor={COLORS.textMuted || '#110101'}/>

            <TouchableOpacity style={[s.btn, s.btnPrimary]} onPress={guardarCombustible}>
              <Text style={s.btnText}>Guardar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={s.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={s.card}>
        <Text style={s.title}>Combustible</Text>

        <TextInput placeholder="Filtrar por tipo (aceite/combustible)" value={filtroTipo} onChangeText={setFiltroTipo} style={s.input} placeholderTextColor={COLORS.textMuted || '#110101'}/>

        <TouchableOpacity style={s.btn} onPress={() => setVisible(true)}>
          <Text style={s.btnText}>+ Agregar Combustible</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[s.btn, s.btnPrimary]} onPress={obtenerCombustibles}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Buscar</Text>}
        </TouchableOpacity>

        <FlatList
          data={lista}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={s.item}>
              <Text style={s.itemText}>
                <Text style={s.bold}>Tipo: </Text>{item.tipo}
              </Text>
              <Text style={s.itemText}>
                <Text style={s.bold}>Cantidad: </Text>{item.cantidad} {item.unidad}
              </Text>
              <Text style={s.itemText}>
                <Text style={s.bold}>Monto: </Text>{item.monto}
              </Text>
              <Text style={s.itemText}>
                <Text style={s.bold}>Fecha: </Text>{item.fecha}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16
  },

  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },

  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
    textAlign: 'center'
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    color: COLORS.textPrimary,
    backgroundColor: "#fafafa",
    textAlign: 'center'
  },

  btn: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    elevation: 2
  },
  btnPrimary: {
    backgroundColor: COLORS.primary
  },

  btnText: {
    color: "#fff",
    fontSize: FONTS.sizes.md,
    fontWeight: '600'
  },

  item: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 }
  },

  itemText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    marginBottom: 3
  },

  bold: {
    fontWeight: '700'
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)'
  },

  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 }
  },

  modalTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center'
  },

  closeText: {
    marginTop: 10,
    color: COLORS.textMuted,
    textAlign: 'center'
  }
});