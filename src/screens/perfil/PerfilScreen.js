import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../store/AuthContext';
import apiClient from '../../services/apiClient';
import { COLORS, FONTS } from '../../core/theme';

export default function PerfilScreen() {

  const { usuario, updateUsuario } = useAuth();
  const [loading, setLoading] = useState(false);

  const obtenerPerfil = async () => {
    try {
      const response = await apiClient.get('/perfil');
      updateUsuario(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerPerfil();
  }, []);


  const abrirCamara = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) return alert('Permiso denegado');

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1
    });

    if (!result.canceled) {
      subirImagen(result.assets[0]);
    }
  };


  const abrirGaleria = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) return alert('Permiso denegado');

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1
    });

    if (!result.canceled) {
      subirImagen(result.assets[0]);
    }
  };

  const subirImagen = async (imagen) => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append('foto', {
        uri: imagen.uri,
        name: 'perfil.jpg',
        type: 'image/jpeg'
      });

      const response = await apiClient.post('/perfil/foto', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('RESPUESTA FOTO:', response.data);

      updateUsuario({ fotoUrl: response.data.data?.fotoUrl });

    } catch (error) {
      console.log(error);
      alert('Error al subir imagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.screen}>

      <View style={{
        width: 340,
        height: 'auto',
        backgroundColor: 'white',
        borderWidth: 1.5,
        gap: 15,
        display: 'flex',
        alignItems: 'center'
      }}>


        <Image
          source={{ uri: usuario?.fotoUrl }}
          style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 1.5, marginTop: 15 }}
        />

        <View style={{
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 15
        }}>

          <Text><Text style={{ fontWeight: 'bold' }}>Nombre: </Text>{usuario?.nombre}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Apellido: </Text>{usuario?.apellido}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Correo Electronico: </Text>{usuario?.correo}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Rol: </Text>{usuario?.rol}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Grupo: </Text>{usuario?.grupo}</Text>
        </View>



        <TouchableOpacity disabled={loading} style={s.TouchableOpacity} onPress={abrirCamara}>
          <Text>Tomar Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity disabled={loading} style={s.TouchableOpacity} onPress={abrirGaleria}>
          <Text>Elegir de Galería</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center', },
  title: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary },
  sub: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, marginTop: 8 },
  TouchableOpacity: { backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginBottom: 10, width: '50%', borderRadius: 15, height: 40 }
});