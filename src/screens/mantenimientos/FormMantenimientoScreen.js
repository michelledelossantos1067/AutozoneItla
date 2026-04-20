import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../core/theme';

export default function FormMantenimientoScreen() {
  return (
    <View style={s.screen}>
      <View style={s.card}>
        <Text style={s.title}>Mantenimiento</Text>
        <Text style={s.sub}>Formulario pendiente de implementación</Text>
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
    padding: 20,
  },

  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 25,
    alignItems: 'center',

    // sombra moderna
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  title: {
    fontSize: FONTS.sizes.xl || 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },

  sub: {
    fontSize: FONTS.sizes.md || 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});