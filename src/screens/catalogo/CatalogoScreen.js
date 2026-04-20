import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import { COLORS, FONTS } from '../../core/theme';

export default function Catalogo({ navigation }) {
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [anio, setAnio] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);

  const obtenerCatalogo = async () => {
    if (loading) return;

    try {
      setLoading(true);

   
      const response = await apiClient.get('/catalogo', {
        params: {
          marca: marca,
          modelo: modelo,
          anio: anio,
          precioMin: precioMin,
          precioMax: precioMax
        }
      });

      setLista(response.data.data || []);
    } catch (error) {
      console.log('ERROR:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerCatalogo();
  }, []);

  return (
    <View style={s.screen}>
      <View style={s.container}>
        <Text style={s.title}>Catálogo de Vehículos</Text>

        <View style={s.filterSection}>
          <View style={s.row}>
            <TextInput style={s.textinput} placeholder="Marca" value={marca} onChangeText={setMarca} />
            <TextInput style={s.textinput} placeholder="Modelo" value={modelo} onChangeText={setModelo} />
          </View>

          <TextInput style={s.textinput2} placeholder="Año" keyboardType="numeric" value={anio} onChangeText={setAnio} />
          <View style={s.row}>
            <TextInput style={[s.textinput, {width: '48%'}]} placeholder="Min $" keyboardType="numeric" value={precioMin} onChangeText={setPrecioMin} />
            <TextInput style={[s.textinput, {width: '48%'}]} placeholder="Max $" keyboardType="numeric" value={precioMax} onChangeText={setPrecioMax} />
          </View>

          <TouchableOpacity onPress={obtenerCatalogo} style={s.button}>
            <Text style={s.sub}>{loading ? 'Buscando...' : 'Buscar Vehículos'}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={lista}
          style={{ width: '100%' }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('DetalleCatalogo', { id: item.id })}
              style={s.card}
            >
              <Image source={{ uri: item.imagenUrl }} style={s.image} resizeMode='cover' />
              <View style={s.cardInfo}>
                <Text style={s.cardTitle}>{item.marca} {item.modelo}</Text>
                <Text style={s.cardPrice}>${item.precio}</Text>
                <Text style={s.cardDesc} numberOfLines={2}>{item.descripcionCorta}</Text>
                <Text style={s.cardYear}>Año: {item.anio}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20
  },

  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 15,
    textAlign: 'center'
  },

  // 🔍 filtros
  filterSection: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,

    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },

  // 🔤 inputs
  textinput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginHorizontal: 3,
    color: COLORS.textPrimary,
    backgroundColor: "#fafafa"
  },

  textinput2: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: COLORS.textPrimary,
    backgroundColor: "#fafafa"
  },

  // 🔘 botón
  button: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',

    elevation: 2
  },

  sub: {
    fontSize: FONTS.sizes.md,
    color: "#fff",
    fontWeight: '600'
  },

  // 🚗 cards
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",

    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },

  image: {
    width: '100%',
    height: 160
  },

  cardInfo: {
    padding: 12
  },

  cardTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.textPrimary
  },

  cardPrice: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: 5
  },

  cardDesc: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: 5
  },

  cardYear: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: 5
  }
});