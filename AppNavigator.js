import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MantenimientosScreen from '../screens/mantenimientos/MantenimientosScreen';
import FormMantenimientoScreen from '../screens/mantenimientos/FormMantenimientoScreen';
import CombustibleScreen from '../screens/combustible/CombustibleScreen';
import FormCombustibleScreen from '../screens/combustible/FormCombustibleScreen';
import VehiculosScreen from '../screens/vehiculos/VehiculosScreen';
import FormVehiculoScreen from '../screens/vehiculos/FormVehiculoScreen';
import DetalleVehiculoScreen from '../screens/vehiculos/DetalleVehiculoScreen';
import GomasScreen from '../screens/gomas/GomasScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Mantenimientos" component={MantenimientosScreen} />
      <Stack.Screen name="FormMantenimiento" component={FormMantenimientoScreen} />
      <Stack.Screen name="Combustible" component={CombustibleScreen} />
      <Stack.Screen name="FormCombustible" component={FormCombustibleScreen} />

      <Stack.Screen name="Vehiculos" component={VehiculosScreen} />
      <Stack.Screen name="FormVehiculo" component={FormVehiculoScreen} />
      <Stack.Screen name="DetalleVehiculo" component={DetalleVehiculoScreen} />
      <Stack.Screen name="Gomas" component={GomasScreen} />
    </Stack.Navigator>
  );
}
