import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { createVehiculo, editVehiculo, updateVehiculoFoto } from '../../api/vehiculos';
import { COLORS, FONTS } from '../../core/theme';

export default function FormVehiculoScreen({ route, navigation }) {
  const vehiculo = route.params?.vehiculo; // si viene para editar
  const [placa, setPlaca] = useState(vehiculo?.placa || '');
  const [chasis, setChasis] = useState(vehiculo?.chasis || '');
  const [marca, setMarca] = useState(vehiculo?.marca || '');
  const [modelo, setModelo] = useState(vehiculo?.modelo || '');
  const [ano, setAno] = useState(vehiculo?.ano?.toString() || '');
  const [ruedas, setRuedas] = useState(vehiculo?.ruedas?.toString() || '4');
  const [foto, setFoto] = useState(null);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, res => {
      if (!res.didCancel && res.assets?.length) {
        setFoto(res.assets[0]);
      }
    });
  };

  const handleSave = async () => {
    if (!placa || !marca || !modelo) {
      Alert.alert('Error', 'Placa, Marca y Modelo son requeridos');
      return;
    }

    try {
      if (vehiculo) {
        // edición
        await editVehiculo({ id: vehiculo.id, placa, chasis, marca, modelo, ano, ruedas });
        if (foto) {
          const fd = new FormData();
          fd.append('id', vehiculo.id);
          fd.append('foto', {
            uri: foto.uri,
            type: foto.type,
            name: foto.fileName || 'vehiculo.jpg',
          });
          await updateVehiculoFoto(fd);
        }
      } else {
        // creación
        const fd = new FormData();
        fd.append('placa', placa);
        fd.append('chasis', chasis);
        fd.append('marca', marca);
        fd.append('modelo', modelo);
        fd.append('ano', ano);
        fd.append('ruedas', ruedas);
        if (foto) {
          fd.append('foto', {
            uri: foto.uri,
            type: foto.type,
            name: foto.fileName || 'vehiculo.jpg',
          });
        }
        await createVehiculo(fd);
      }

      Alert.alert('Éxito', 'Vehículo guardado correctamente');
      navigation.goBack(); // regresa y refresca lista
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo guardar el vehículo');
    }
  };

  return (
    <View style={s.screen}>
      <Text style={s.title}>{vehiculo ? 'Editar Vehículo' : 'Nuevo Vehículo'}</Text>

      <TextInput style={s.input} placeholder="Placa" value={placa} onChangeText={setPlaca} />
      <TextInput style={s.input} placeholder="Chasis" value={chasis} onChangeText={setChasis} />
      <TextInput style={s.input} placeholder="Marca" value={marca} onChangeText={setMarca} />
      <TextInput style={s.input} placeholder="Modelo" value={modelo} onChangeText={setModelo} />
      <TextInput style={s.input} placeholder="Año" keyboardType="numeric" value={ano} onChangeText={setAno} />
      <TextInput style={s.input} placeholder="Ruedas" keyboardType="numeric" value={ruedas} onChangeText={setRuedas} />

      <TouchableOpacity style={s.btn} onPress={pickImage}>
        <Text style={s.btnText}>Seleccionar Foto</Text>
      </TouchableOpacity>

      {foto && <Image source={{ uri: foto.uri }} style={{ width: 120, height: 80, marginVertical: 10 }} />}

      <TouchableOpacity style={[s.btn, { backgroundColor: COLORS.primary }]} onPress={handleSave}>
        <Text style={s.btnText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
  title: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: COLORS.border, padding: 10, marginBottom: 10, borderRadius: 6 },
  btn: { backgroundColor: COLORS.secondary, padding: 15, borderRadius: 6, marginTop: 10, alignItems: 'center' },
  btnText: { color: COLORS.textLight, fontWeight: '600' },
});
