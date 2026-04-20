import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../core/theme';

export default function FormGastoScreen() {
  return (
    <View style={s.screen}>
      <View style={s.container}>
        <Text style={s.title}>FormGastoScreen</Text>
        <Text style={s.sub}>Pendiente de implementación</Text>
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

  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,

    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },

  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 10
  },

  sub: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    textAlign: 'center'
  }
});