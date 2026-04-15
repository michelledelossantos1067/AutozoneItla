import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, Button } from 'react-native';
import { getGomas, updateGoma, registrarPinchazo } from '../../api/gomas';
import { COLORS, FONTS } from '../../core/theme';

export default function GomasScreen({ route }) {
  const { vehiculo_id } = route.params;
  const [gomas, setGomas] = useState([]);
  const [selected, setSelected] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');

  useEffect(() => { fetchGomas(); }, []);

  const fetchGomas = () => {
    getGomas(vehiculo_id).then(res => setGomas(res.data)).catch(err => console.error(err));
  };

  const colorMap = { Buena: COLORS.success, Regular: COLORS.warning, Mala: COLORS.error, Reemplazada: COLORS.muted };

  const handleActualizar = async () => {
    try {
      await updateGoma({ goma_id: selected.id, estado: nuevoEstado });
      fetchGomas();
      setSelected(null);
    } catch (err) { console.error(err); }
  };

  const handlePinchazo = async () => {
    try {
      await registrarPinchazo({ goma_id: selected.id, descripcion, fecha });
      fetchGomas();
      setSelected(null);
    } catch (err) { console.error(err); }
  };

  return (
    <View style={s.screen}>
      {gomas.map(goma => (
        <TouchableOpacity key={goma.id} style={[s.goma, { backgroundColor: colorMap[goma.estado] }]} onPress={() => setSelected(goma)}>
          <Text style={s.gomaText}>{goma.posicion}</Text>
        </TouchableOpacity>
      ))}

      <Modal visible={!!selected} transparent animationType="slide">
        <View style={s.modal}>
          <Text style={s.modalTitle}>Estado actual: {selected?.estado}</Text>
          <TextInput placeholder="Nuevo estado (Buena/Regular/Mala/Reemplazada)" value={nuevoEstado} onChangeText={setNuevoEstado} style={s.input} />
          <Button title="Actualizar Estado" onPress={handleActualizar} />

          <TextInput placeholder="Descripción pinchazo" value={descripcion} onChangeText={setDescripcion} style={s.input} />
          <TextInput placeholder="Fecha pinchazo (YYYY-MM-DD)" value={fecha} onChangeText={setFecha} style={s.input} />
          <Button title="Registrar Pinchazo" onPress={handlePinchazo} />

          <Button title="Cerrar" onPress={() => setSelected(null)} />
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, padding: 20, flexDirection: 'row', flexWrap: 'wrap' },
  goma: { width: '45%', height: 80, margin: 5, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  gomaText: { color: COLORS.textLight, fontWeight: '700' },
  modal: { flex: 1, backgroundColor: 'white', margin: 20, padding: 20, borderRadius: 8, justifyContent: 'center' },
  modalTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: COLORS.border, padding: 10, marginBottom: 10, borderRadius: 6 },
});
