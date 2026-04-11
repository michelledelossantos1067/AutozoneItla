import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useAuth } from '../store/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS } from '../core/theme';
import { nombreCompleto } from '../models/usuario';

const MenuItem = ({ label, icon, onPress }) => (
    <TouchableOpacity style={s.item} onPress={onPress} activeOpacity={0.7}>
        <Text style={s.icon}>{icon}</Text>
        <Text style={s.label}>{label}</Text>
    </TouchableOpacity>
);

const Sep = () => <View style={s.sep} />;

export default function AppDrawerContent(props) {
    const { isLoggedIn, usuario, logout } = useAuth();
    const nav = props.navigation;

    const go = screen => {
        nav.navigate(screen);
        nav.closeDrawer();
    };

    const handleLogout = async () => {
        nav.closeDrawer();
        await logout();
    };

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={s.container}>
            <View style={s.header}>
                {isLoggedIn && usuario ? (
                    <>
                        {usuario.fotoUrl
                            ? <Image source={{ uri: usuario.fotoUrl }} style={s.avatar} />
                            : (
                                <View style={s.avatarPlaceholder}>
                                    <Text style={s.initials}>
                                        {(usuario.nombre?.[0] ?? '') + (usuario.apellido?.[0] ?? '')}
                                    </Text>
                                </View>
                            )
                        }
                        <Text style={s.name}>{nombreCompleto(usuario)}</Text>
                        <Text style={s.email}>{usuario.correo}</Text>
                    </>
                ) : (
                    <Text style={s.brand}>AutoZone ITLA</Text>
                )}
            </View>

            <MenuItem label="Inicio" icon="🏠" onPress={() => go('Home')} />
            <MenuItem label="Noticias" icon="📰" onPress={() => go('Noticias')} />
            <MenuItem label="Videos" icon="▶️" onPress={() => go('Videos')} />
            <MenuItem label="Catalogo" icon="🚘" onPress={() => go('Catalogo')} />
            <MenuItem label="Foro" icon="💬" onPress={() => go('Foro')} />
            <MenuItem label="Acerca De" icon="ℹ️" onPress={() => go('Acerca')} />

            <Sep />

            {isLoggedIn ? (
                <>
                    <MenuItem label="Mi Perfil" icon="👤" onPress={() => go('Perfil')} />
                    <MenuItem label="Mis Vehiculos" icon="🚗" onPress={() => go('Vehiculos')} />
                    <MenuItem label="Foro — Participar" icon="✍️" onPress={() => go('MisTemas')} />
                    <Sep />
                    <TouchableOpacity style={s.logout} onPress={handleLogout} activeOpacity={0.8}>
                        <Text style={s.logoutText}>Cerrar Sesion</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <MenuItem
                    label="Iniciar Sesion" icon="🔐"
                    onPress={() => { nav.closeDrawer(); nav.navigate('Login'); }}
                />
            )}
        </DrawerContentScrollView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.surface },
    header: {
        backgroundColor: COLORS.primary,
        padding: SPACING.xl,
        paddingTop: SPACING.xxl + 8,
        marginBottom: SPACING.sm,
    },
    brand: { color: '#fff', fontSize: FONTS.sizes.xl, fontWeight: '700' },
    avatar: { width: 60, height: 60, borderRadius: 30, marginBottom: SPACING.sm },
    avatarPlaceholder: {
        width: 60, height: 60, borderRadius: 30,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: SPACING.sm,
    },
    initials: { color: '#fff', fontSize: FONTS.sizes.xl, fontWeight: '700' },
    name: { color: '#fff', fontSize: FONTS.sizes.md, fontWeight: '600' },
    email: { color: 'rgba(255,255,255,0.75)', fontSize: FONTS.sizes.sm, marginTop: 2 },
    item: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg },
    icon: { fontSize: 18, marginRight: SPACING.md },
    label: { fontSize: FONTS.sizes.md, color: COLORS.textPrimary, fontWeight: '500' },
    sep: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.sm, marginHorizontal: SPACING.lg },
    logout: { margin: SPACING.lg, padding: SPACING.md, backgroundColor: '#FEE2E2', borderRadius: RADIUS.md, alignItems: 'center' },
    logoutText: { color: COLORS.danger, fontWeight: '700', fontSize: FONTS.sizes.md },
});
