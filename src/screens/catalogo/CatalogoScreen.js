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
        }
      });

      console.log('RESPUESTA:', response.data);
      setLista(response.data.data || []);

    } catch (error) {
      console.log('ERROR:', error.response?.data || error.message);
    } finally {
      setLoading(false)
    };
  }

  useEffect(() => {
    obtenerCatalogo();
  }, []);

  return (
    <View style={s.screen}>
      <View style={s.container}>

        <View style={s.row}>
          <TextInput style={s.textinput} placeholder="Marca" onChangeText={setMarca} />
          <TextInput style={s.textinput} placeholder="Modelo" onChangeText={setModelo} />
        </View>

        <View style={s.column}>
          <TextInput style={s.textinput2} placeholder="Año" onChangeText={setAnio} />
          <TextInput style={s.textinput2} placeholder="Precio Min" onChangeText={setPrecioMin} />
          <TextInput style={s.textinput2} placeholder="Precio Max" onChangeText={setPrecioMax} />

          <TouchableOpacity onPress={obtenerCatalogo} style={s.button}>
            <Text style={s.sub}>Buscar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={lista}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('DetalleCatalogo', { id: item.id })}
              style={s.card}
            >
              <Image
                source={{ uri: item.imagenUrl }}
                style={s.image}
                resizeMode='contain'
              />

              <Text style={s.bold}>{item.marca}</Text>
              <Text>{item.modelo}</Text>
              <Text>{item.precio}</Text>
              <Text>{item.descripcionCorta}</Text>
              <Text><Text style={s.bold}>Fecha: </Text>{item.anio}</Text>
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