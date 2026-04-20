import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView } from 'react-native';
import apiClient from '../../services/apiClient';
import { COLORS, FONTS } from '../../core/theme';

export default function GomasScreen({ route }) {
  const { vehiculo_id } = route.params || {};
  const [gomas, setGomas] = useState([]);
  const [selectedGoma, setSelectedGoma] = useState(null);
  const [estado, setEstado] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  if (!vehiculo_id) {
    return <Text style={s.error}>Error: No se recibió el ID del vehículo</Text>;
  }

  const fetchGomas = async () => {
    try {
      const { data } = await apiClient.get('/gomas', { params: { vehiculo_id } });
      setGomas(data.data.gomas);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => { fetchGomas(); }, []);

  const actualizarEstado = async () => {
    if (!selectedGoma?.id || !estado.trim()) {
      alert("Debes seleccionar una goma y un estado válido");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('datax', JSON.stringify({
        goma_id: selectedGoma.id,
        estado: estado.trim()
      }));

      await apiClient.post('/gomas/actualizar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setModalVisible(false);
      fetchGomas();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al actualizar estado');
    }
  };

  const registrarPinchazo = async () => {
    if (!selectedGoma?.id || !descripcion.trim() || !fecha.trim()) {
      alert("Debes llenar descripción y fecha");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('datax', JSON.stringify({
        goma_id: selectedGoma.id,
        descripcion: descripcion.trim(),
        fecha: fecha.trim()
      }));

      await apiClient.post('/gomas/pinchazos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setModalVisible(false);
      fetchGomas();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al registrar pinchazo');
    }
  };

  const getColor = (estado) => {
    switch (estado) {
      case 'buena': return COLORS.success;
      case 'regular': return COLORS.warning;
      case 'mala': return COLORS.danger;
      case 'reemplazada': return COLORS.textMuted;
      default: return COLORS.border;
    }
  };

  return (
    <View style={s.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {gomas.map((goma) => (
          <TouchableOpacity
            key={goma.id}
            style={[s.goma, { backgroundColor: getColor(goma.estado) }]}
            onPress={() => { setSelectedGoma(goma); setModalVisible(true); }}
          >
            <Text style={s.gomaText}>{goma.posicion} ({goma.estado})</Text>
            <Text style={s.gomaSub}>Pinchazos: {goma.totalPinchazos}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={s.centeredView}>
          <View style={s.modalView}>
            <Text style={s.modalTitle}>Actualizar {selectedGoma?.posicion}</Text>

            <TextInput placeholder="Nuevo estado" value={estado} onChangeText={setEstado} style={s.input} />

            <TouchableOpacity style={[s.btn, s.btnPrimary]} onPress={actualizarEstado}>
              <Text style={s.btnText}>Actualizar Estado</Text>
            </TouchableOpacity>

            <TextInput placeholder="Descripción del pinchazo" value={descripcion} onChangeText={setDescripcion} style={s.input} />
            <TextInput placeholder="Fecha (YYYY-MM-DD)" value={fecha} onChangeText={setFecha} style={s.input} />

            <TouchableOpacity style={s.btn} onPress={registrarPinchazo}>
              <Text style={s.btnText}>Registrar Pinchazo</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={s.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  goma: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 10
  },

  gomaText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: FONTS.sizes.md
  },

  gomaSub: {
    color: '#fff',
    fontSize: FONTS.sizes.sm,
    marginTop: 4,
    opacity: 0.9
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
    marginBottom: 10,
    backgroundColor: '#fafafa',
    color: COLORS.textPrimary
  },

  btn: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5
  },

  btnPrimary: {
    backgroundColor: COLORS.primary
  },

  btnText: {
    color: '#fff',
    fontWeight: '600'
  },

  closeText: {
    marginTop: 10,
    textAlign: 'center',
    color: COLORS.textMuted
  }
});