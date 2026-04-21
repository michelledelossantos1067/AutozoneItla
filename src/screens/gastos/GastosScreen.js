import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, FlatList, ActivityIndicator } from 'react-native';
import apiClient from '../../services/apiClient';
import { COLORS, FONTS } from '../../core/theme';

export default function GastosScreen({ route }) {
  const { vehiculo_id } = route.params || {};

  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoria_id, setCategoriaId] = useState('');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState('');

  const [showCategorias, setShowCategorias] = useState(false);

  if (!vehiculo_id) {
    return <Text style={s.error}>No se recibió el ID del vehículo</Text>;
  }

  const fetchCategorias = async () => {
    try {
      const { data } = await apiClient.get('/gastos/categorias');
      setCategorias(data?.data || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const fetchGastos = async (nextPage = 1) => {
    if (loading) return;
    if (!hasMore && nextPage !== 1) return;

    try {
      setLoading(true);

      const { data } = await apiClient.get('/gastos', {
        params: {
          vehiculo_id,
          page: nextPage,
          categoria_id: filtroCategoria || undefined
        }
      });

      const nuevos = data?.data?.gastos || data?.data || [];

      setGastos(prev =>
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
    fetchCategorias();
    fetchGastos(1);
  }, [filtroCategoria]);

  const guardarGasto = async () => {
    if (!categoria_id || !monto) {
      alert("Debe seleccionar categoría y monto");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('datax', JSON.stringify({
        vehiculo_id: Number(vehiculo_id),
        categoria_id: Number(categoria_id),
        monto: parseFloat(monto),
        descripcion
      }));

      await apiClient.post('/gastos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setModalVisible(false);
      setMonto('');
      setDescripcion('');
      setCategoriaId('');
      fetchGastos(1);

    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <View style={s.screen}>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={s.centeredView}>
          <View style={s.modalView}>

            <Text style={s.modalTitle}>Registrar Gasto</Text>

            <TextInput style={s.input} placeholder="Monto" keyboardType="numeric" value={monto} onChangeText={setMonto} placeholderTextColor={COLORS.textMuted || '#110101'}/>

            <TextInput style={s.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} placeholderTextColor={COLORS.textMuted || '#110101'}/>

            <Text style={s.label}>Categoría</Text>

            <TouchableOpacity style={s.selector} onPress={() => setShowCategorias(!showCategorias)}>
              <Text>
                {categorias.find(c => c.id == categoria_id)?.nombre || 'Seleccionar categoría'}
              </Text>
            </TouchableOpacity>

            {showCategorias && (
              <FlatList
                style={{ maxHeight: 150 }}
                data={categorias}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={s.option}
                    onPress={() => {
                      setCategoriaId(item.id);
                      setShowCategorias(false);
                    }}
                  >
                    <Text>{item.nombre}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            <View style={s.modalActions}>
              <TouchableOpacity style={[s.botonAccion, { backgroundColor: '#2E86C1' }]} onPress={guardarGasto}>
                <Text style={s.textWhite}>Guardar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[s.botonAccion, { backgroundColor: '#E74C3C' }]} onPress={() => setModalVisible(false)}>
                <Text style={s.textWhite}>Cancelar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>


      <View style={s.mainCard}>
        <Text style={s.headerTitle}>Gastos</Text>

        <View style={s.searchSection}>

          <Text style={s.subText}>
            Categoría: {categorias.find(c => c.id == filtroCategoria)?.nombre || 'Todas'}
          </Text>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[{ id: '', nombre: 'Todas' }, ...categorias]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              const activo = filtroCategoria == item.id;

              return (
                <TouchableOpacity
                  style={[
                    s.filtroBtn,
                    activo && s.filtroActivo
                  ]}
                  onPress={() => {
                    setFiltroCategoria(item.id);
                    setPage(1);
                  }}
                >
                  <Text style={[s.textWhite, activo && { fontWeight: 'bold' }]}>
                    {item.nombre}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />

          <TouchableOpacity style={s.botonBuscar} onPress={() => setModalVisible(true)}>
            <Text style={s.textWhite}>+ Agregar Gasto</Text>
          </TouchableOpacity>

        </View>

        <FlatList
          style={s.list}
          data={gastos || []}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={() => {
            if (!loading && hasMore) {
              fetchGastos(page + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading && <ActivityIndicator />}
          renderItem={({ item }) => (
            <View style={s.cardItem}>
              <Text style={s.cardLabel}>TIPO: <Text style={s.cardValue}>{item.categoriaNombre}</Text></Text>
              <Text style={s.cardLabel}>MONTO: <Text style={s.cardValue}>${item.monto}</Text></Text>
              <Text style={s.cardLabel}>DESC: <Text style={s.cardValue}>{item.descripcion}</Text></Text>
              <Text style={s.cardLabel}>FECHA: <Text style={s.cardValue}>{item.fecha}</Text></Text>
            </View>
          )}
          ListEmptyComponent={<Text style={s.emptyText}>No hay gastos registrados</Text>}
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

  subText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginBottom: 10
  },

  searchSection: {
    marginBottom: 10
  },

  filtroBtn: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 6
  },

  filtroActivo: {
    backgroundColor: COLORS.primary
  },

  textWhite: {
    color: '#fff',
    fontWeight: '600'
  },

  botonBuscar: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2
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
    color: COLORS.textPrimary,
    fontWeight: '400'
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

  label: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginBottom: 5
  },

  selector: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fafafa'
  },

  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee'
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
  }
});