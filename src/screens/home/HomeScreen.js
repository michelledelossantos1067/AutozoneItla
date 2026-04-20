import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';

import { COLORS, FONTS } from '../../core/theme';
import { useAuth } from '../../store/AuthContext';
import CarSlider from '../../components/CarSlider';

export default function HomeScreen({ navigation }) {
  const { isLoggedIn, usuario } = useAuth();

  return (
    <ScrollView contentContainerStyle={s.screen}>
      <Text style={s.title}>AutoZone</Text>


      {isLoggedIn && usuario && (
        <>
          <Image source={{ uri: usuario.fotoUrl }} style={s.avatar} />
          <Text style={s.username}>{usuario.nombre}</Text>


          <CarSlider />
        </>
      )}


      <View style={s.menuContainer}>

        {!isLoggedIn && (
          <>
            <TouchableOpacity
              style={[s.button, s.primaryButton]}
              onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
            >
              <Text style={[s.buttonText, s.primaryButtonText]}>
                Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.button}
              onPress={() => navigation.navigate('Auth', { screen: 'Registro' })}
            >
              <Text style={s.buttonText}>
                Registro
              </Text>
            </TouchableOpacity>
          </>
        )}

        {isLoggedIn && (
          <>
            <TouchableOpacity
              style={s.button}
              onPress={() => navigation.navigate('Perfil')}
            >
              <Text style={s.buttonText}>Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.button}
              onPress={() => navigation.navigate('Vehiculos')}
            >
              <Text style={s.buttonText}>Mis Vehículos</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={s.button}
          onPress={() => navigation.navigate('Noticias')}
        >
          <Text style={s.buttonText}>Noticias</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.button}
          onPress={() => navigation.navigate('Videos')}
        >
          <Text style={s.buttonText}>Videos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.button}
          onPress={() => navigation.navigate('Catalogo')}
        >
          <Text style={s.buttonText}>Catálogo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.button}
          onPress={() => navigation.navigate('Foro')}
        >
          <Text style={s.buttonText}>Foro</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.button}
          onPress={() => navigation.navigate('Acerca')}
        >
          <Text style={s.buttonText}>Acerca</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16
  },

  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 15
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginTop: 10,
    borderWidth: 2,
    borderColor: COLORS.primary
  },

  username: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    marginTop: 10,
    marginBottom: 15,
    fontWeight: '600'
  },

  menuContainer: {
    width: '100%',
    marginTop: 10,
    alignItems: 'center'
  },

  button: {
    width: '92%',
    height: 50,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,

    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },

  primaryButton: {
    backgroundColor: COLORS.primary
  },

  buttonText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    fontWeight: '600'
  },

  primaryButtonText: {
    color: "#fff"
  }
});