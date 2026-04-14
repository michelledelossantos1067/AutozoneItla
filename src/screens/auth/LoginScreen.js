import React, { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import apiClient from '../../services/apiClient'
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { COLORS, FONTS } from '../../core/theme';
import { useAuth } from '../../store/AuthContext';

export default function LoginScreen({ navigation }) {
  const [contraseña, setContraseña] = useState('')
  const [matricula, setMatricula] = useState('');
  const [loading, setLoading] = useState(false)
  const { login } = useAuth();
  
  const loginCuenta = async () => {
    if (loading) return;

    try {

      if (!contraseña.trim()) {
        console.log('Error: La contraseña esta vacia');
        return;
      }

      if (!matricula.trim()) {

        console.log("Error: Debe de introducir su matricula")
        return
      }

      setLoading(true)

      const data = {
        matricula: matricula,
        contrasena: contraseña
      };

      const response = await apiClient.post('/auth/login',
        new URLSearchParams({
          datax: JSON.stringify(data)
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      console.log('RESPUESTA LOGIN:', response.data);

      const token = response.data?.data?.token;
      const refreshToken = response.data?.data?.refreshToken;
      const usuario = response.data?.data;

      if (!token) {
        alert('Error: no se recibió token');
        return;
      }

      await login({
        token,
        refreshToken,
        usuario
      });

      alert('Login completado');

    } catch (error) {
      console.log(error.response?.data || error.message);

      const msg = error.response?.data?.message;
      alert(msg || 'Error al iniciar sesión');

    } finally {
      setLoading(false);
    }

  };


  return (
    <View style={s.screen}>
      <Text style={s.title}>Login</Text>

      <View style={{
        width: 340,
        height: 'auto',
        backgroundColor: 'white',
        borderWidth: 1.5,
        marginTop: 15,
      }}>

        <View style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 15,
          justifyContent: 'center',
          padding: 15
        }}>


          <TextInput style={{
            borderWidth: 2,
            width: '100%',
            textAlign: 'center'
          }}
            placeholder='Introducir Matricula'
            value={matricula}
            onChangeText={setMatricula}
          ></TextInput>

          <TextInput style={{
            borderWidth: 2,
            width: '100%',
            textAlign: 'center'
          }}
            secureTextEntry
            placeholder='Introducir Contraseña'
            value={contraseña}
            onChangeText={setContraseña}
          ></TextInput>

        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center', gap: 10 }}>

          <Text>
            ¿Olvido su contraseña? {" "}
            <Text onPress={() => navigation.navigate('Auth', { screen: 'Recuperar' })}>
              Recupera aqui
            </Text>
          </Text>

          <TouchableOpacity disabled={loading} onPress={loginCuenta} style={s.TouchableOpacity}>
            <Text>Inicia Sesion</Text>
          </TouchableOpacity>

        </View>

      </View>
      <Text style={s.sub}>Pendiente de implementacion</Text>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary },
  sub: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, marginTop: 8 },
  TouchableOpacity: { backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginBottom: 10, width: '50%', borderRadius: 15, height: 40 }
});