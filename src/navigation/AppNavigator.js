import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { useAuth } from '../store/AuthContext';
import { COLORS } from '../core/theme';

import LoginScreen from '../screens/auth/LoginScreen';
import RegistroScreen from '../screens/auth/RegistroScreen';
import ActivacionScreen from '../screens/auth/ActivacionScreen';
import RecuperarScreen from '../screens/auth/RecuperarScreen';
import HomeScreen from '../screens/home/HomeScreen';
import NoticiasScreen from '../screens/noticias/NoticiasScreen';
import VideosScreen from '../screens/videos/VideosScreen';
import CatalogoScreen from '../screens/catalogo/CatalogoScreen';
import ForoScreen from '../screens/foro/ForoScreen';
import AcercaScreen from '../screens/acerca/AcercaScreen';
import PerfilScreen from '../screens/perfil/PerfilScreen';
import VehiculosScreen from '../screens/vehiculos/VehiculosScreen';
import FormVehiculoScreen from '../screens/vehiculos/FormVehiculoScreen';
import DetalleVehiculoScreen from '../screens/vehiculos/DetalleVehiculoScreen';
import GomasScreen from '../screens/gomas/GomasScreen';
import MantenimientosScreen from '../screens/mantenimientos/MantenimientosScreen';
import FormMantenimientoScreen from '../screens/mantenimientos/FormMantenimientoScreen';
import DetalleMantenimientoScreen from '../screens/mantenimientos/DetalleMantenimientoScreen';
import CombustibleScreen from '../screens/combustible/CombustibleScreen';
import FormCombustibleScreen from '../screens/combustible/FormCombustibleScreen';
import GastosScreen from '../screens/gastos/GastosScreen';
import FormGastoScreen from '../screens/gastos/FormGastoScreen';
import IngresosScreen from '../screens/ingresos/IngresosScreen';
import FormIngresoScreen from '../screens/ingresos/FormIngresoScreen';
import DetalleNoticiaScreen from '../screens/noticias/DetalleNoticiaScreen';
import DetalleCatalogoScreen from '../screens/catalogo/DetalleCatalogoScreen';
import DetalleForoScreen from '../screens/foro/DetalleForoScreen';
import CrearTemaScreen from '../screens/foro/CrearTemaScreen';
import MisTemasScreen from '../screens/foro/MisTemasScreen';

const RootStack = createStackNavigator();
const Stack = createStackNavigator();


const RootNavigator = () => {
    const { isLoggedIn } = useAuth();

    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>

      
            <RootStack.Screen name="Main" component={MainStack} />

            {!isLoggedIn && (
                <RootStack.Screen name="Auth" component={AuthStack} />
            )}

        </RootStack.Navigator>
    );
};

const HEADER = {
    headerStyle: { backgroundColor: COLORS.primary },
    headerTintColor: COLORS.textOnPrimary,
    headerTitleStyle: { fontWeight: '600' },
};

const AuthStack = () => (


    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registro" component={RegistroScreen} />
        <Stack.Screen name="Activacion" component={ActivacionScreen} />
        <Stack.Screen name="Recuperar" component={RecuperarScreen} />
    </Stack.Navigator>
);

const MainStack = () => (
    <Stack.Navigator screenOptions={HEADER}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'AutoZone ITLA' }} />
        <Stack.Screen name="Noticias" component={NoticiasScreen} options={{ title: 'Noticias' }} />
        <Stack.Screen name="DetalleNoticia" component={DetalleNoticiaScreen} options={{ title: 'Noticia' }} />
        <Stack.Screen name="Videos" component={VideosScreen} options={{ title: 'Videos' }} />
        <Stack.Screen name="Catalogo" component={CatalogoScreen} options={{ title: 'Catalogo' }} />
        <Stack.Screen name="DetalleCatalogo" component={DetalleCatalogoScreen} options={{ title: 'Detalle' }} />
        <Stack.Screen name="Foro" component={ForoScreen} options={{ title: 'Foro' }} />
        <Stack.Screen name="DetalleForo" component={DetalleForoScreen} options={{ title: 'Tema' }} />
        <Stack.Screen name="Acerca" component={AcercaScreen} options={{ title: 'Acerca De' }} />
        <Stack.Screen name="Perfil" component={PerfilScreen} options={{ title: 'Mi Perfil' }} />
        <Stack.Screen name="Vehiculos" component={VehiculosScreen} options={{ title: 'Mis Vehiculos' }} />
        <Stack.Screen name="FormVehiculo" component={FormVehiculoScreen} options={{ title: 'Vehiculo' }} />
        <Stack.Screen name="DetalleVehiculo" component={DetalleVehiculoScreen} options={{ title: 'Detalle' }} />
        <Stack.Screen name="Gomas" component={GomasScreen} options={{ title: 'Gomas' }} />
        <Stack.Screen name="Mantenimientos" component={MantenimientosScreen} options={{ title: 'Mantenimientos' }} />
        <Stack.Screen name="FormMantenimiento" component={FormMantenimientoScreen} options={{ title: 'Mantenimiento' }} />
        <Stack.Screen name="DetalleMantenimiento" component={DetalleMantenimientoScreen} options={{ title: 'Detalle' }} />
        <Stack.Screen name="Combustible" component={CombustibleScreen} options={{ title: 'Combustible' }} />
        <Stack.Screen name="FormCombustible" component={FormCombustibleScreen} options={{ title: 'Nuevo Registro' }} />
        <Stack.Screen name="Gastos" component={GastosScreen} options={{ title: 'Gastos' }} />
        <Stack.Screen name="FormGasto" component={FormGastoScreen} options={{ title: 'Nuevo Gasto' }} />
        <Stack.Screen name="Ingresos" component={IngresosScreen} options={{ title: 'Ingresos' }} />
        <Stack.Screen name="FormIngreso" component={FormIngresoScreen} options={{ title: 'Nuevo Ingreso' }} />
        <Stack.Screen name="CrearTema" component={CrearTemaScreen} options={{ title: 'Nuevo Tema' }} />
        <Stack.Screen name="MisTemas" component={MisTemasScreen} options={{ title: 'Mis Temas' }} />
    </Stack.Navigator>
);


export default function AppNavigator() {
    const { isLoggedIn, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <RootNavigator />
        </NavigationContainer>
    );
}