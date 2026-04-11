import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { fromJson as usuarioFromJson } from '../models/usuario';

export const AUTH_ACTIONS = {
    RESTORE_SESSION: 'RESTORE_SESSION',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    UPDATE_USUARIO: 'UPDATE_USUARIO',
    SET_LOADING: 'SET_LOADING',
};

const initialState = {
    isLoading: true,
    isLoggedIn: false,
    usuario: null,
    token: null,
    refreshToken: null,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.SET_LOADING:
            return { ...state, isLoading: action.payload };

        case AUTH_ACTIONS.RESTORE_SESSION:
        case AUTH_ACTIONS.LOGIN:
            return {
                ...state,
                isLoading: false,
                isLoggedIn: true,
                usuario: action.payload.usuario,
                token: action.payload.token,
                refreshToken: action.payload.refreshToken,
            };

        case AUTH_ACTIONS.LOGOUT:
            return { ...initialState, isLoading: false };

        case AUTH_ACTIONS.UPDATE_USUARIO:
            return { ...state, usuario: { ...state.usuario, ...action.payload } };

        default:
            return state;
    }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        (async () => {
            try {
                const token = await SecureStore.getItemAsync('token');
                const refreshToken = await SecureStore.getItemAsync('refreshToken');
                const usuarioJson = await SecureStore.getItemAsync('usuario');
                if (token) {
                    dispatch({
                        type: AUTH_ACTIONS.RESTORE_SESSION,
                        payload: {
                            token,
                            refreshToken,
                            usuario: usuarioJson ? usuarioFromJson(JSON.parse(usuarioJson)) : null,
                        },
                    });
                    return;
                }
            } catch (_) { }
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        })();
    }, []);

    const login = async ({ token, refreshToken, usuario }) => {
        const parsed = usuarioFromJson(usuario);
        await SecureStore.setItemAsync('token', token);
        await SecureStore.setItemAsync('refreshToken', refreshToken);
        await SecureStore.setItemAsync('usuario', JSON.stringify(parsed));
        dispatch({ type: AUTH_ACTIONS.LOGIN, payload: { token, refreshToken, usuario: parsed } });
    };

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync('token');
            await SecureStore.deleteItemAsync('refreshToken');
            await SecureStore.deleteItemAsync('usuario');
        } catch (_) { }
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
    };

    const updateUsuario = async fields => {
        dispatch({ type: AUTH_ACTIONS.UPDATE_USUARIO, payload: fields });
        try {
            const raw = await SecureStore.getItemAsync('usuario');
            const prev = raw ? JSON.parse(raw) : {};
            await SecureStore.setItemAsync('usuario', JSON.stringify({ ...prev, ...fields }));
        } catch (_) { }
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout, updateUsuario, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
    return ctx;
};

export default AuthContext;
