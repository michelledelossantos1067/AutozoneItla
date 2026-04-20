import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, FlatList, ActivityIndicator } from 'react-native';
import apiClient from '../../services/apiClient';
import { COLORS, FONTS } from '../../core/theme';

export default function Ingresos({ route }) {
  const { vehiculo_id } = route.params || {};

  const [ingresos, setIngresos] = useState([]);
  const [monto, setMonto] = useState('');
  const [concepto, setConcepto] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  if (!vehiculo_id) {
    return <Text style={s.error}>No se recibió el ID del vehículo</Text>;
  }

  const fetchIngresos = async (nextPage = 1) => {
    if (loading) return;
    if (!hasMore && nextPage !== 1) return;

    try {
      setLoading(true);

      const { data } = await apiClient.get('/ingresos', {
        params: { vehiculo_id, page: nextPage }
      });

      const nuevos = data?.data?.ingresos || data?.data || [];

      setIngresos(prev =>
        nextPage === 1 ? nuevos : [...prev, ...nuevos]
      );

      setHasMore(nuevos.length > 0);
      setPage(nextPage);

    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngresos(1);
  }, []);

  const guardarIngreso = async () => {
    if (!monto) {
      alert("Debe ingresar el monto");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('datax', JSON.stringify({
        vehiculo_id: Number(vehiculo_id),
        monto: parseFloat(monto),
        concepto
      }));

      await apiClient.post('/ingresos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setModalVisible(false);
      setMonto('');
      setConcepto('');
      fetchIngresos(1);

    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <View style={s.screen}>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={s.centeredView}>
          <View style={s.modalView}>

            <Text style={s.modalTitle}>Registrar Ingreso</Text>

            <TextInput style={s.input} placeholder="Monto" keyboardType="numeric" value={monto} onChangeText={setMonto} />

            <TextInput style={s.input} placeholder="Concepto" value={concepto} onChangeText={setConcepto} />

            <View style={s.modalActions}>
              <TouchableOpacity style={[s.botonAccion, s.btnPrimary]} onPress={guardarIngreso}>
                <Text style={s.textWhite}>Guardar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[s.botonAccion, s.btnDanger]} onPress={() => setModalVisible(false)}>
                <Text style={s.textWhite}>Cancelar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      <View style={s.mainCard}>
        <Text style={s.headerTitle}>Ingresos</Text>

        <View style={s.searchSection}>
          <TouchableOpacity style={s.botonBuscar} onPress={() => setModalVisible(true)}>
            <Text style={s.textWhite}>+ Agregar Ingreso</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          style={s.list}
          data={ingresos}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={() => {
            if (!loading && hasMore) {
              fetchIngresos(page + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading && <ActivityIndicator />}
          renderItem={({ item }) => (
            <View style={s.cardItem}>
              <Text style={s.cardLabel}>MONTO: <Text style={s.cardValue}>${item.monto}</Text></Text>
              <Text style={s.cardLabel}>CONCEPTO: <Text style={s.cardValue}>{item.concepto}</Text></Text>
              <Text style={s.cardLabel}>FECHA: <Text style={s.cardValue}>{item.fecha}</Text></Text>
            </View>
          )}
          ListEmptyComponent={<Text style={s.emptyText}>No hay ingresos registrados</Text>}
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

  error: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.danger
  },

  mainCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,

    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },

  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 10
  },

  searchSection: {
    marginBottom: 10
  },

  botonBuscar: {
    backgroundColor: COLORS.primary,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2
  },

  textWhite: {
    color: '#fff',
    fontWeight: '600'
  },

  list: {
    marginTop: 10
  },

  cardItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,

    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 }
  },

  cardLabel: {
    fontWeight: '700',
    color: COLORS.primary,
    fontSize: 12,
    marginBottom: 2
  },

  cardValue: {
    color: COLORS.textPrimary
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.textMuted
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)'
  },

  modalView: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,

    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 }
  },

  modalTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15,
    color: COLORS.textPrimary
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fafafa',
    color: COLORS.textPrimary
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },

  botonAccion: {
    flex: 0.48,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },

  btnPrimary: {
    backgroundColor: COLORS.primary
  },

  btnDanger: {
    backgroundColor: COLORS.danger
  }
});