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
  screen: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
  container: { width: 350, height: '95%', backgroundColor: 'white', borderWidth: 1.5, marginTop: 20, padding: 20, alignItems: 'center' },
  row: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  column: { gap: 5, alignItems: 'center' },
  button: { backgroundColor: COLORS.primaryLight, width: 305, justifyContent: 'center', alignItems: 'center', borderRadius: 5, height: 40 },
  sub: { fontSize: FONTS.sizes.sm, color: 'white' },
  textinput: { color: 'black', borderWidth: 1, width: '50%', borderRadius: 3, textAlign: 'center' },
  textinput2: { color: 'black', borderWidth: 1, width: 305, borderRadius: 3, textAlign: 'center' },
  card: { borderWidth: 2, marginBottom: 20, padding: 15 },
  image: { width: '100%', height: 150 },
  bold: { fontWeight: 'bold' }
});