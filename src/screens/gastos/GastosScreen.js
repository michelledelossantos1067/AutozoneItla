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

  // 🔹 CATEGORÍAS
  const fetchCategorias = async () => {
    try {
      const { data } = await apiClient.get('/gastos/categorias');
      setCategorias(data?.data || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // 🔹 GASTOS
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

  // 🔹 GUARDAR
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

      {/* MODAL */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={s.centeredView}>
          <View style={s.modalView}>

            <Text style={s.modalTitle}>Registrar Gasto</Text>

            <TextInput style={s.input} placeholder="Monto" keyboardType="numeric" value={monto} onChangeText={setMonto}/>

            <TextInput style={s.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion}/>

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

      {/* CARD */}
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
    flex: 1, backgroundColor: COLORS.background, padding: 10, alignItems: 'center', justifyContent: 'center'
  },
  error: { textAlign: 'center', marginTop: 20, color: COLORS.danger },
  goma: { padding: 15, borderRadius: 6, marginBottom: 10 },
  gomaText: { color: COLORS.textLight, fontWeight: '600' },
  gomaSub: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm },
  modal: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: COLORS.background },
  modalTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: COLORS.border, padding: 10, borderRadius: 6, marginBottom: 10 },
  btn: { backgroundColor: COLORS.primary, padding: 12, borderRadius: 6, marginBottom: 10 },
  btnText: { color: COLORS.textLight, textAlign: 'center', fontWeight: '600' },
  closeBtn: { backgroundColor: COLORS.danger, padding: 12, borderRadius: 6 },
  closeText: { color: COLORS.textLight, textAlign: 'center', fontWeight: '600' },
  screen: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
  mainCard: { width: 340, backgroundColor: 'white', elevation: 15, borderRadius: 25, overflow: 'hidden', alignItems: 'center' },
  headerTitle: { fontSize: 24, marginTop: 20, fontWeight: '700', color: COLORS.textPrimary },
  searchSection: { padding: 20, width: '100%', alignItems: 'center' },
  inputBuscador: { borderWidth: 1, borderColor: '#DDD', width: '100%', borderRadius: 10, padding: 10, textAlign: 'center', marginBottom: 15, color: COLORS.textPrimary },
  botonBuscar: { backgroundColor: '#2E86C1', width: '100%', height: 45, marginBottom: 10, borderRadius: 12, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  textWhite: { color: 'white', fontWeight: '600', fontSize: 15 },
  list: { maxHeight: 400, width: '100%', borderTopWidth: 1, borderColor: '#EEE' },
  cardItem: { backgroundColor: 'white', marginHorizontal: 15, marginVertical: 8, padding: 15, borderRadius: 15, elevation: 5 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardContent: { flex: 1 },
  cardLabel: { fontWeight: 'bold', color: '#E74C3C', fontSize: 12, marginBottom: 2 },
  cardValue: { color: '#333', fontWeight: '400' },
  cardImage: { width: 80, height: 80, borderRadius: 10, backgroundColor: '#F5F5F5' },
  placeholderImage: { justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#CCC' },
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalView: { width: '85%', backgroundColor: 'white', borderRadius: 25, padding: 25, alignItems: 'center', elevation: 20 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20, color: COLORS.primary },
  input: { borderBottomWidth: 1, borderBottomColor: '#CCC', width: '100%', marginBottom: 15, padding: 8 },
  previewContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  miniPreview: { width: 50, height: 50, margin: 2, borderRadius: 5 },
  botonSecundario: { padding: 10, marginBottom: 20 },
  textBotonSecundario: { color: '#2E86C1', fontWeight: 'bold' },
  modalActions: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  botonAccion: { flex: 0.48, height: 45, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', marginTop: 20, color: COLORS.textMuted },
  filtroBtn: {
    backgroundColor: '#BDC3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 15,
  },
  filtroActivo: {
    backgroundColor: '#2E86C1'
  },
});