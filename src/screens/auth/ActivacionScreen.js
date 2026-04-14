import React, { useState } from 'react';
import apiClient from '../../services/apiClient'
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { COLORS, FONTS } from '../../core/theme';

export default function ActivacionScreen({ route, navigation }) {
  const [contraseña, setContraseña] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const { token } = route.params;
  const [loading, setLoading] = useState(false)

  const activarCuenta = async () => {
    if (loading) return;

    try {

      if (contraseña.trim().length < 6) {
        console.log('Error: La contraseña debe de tener mas de 6 caracteres');
        return;
      }

      if (confirmar !== contraseña) {
        console.log('Error: La contraseña no coincide');
        return;
      }


      setLoading(true)

      const data = {
        token: token,
        contrasena: contraseña
      };

      const response = await apiClient.post('/auth/activar',
        new URLSearchParams({
          datax: JSON.stringify(data)
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      console.log(response.data);

      alert('Cuenta activada');

      navigation.navigate('Auth', {
        screen: 'login',
      });

    } catch (error) {
      console.log(error.response?.data || error.message);
      alert('Error al activar cuenta');
    } finally {
      setLoading(false)
    }

  };


  return (
    <View style={s.screen}>
      <Text style={s.title}>ActivacionScreen</Text>

      <View style={{
        width: 340,
        height: 'auto',
        backgroundColor: 'white',
        borderWidth: 1.5,
        marginTop: 15,
        paddingLeft: 5,
        display: 'flex',
        alignItems: 'center'
      }}>

        <View style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 15,
          justifyContent: 'center',
          padding: 15
        }}>


          <TextInput style={{
            borderWidth: 2,
            width: '50%',
            textAlign: 'center'
          }}
            placeholder='Introducir contraseña'
            value={contraseña}
            onChangeText={setContraseña}
          ></TextInput>

          <TextInput style={{
            borderWidth: 2,
            width: '50%',
            textAlign: 'center'
          }}
            placeholder='Confirmar Contraseña'
            value={confirmar}
            onChangeText={setConfirmar}
          ></TextInput>

        </View>

        <TouchableOpacity disabled={loading} onPress={activarCuenta} style={s.TouchableOpacity}>
          <Text>Registrate</Text>
        </TouchableOpacity>

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
