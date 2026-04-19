import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import apiClient from '../../services/apiClient';
import { COLORS, FONTS } from '../../core/theme';

export default function FormVehiculoScreen({ navigation, route }) {
  const editing = route.params?.vehiculo || null;
  const [placa, setPlaca] = useState(editing?.placa || '');
  const [chasis, setChasis] = useState(editing?.chasis || '');
  const [marca, setMarca] = useState(editing?.marca || '');
  const [modelo, setModelo] = useState(editing?.modelo || '');
  const [anio, setAnio] = useState(editing?.anio?.toString() || '');
  const [ruedas, setRuedas] = useState(editing?.cantidadRuedas || 4);
  const [foto, setFoto] = useState(editing?.fotoUrl || null);

  const handleSave = async () => {
    if (!placa.trim() || !chasis.trim() || !marca.trim() || !modelo.trim() || !anio.trim()) {
      alert('Placa, chasis, marca, modelo y año son requeridos');
      return;
    }

    try {
      const datax = {
        placa: placa.trim(),
        chasis: chasis.trim(),
        marca: marca.trim(),
        modelo: modelo.trim(),
        anio: Number(anio),
        cantidadRuedas: Number(ruedas),
        ...(editing ? { id: editing.id } : {}) // incluir id si es edición
      };

      const formData = new FormData();
      formData.append('datax', JSON.stringify(datax));

      if (foto) {
        const extension = foto.split('.').pop();
        const mimeType = extension === 'png' ? 'image/png'
          : extension === 'webp' ? 'image/webp'
            : extension === 'heic' ? 'image/heic'
              : 'image/jpeg'; // fallback

        formData.append('foto', {
          uri: foto,
          type: mimeType,
          name: `vehiculo.${extension || 'jpg'}`,
        });
      }

      console.log([...formData]); //  depuración

      if (editing) {
        await apiClient.post('/vehiculos/editar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await apiClient.post('/vehiculos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      navigation.goBack();
    } catch (err) {
      console.error('Error guardando vehículo:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Error al guardar vehículo');
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setFoto(asset.uri);

      if (editing) {
        const extension = asset.uri.split('.').pop();
        const mimeType = asset.mimeType || 'image/jpeg';
        const fileName = asset.fileName || `vehiculo.${extension || 'jpg'}`;

        const formData = new FormData();


        formData.append('datax', JSON.stringify({
          id: editing.id
        }));

        formData.append('foto', {
          uri: asset.uri,
          type: mimeType,
          name: fileName,
        });

        console.log("SUBIENDO FOTO CON ID:", editing.id);

        await apiClient.post('/vehiculos/foto', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
    }
  };

  return (
    <View style={s.screen}>
      <TextInput placeholder="Placa" value={placa} onChangeText={setPlaca} style={s.input} />
      <TextInput placeholder="Chasis" value={chasis} onChangeText={setChasis} style={s.input} />
      <TextInput placeholder="Marca" value={marca} onChangeText={setMarca} style={s.input} />
      <TextInput placeholder="Modelo" value={modelo} onChangeText={setModelo} style={s.input} />
      <TextInput placeholder="Año" value={anio} onChangeText={setAnio} keyboardType="numeric" style={s.input} />
      <TextInput placeholder="Cantidad de ruedas" value={ruedas.toString()} onChangeText={(v) => setRuedas(Number(v))} keyboardType="numeric" style={s.input} />

      {foto && <Image source={{ uri: foto }} style={s.image} />}
      <TouchableOpacity style={s.btn} onPress={handlePickImage}>
        <Text style={s.btnText}>Seleccionar Foto</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.saveBtn} onPress={handleSave}>
        <Text style={s.saveText}>{editing ? 'Actualizar' : 'Guardar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, padding: 10 },
  input: { borderWidth: 1, borderColor: COLORS.border, padding: 10, borderRadius: 6, marginBottom: 10 },
  image: { width: '100%', height: 150, marginBottom: 10, borderRadius: 6 },
  btn: { backgroundColor: COLORS.secondary, padding: 12, borderRadius: 6, marginBottom: 10 },
  btnText: { color: COLORS.textLight, textAlign: 'center', fontWeight: '600' },
  saveBtn: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 6 },
  saveText: { color: COLORS.textLight, textAlign: 'center', fontWeight: '700' },
});
