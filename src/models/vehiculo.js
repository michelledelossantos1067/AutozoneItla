export const fromJson = data => ({
  id: data?.id ?? null,
  placa: data?.placa ?? '',
  chasis: data?.chasis ?? '',
  marca: data?.marca ?? '',
  modelo: data?.modelo ?? '',
  anio: data?.anio ?? null,
  cantidadRuedas: data?.cantidadRuedas ?? data?.cantidad_ruedas ?? 4,
  fotoUrl: data?.fotoUrl ?? data?.foto_url ?? null,
  resumenFinanciero: data?.resumenFinanciero ? resumenFromJson(data.resumenFinanciero) : null,
});

export const resumenFromJson = r => ({
  totalMantenimientos: parseFloat(r?.totalMantenimientos ?? r?.total_mantenimientos ?? 0),
  totalCombustible: parseFloat(r?.totalCombustible ?? r?.total_combustible ?? 0),
  totalGastos: parseFloat(r?.totalGastos ?? r?.total_gastos ?? 0),
  totalIngresos: parseFloat(r?.totalIngresos ?? r?.total_ingresos ?? 0),
  balance: parseFloat(r?.balance ?? 0),
});

export const OPCIONES_RUEDAS = [
  { label: '2 ruedas', value: 2 },
  { label: '3 ruedas', value: 3 },
  { label: '4 ruedas', value: 4 },
  { label: '6 ruedas', value: 6 },
  { label: '8 ruedas', value: 8 },
];
