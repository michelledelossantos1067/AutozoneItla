import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import apiClient from '../../services/apiClient';

export default function DetalleCatalogo({ route }) {
  const { id } = route.params;
  const [data, setData] = useState(null);

  const obtenerDetalle = async () => {
    try {
      const response = await apiClient.get('/catalogo/detalle', {
        params: { id }
      });

      console.log('DETALLE:', response.data);

      setData(response.data.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    obtenerDetalle();
  }, []);

  if (!data) return <Text>Cargando...</Text>;

  return (
    <View>
      <Image source={{ uri: data.imagenUrl }} style={{ width: 200, height: 200 }} />
      <Text>{data.marca}</Text>
      <Text>{data.modelo}</Text>
      <Text>{data.precio}</Text>
      <Text>{data.descripcion}</Text>
    </View>
  );
}