import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
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
    console.error("❌ No se recibió el parámetro 'vehiculo_id' en GomasScreen");
    return <Text style={s.error}>Error: No se recibió el ID del vehículo</Text>;
  }

  // 📌 GET /gomas?vehiculo_id=
  const fetchGomas = async () => {
    try {
      console.log("➡ Consultando gomas con vehiculo_id:", vehiculo_id);
      const { data } = await apiClient.get('/gomas', { params: { vehiculo_id } });
      console.log("Respuesta gomas:", data);
      setGomas(data.data.gomas);
    } catch (err) {
      console.error('Error cargando gomas:', err.response?.data || err.message);
    }
  };

  useEffect(() => { fetchGomas(); }, []);

  // 📌 POST /gomas/actualizar
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
      console.error('Error actualizando estado de goma:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Error al actualizar estado');
    }
  };

  // 📌 POST /gomas/pinchazos
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
      console.error('Error registrando pinchazo:', err.response?.data || err.message);
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

      <Modal visible={modalVisible} animationType="slide">
        <View style={s.modal}>
          <Text style={s.modalTitle}>Actualizar {selectedGoma?.posicion}</Text>
          <TextInput placeholder="Nuevo estado" value={estado} onChangeText={setEstado} style={s.input} />
          <TouchableOpacity style={s.btn} onPress={actualizarEstado}>
            <Text style={s.btnText}>Actualizar Estado</Text>
          </TouchableOpacity>

          <TextInput placeholder="Descripción del pinchazo" value={descripcion} onChangeText={setDescripcion} style={s.input} />
          <TextInput placeholder="Fecha (YYYY-MM-DD)" value={fecha} onChangeText={setFecha} style={s.input} />
          <TouchableOpacity style={s.btn} onPress={registrarPinchazo}>
            <Text style={s.btnText}>Registrar Pinchazo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.closeBtn} onPress={() => setModalVisible(false)}>
            <Text style={s.closeText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, padding: 10 },
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
});
