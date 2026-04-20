import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
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

      <View style={s.card}>

        <Image
          source={{ uri: usuario?.fotoUrl }}
          style={s.avatar}
        />

        <View style={s.info}>
          <Text style={s.label}>Nombre</Text>
          <Text style={s.value}>{usuario?.nombre} {usuario?.apellido}</Text>

          <Text style={s.label}>Correo</Text>
          <Text style={s.value}>{usuario?.correo}</Text>

          <Text style={s.label}>Rol</Text>
          <Text style={s.value}>{usuario?.rol}</Text>

          <Text style={s.label}>Grupo</Text>
          <Text style={s.value}>{usuario?.grupo}</Text>
        </View>

        <TouchableOpacity disabled={loading} style={s.button} onPress={abrirCamara}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>Tomar Foto</Text>}
        </TouchableOpacity>

        <TouchableOpacity disabled={loading} style={s.buttonOutline} onPress={abrirGaleria}>
          <Text style={s.buttonOutlineText}>Elegir de Galería</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },

  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',

    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: COLORS.primary
  },

  info: {
    width: '100%',
    marginBottom: 15
  },

  label: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: 8
  },

  value: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    fontWeight: '600'
  },

  button: {
    width: '100%',
    height: 45,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600'
  },

  buttonOutline: {
    width: '100%',
    height: 45,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },

  buttonOutlineText: {
    color: COLORS.primary,
    fontWeight: '600'
  }
});