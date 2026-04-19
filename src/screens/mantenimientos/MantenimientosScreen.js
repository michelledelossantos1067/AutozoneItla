import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Modal, Image, Alert, ActivityIndicator } from 'react-native';
import { COLORS, FONTS } from '../../core/theme';
import * as ImagePicker from 'expo-image-picker';

export default function MantenimientoScreen({ route, navigation }) {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);
  const { vehiculo_id } = route.params || {};
  const [filtroTipo, setFiltroTipo] = useState('');
  const [visible, setVisible] = useState(false);
  const [tipo, setTipo] = useState('');
  const [costo, setCosto] = useState('');
  const [piezas, setPiezas] = useState('');
  const [fecha, setFecha] = useState('');
  const [fotosNuevas, setFotosNuevas] = useState([]);

  const obtenerMantenimientos = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const response = await apiClient.get('/mantenimientos', {
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


  const seleccionarImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const nuevas = [...fotosNuevas, ...result.assets];

      if (nuevas.length > 5) {
        Alert.alert("Límite", "Maximo de 5 imagenes alcanzados.");
        return;
      }

      setFotosNuevas(nuevas);
    }
  };

  const guardarTodo = async () => {
    if (!vehiculo_id || !tipo) {
      Alert.alert("Error", "El ID del vehículo y el tipo son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      const dataMantenimiento = {
        vehiculo_id: Number(vehiculo_id),
        tipo: tipo.trim(),
        costo: parseFloat(costo) || 0,
        piezas: piezas.trim() || "",
        fecha: fecha.trim() || new Date().toISOString().split('T')[0]
      };

      const formData = new FormData();
      formData.append('datax', JSON.stringify(dataMantenimiento));

      if (fotosNuevas.length > 0) {
        fotosNuevas.forEach((foto, index) => {
          formData.append('fotos[]', {
            uri: foto.uri,
            type: 'image/jpeg',
            name: `mantenimiento_${Date.now()}_${index}.jpg`,
          });
        });
      }

      const response = await apiClient.post('/mantenimientos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        Alert.alert('Éxito', 'Mantenimiento registrado correctamente');
        setFotosNuevas([]);
        setTipo('');
        setCosto('');
        setPiezas('');
        setFecha('');
        setVisible(false);
        obtenerMantenimientos();
      }
    } catch (error) {
      const mensaje = error.response?.data?.message || "Error al conectar con el servidor";
      Alert.alert("Error", mensaje);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerMantenimientos();
  }, [filtroTipo]);

  return (
    <View style={s.screen}>
      <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={() => setVisible(false)}>
        <View style={s.centeredView}>
          <View style={s.modalView}>
            <Text style={s.modalTitle}>Registrar Mantenimiento</Text>

            <TextInput style={s.input} placeholder='Tipo (Ej: Aceite)' value={tipo} onChangeText={setTipo} />
            <TextInput style={s.input} keyboardType='numeric' placeholder='Costo' value={costo} onChangeText={setCosto} />
            <TextInput style={s.input} placeholder='Piezas' value={piezas} onChangeText={setPiezas} />
            <TextInput style={s.input} placeholder='Fecha (AAAA-MM-DD)' value={fecha} onChangeText={setFecha} />

            <View style={s.previewContainer}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {fotosNuevas.length > 0 ? (
                  fotosNuevas.map((foto, index) => (
                    <Image
                      key={index}
                      source={{ uri: foto.uri }}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 10
                      }}
                      resizeMode="cover"
                    />
                  ))
                ) : (
                  <Text>No hay imágenes seleccionadas</Text>
                )}
              </View>
            </View>

            <TouchableOpacity style={s.botonSecundario} onPress={seleccionarImagen}>
              <Text style={s.textBotonSecundario}>📷 Seleccionar Imágenes</Text>
            </TouchableOpacity>

            <View style={s.modalActions}>
              <TouchableOpacity style={[s.botonAccion, { backgroundColor: '#2E86C1' }]} onPress={guardarTodo}>
                <Text style={s.textWhite}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.botonAccion, { backgroundColor: '#E74C3C' }]} onPress={() => setVisible(false)}>
                <Text style={s.textWhite}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={s.mainCard}>
        <Text style={s.headerTitle}>Mantenimiento</Text>

        <View style={s.searchSection}>
          <TextInput style={s.inputBuscador} placeholder="Filtrar por tipo (Ej: aceite)" value={filtroTipo} onChangeText={setFiltroTipo} />

          <TouchableOpacity style={s.botonBuscar} onPress={() => setVisible(true)}>
            <Text style={s.textWhite}>+ Agregar Mantenimiento</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[s.botonBuscar, { backgroundColor: COLORS.primary }]} onPress={obtenerMantenimientos}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={s.textWhite}>🔍 Buscar Historial</Text>}
          </TouchableOpacity>
        </View>

        <FlatList
          style={s.list}
          data={lista}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={s.cardItem} onPress={() => navigation.navigate('DetalleMantenimiento', { id: item.id })}>
              <View style={s.cardRow}>
                <View style={s.cardContent}>
                  <Text style={s.cardLabel}>TIPO: <Text style={s.cardValue}>{item.tipo}</Text></Text>
                  <Text style={s.cardLabel}>COSTO: <Text style={s.cardValue}>${item.costo}</Text></Text>
                  <Text style={s.cardLabel}>PIEZAS: <Text style={s.cardValue}>{item.piezas}</Text></Text>
                  <Text style={s.cardLabel}>FECHA: <Text style={s.cardValue}>{item.fecha}</Text></Text>
                </View>
                {item.fotos && item.fotos.length > 0 ? (
                  <Image source={{ uri: item.fotos[0] }} style={s.cardImage} />
                ) : (
                  <View style={[s.cardImage, s.placeholderImage]}>
                    <Text style={{ fontSize: 10, color: COLORS.textMuted }}>Sin foto</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={s.emptyText}>No hay registros para este vehículo</Text>}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
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
  emptyText: { textAlign: 'center', marginTop: 20, color: COLORS.textMuted }
});