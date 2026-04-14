import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONTS } from '../../core/theme';
import { useAuth } from '../../store/AuthContext';


export default function HomeScreen({ navigation }) {

  const { isLoggedIn, usuario } = useAuth();

  return (
    <ScrollView contentContainerStyle={s.screen}>
      <Text style={s.title}>AutoZone</Text>

      {isLoggedIn && usuario && (

        <>
          <Image source={{ uri: usuario.fotoUrl }}
            style={{ width: 80, height: 80, borderRadius: 40 }}></Image>

          <Text>{usuario.nombre}</Text>
        </>

      )}

      {!isLoggedIn && (
        <>
          <TouchableOpacity onPress={() => navigation.navigate('Auth', { screen: 'login ' })} style={s.TouchableOpacity}>
            <Text style={s.sub}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Auth', { screen: 'Registro' })} style={s.TouchableOpacity}>
            <Text style={s.sub}>Registro</Text>
          </TouchableOpacity>
        </>
      )}


      {isLoggedIn && (
        <>

          <TouchableOpacity onPress={() => navigation.navigate('Perfil')} style={s.TouchableOpacity}>
            <Text style={s.sub}>Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Vehiculos')} style={s.TouchableOpacity}>
            <Text style={s.sub}>Mis Vehiculos</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Mantenimientos')} style={s.TouchableOpacity}>
            <Text style={s.sub}>Mantenimiento</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Combustible')} style={s.TouchableOpacity}>
            <Text style={s.sub}>Combustible y Aceite</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Gomas')} style={s.TouchableOpacity}>
            <Text style={s.sub}>Estado de Gomas</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Gastos')} style={s.TouchableOpacity}>
            <Text style={s.sub}>Gastos e Ingresos</Text>
          </TouchableOpacity>
        </>
      )}


      <TouchableOpacity onPress={() => navigation.navigate('Noticias')} style={s.TouchableOpacity}>
        <Text style={s.sub}>Noticia</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Videos')} style={s.TouchableOpacity}>
        <Text style={s.sub}>Videos</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Catalogo')} style={s.TouchableOpacity}>
        <Text style={s.sub}>Catalogo</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ForoPublico')} style={s.TouchableOpacity}>
        <Text style={s.sub}>Foro</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Acerca')} style={s.TouchableOpacity}>
        <Text style={s.sub}>Acerca</Text>
      </TouchableOpacity>

      

    </ScrollView>

  );
}

const s = StyleSheet.create({
  screen: { flexGrow: 1, backgroundColor: COLORS.background, alignItems: 'center'},
  title: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary },
  sub: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, marginTop: 8 },
  TouchableOpacity: { backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 10, width: 175, borderRadius: 15, height: 40 }
});
