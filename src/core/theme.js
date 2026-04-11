import { StyleSheet } from 'react-native';

export const COLORS = {
    primary: '#1A5276',
    primaryLight: '#2E86C1',
    secondary: '#2E4057',
    accent: '#F39C12',
    success: '#27AE60',
    danger: '#E74C3C',
    warning: '#F39C12',
    info: '#2980B9',
    background: '#F5F6FA',
    surface: '#FFFFFF',
    border: '#DDE1E7',
    textPrimary: '#1A1A2E',
    textSecondary: '#555E6E',
    textMuted: '#9AA3AF',
    textOnPrimary: '#FFFFFF',
    incomeGreen: '#27AE60',
    expenseRed: '#E74C3C',
    fuelOrange: '#E67E22',
};

export const FONTS = {
    sizes: { xs: 11, sm: 13, md: 15, lg: 17, xl: 20, xxl: 24 },
};

export const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const RADIUS = { sm: 6, md: 10, lg: 14, full: 999 };

export const SHADOWS = {
    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
};

export const globalStyles = StyleSheet.create({
    flex1: { flex: 1 },
    screen: { flex: 1, backgroundColor: COLORS.background },
    center: { alignItems: 'center', justifyContent: 'center' },
    row: { flexDirection: 'row', alignItems: 'center' },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        ...SHADOWS.card,
    },
});
