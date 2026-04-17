import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Modal } from 'react-native';
import { COLORS, FONTS } from '../../core/theme';

export default function CombustibleScreen() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vehiculo_id, setId] = useState('');
  const [visible, setVisible] = useState(false);
  const [tipo, setTipo] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState('');
  const [monto, setMonto] = useState('');

  const obtenerCombustibles = async () => {
    if (loading) return;

    if (!vehiculo_id) {
      alert('Ingrese un ID de vehículo');
      return;
    }

    try {

      setLoading(true);



      const response = await apiClient.get('/combustibles', {
        params: {
          vehiculo_id,
        }
      });

      console.log(response.data);

      setLista(response.data.data);

    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }

  const guardarCombustibles = async () => {
    if (loading) return;

    if (!vehiculo_id) {
      alert('Ingrese un ID de vehículo');
      return;
    }

    try {

      setLoading(true);

      const data = {
        vehiculo_id: vehiculo_id,
        tipo: tipo,
        cantidad: cantidad,
        unidad: unidad,
        monto: monto,
      };

      const response = await apiClient.post('/combustibles',
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

      setLista(response.data.data);

    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={s.screen}>

      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          Alert.alert('El modal ha sido cerrado.');
          setVisible(!visible);
        }}>
        <View style={s.centeredView}>
          <View style={s.modalView}>
            <Text >Registrar carga</Text>

            <TextInput keyboardType='numeric' placeholder='Introducir ID' value={vehiculo_id}
              onChangeText={setId}></TextInput>
            <TextInput placeholder='Tipo' value={tipo}
              onChangeText={setTipo}></TextInput>
            <TextInput placeholder='Cantidad' value={cantidad}
              onChangeText={setCantidad}></TextInput>
            <TextInput placeholder='Unidad' value={unidad}
              onChangeText={setUnidad}></TextInput>
            <TextInput placeholder='Monto' value={monto}
              onChangeText={setMonto}></TextInput>

            <TouchableOpacity onPress={guardarCombustibles}>
              <Text>Guardar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setVisible(!visible)}>
              <Text>Cerrar</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      <View style={{
        width: 360,
        height: 'auto',
        backgroundColor: 'white',
        borderWidth: 1.5,
        marginBottom: 35,
        alignItems: 'center'
      }}>


        <TextInput placeholder='Introducir vehiculo' onChangeText={setId}></TextInput>

        <TouchableOpacity onPress={() => setVisible(true)}>
          <Text>Prueba</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={obtenerCombustibles}>
          <Text>Prueba</Text>
        </TouchableOpacity>

        <FlatList style={{
          maxHeight: 650,
          alignContent: 'center',
          padding: 20,
          flexDirection: 'column'
        }}
          data={lista}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (

            <View style={{
              borderWidth: 2,
              marginBottom: 25,
              gap: 10,
              padding: 15
            }}>

              <Text><Text style={{ fontWeight: 'bold' }}>Tipo: </Text>{item.tipo}</Text>
              <Text><Text style={{ fontWeight: 'bold' }}>Cantidad: </Text>{item.cantidad} {item.unidad}</Text>
              <Text><Text style={{ fontWeight: 'bold' }}>Monto: </Text>{item.monto}</Text>
              <Text><Text style={{ fontWeight: 'bold' }}>Fecha: </Text>{item.fecha}</Text>

            </View>

          )}
        />

      </View>
    </View >
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary },
  sub: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, marginTop: 8 },
  TouchableOpacity: { backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginBottom: 10, width: '50%', borderRadius: 15, height: 40 },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
