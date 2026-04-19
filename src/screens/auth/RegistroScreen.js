import React, { useState } from 'react';
import apiClient from '../../services/apiClient'
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { COLORS, FONTS } from '../../core/theme';

export default function RegistroScreen({ navigation }) {
  const [matricula, setMatricula] = useState('');
  const [loading, setLoading] = useState(false);

  
  const guardarRegistro = async () => {
    if (loading) return;



    try {

      if (!matricula.trim()) {

        console.log("Error: Debe de introducir data")
        return
      }


      setLoading(true);

      const data = {
        matricula: matricula
      };

      const response = await apiClient.post('/auth/registro',
        new URLSearchParams({
          datax: JSON.stringify(data)
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const tokenTemporal = response.data?.data?.token;

      console.log('Token temporal:', tokenTemporal);

      navigation.navigate('Auth', {
        screen: 'Activacion',
        params: { token: tokenTemporal }
      });



    } catch (error) {
      console.log(error.response?.data || error.message);
      alert('Error en registro');
    } finally {
      setLoading(false)
    }


  }

  return (
    <View style={s.screen}>
      <Text style={s.title}>RegistroScreen</Text>

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
            width: '100%',
            textAlign: 'center'
          }}
            placeholder='Introducir Matricula'
            value={matricula}
            onChangeText={setMatricula}
          ></TextInput>

        </View>

        <TouchableOpacity disabled={loading} onPress={guardarRegistro} style={s.TouchableOpacity}>
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
