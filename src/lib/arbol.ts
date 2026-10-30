/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import rawRules from '../data/reglas.json';

export type TipoCliente =
  | 'Hidrocarburos'
  | 'Aseguradora'
  | 'Firma de abogados'
  | 'Fondo de inversion';

export type Tamano = 'Pequena' | 'Mediana' | 'Grande';

export type UsoPrincipal =
  | 'Due diligence'
  | 'Suscripcion de polizas'
  | 'Litigio o defensa'
  | 'Monitoreo de portafolio'
  | 'Cumplimiento interno';

export type Frecuencia = 'Ocasional' | 'Mensual' | 'Semanal o diaria';

export type NumEmpresas = '1' | '2 a 10' | 'Mas de 10';

export type MadurezDigital = 'Baja' | 'Media' | 'Alta';

export interface PerfilCliente {
  tipo_cliente: TipoCliente;
  tamano: Tamano;
  uso_principal: UsoPrincipal;
  frecuencia: Frecuencia;
  num_empresas: NumEmpresas;
  madurez_digital: MadurezDigital;
}

export type VariableKey = keyof PerfilCliente;

export interface Condicion {
  variable: VariableKey;
  valores: string[];
}

export interface ReglaArbol {
  condiciones: Condicion[];
  recomendacion: string;
  n: number;
  probabilidades: Record<string, number>;
}

export interface ArbolesData {
  producto: ReglaArbol[];
  comunicacion: ReglaArbol[];
  precio: ReglaArbol[];
}

export const ARBOLES: ArbolesData = rawRules as unknown as ArbolesData;

// Visible text mappings for variable values
export const TEXTOS_VISIBLES: Record<VariableKey, Record<string, string>> = {
  tipo_cliente: {
    'Hidrocarburos': 'Hidrocarburos',
    'Aseguradora': 'Aseguradora',
    'Firma de abogados': 'Firma de abogados',
    'Fondo de inversion': 'Fondo de inversión',
  },
  tamano: {
    'Pequena': 'Pequeña',
    'Mediana': 'Mediana',
    'Grande': 'Grande',
  },
  uso_principal: {
    'Due diligence': 'Due diligence',
    'Suscripcion de polizas': 'Suscripción de pólizas',
    'Litigio o defensa': 'Litigio o defensa',
    'Monitoreo de portafolio': 'Monitoreo de portafolio',
    'Cumplimiento interno': 'Cumplimiento interno',
  },
  frecuencia: {
    'Ocasional': 'Ocasional',
    'Mensual': 'Mensual',
    'Semanal o diaria': 'Semanal o diaria',
  },
  num_empresas: {
    '1': '1',
    '2 a 10': '2 a 10',
    'Mas de 10': 'Más de 10',
  },
  madurez_digital: {
    'Baja': 'Baja',
    'Media': 'Media',
    'Alta': 'Alta',
  },
};

// Display names for recommendations
export const NOMBRES_RECOMENDACION: Record<string, string> = {
  'Reporte puntual': 'Reporte puntual',
  'Panel de monitoreo': 'Panel de monitoreo',
  'Integracion API': 'Integración API',
  'Contenido experto': 'Contenido experto',
  'Venta consultiva': 'Venta consultiva',
  'Email y gremios': 'Email y gremios',
  'Pago por consulta': 'Pago por consulta',
  'Suscripcion': 'Suscripción',
  'Licencia corporativa': 'Licencia corporativa',
};

// Business descriptions
export const DESCRIPCIONES_NEGOCIO: Record<string, string> = {
  'Reporte puntual':
    'Informe descargable del historial sancionatorio de una empresa específica, ideal para due diligence o un litigio puntual.',
  'Panel de monitoreo':
    'Tablero en línea con varias empresas vigiladas, alertas cuando la ANLA emite un nuevo acto sancionatorio e indicadores de riesgo ambiental.',
  'Integracion API':
    'Conexión directa de los datos sancionatorios a los sistemas del cliente (ERP, plataformas de suscripción, modelos de riesgo de portafolio).',
  'Contenido experto':
    'Marketing de contenidos en LinkedIn, webinars y white papers sobre riesgo ambiental y regulación ANLA.',
  'Venta consultiva':
    'Ejecutivo comercial asignado, demostración personalizada y propuesta a la medida.',
  'Email y gremios':
    'Campañas de email segmentadas y presencia en gremios y eventos sectoriales (asociaciones de petroleras, aseguradoras, colegios de abogados).',
  'Pago por consulta':
    'Se cobra cada reporte por separado; sin compromiso de permanencia.',
  'Suscripcion':
    'Plan mensual o anual con un número de consultas y empresas monitoreadas incluido.',
  'Licencia corporativa':
    'Contrato anual para toda la organización, con usuarios ilimitados, API y soporte dedicado.',
};

export interface ResultadoArbol {
  tipo: 'producto' | 'comunicacion' | 'precio';
  titulo: string;
  recomendacionRaw: string;
  recomendacionVisible: string;
  descripcion: string;
  confianzaPct: number;
  probabilidades: { clase: string; claseVisible: string; valor: number; pct: number }[];
  explicacionPorQue: string;
  n: number;
}

export interface ResultadoCompleto {
  producto: ResultadoArbol;
  comunicacion: ResultadoArbol;
  precio: ResultadoArbol;
  estrategiaSugerida: string;
}

/**
 * Traduce una variable evaluada a frase natural según el valor elegido por el usuario.
 */
function formatearFraseUsuarioPorVariable(
  variable: VariableKey,
  perfil: PerfilCliente
): string {
  const valor = perfil[variable];
  switch (variable) {
    case 'num_empresas':
      if (valor === '1') return 'analiza 1 empresa';
      if (valor === '2 a 10') return 'analiza 2 a 10 empresas';
      if (valor === 'Mas de 10') return 'analiza más de 10 empresas';
      return `analiza ${valor} empresas`;
    case 'frecuencia':
      if (valor === 'Ocasional') return 'consulta ocasionalmente';
      if (valor === 'Mensual') return 'consulta mensualmente';
      if (valor === 'Semanal o diaria') return 'consulta semanal o diariamente';
      return `consulta con frecuencia ${String(valor).toLowerCase()}`;
    case 'madurez_digital':
      if (valor === 'Baja') return 'su madurez digital es baja';
      if (valor === 'Media') return 'su madurez digital es media';
      if (valor === 'Alta') return 'su madurez digital es alta';
      return `su madurez digital es ${String(valor).toLowerCase()}`;
    case 'tamano':
      if (valor === 'Pequena') return 'la empresa es pequeña';
      if (valor === 'Mediana') return 'la empresa es mediana';
      if (valor === 'Grande') return 'la empresa es grande';
      return `la empresa es ${String(valor).toLowerCase()}`;
    case 'tipo_cliente':
      if (valor === 'Hidrocarburos') return 'pertenece al sector de Hidrocarburos';
      if (valor === 'Aseguradora') return 'su sector es Aseguradora';
      if (valor === 'Firma de abogados') return 'es una Firma de abogados';
      if (valor === 'Fondo de inversion') return 'es un Fondo de inversión';
      return `su sector es ${valor}`;
    case 'uso_principal':
      if (valor === 'Due diligence') return 'su uso principal es due diligence';
      if (valor === 'Suscripcion de polizas') return 'su uso principal es suscripción de pólizas';
      if (valor === 'Litigio o defensa') return 'su uso principal es litigio o defensa';
      if (valor === 'Monitoreo de portafolio') return 'su uso principal es monitoreo de portafolio';
      if (valor === 'Cumplimiento interno') return 'su uso principal es cumplimiento interno';
      return `su uso principal es ${String(valor).toLowerCase()}`;
    default:
      return `${variable} es ${valor}`;
  }
}

/**
 * Genera la explicación "¿Por qué?" a partir de las variables presentes en el camino de la regla,
 * mostrando únicamente el valor elegido por el usuario en frases fluidas y naturales.
 */
export function generarExplicacionPorQue(
  condiciones: Condicion[],
  perfil: PerfilCliente
): string {
  // Extraer variables únicas en el camino en orden de aparición
  const variablesVistas = new Set<VariableKey>();
  const variablesUnicas: VariableKey[] = [];
  for (const cond of condiciones) {
    if (!variablesVistas.has(cond.variable)) {
      variablesVistas.add(cond.variable);
      variablesUnicas.push(cond.variable);
    }
  }

  if (variablesUnicas.length === 0) {
    return 'Porque se ajusta al perfil base de clientes analizados.';
  }

  const frases = variablesUnicas.map((v) =>
    formatearFraseUsuarioPorVariable(v, perfil)
  );

  if (frases.length === 1) {
    return `Porque ${frases[0]}.`;
  }

  const todasMenosUltima = frases.slice(0, -1);
  const ultima = frases[frases.length - 1];
  return `Porque ${todasMenosUltima.join(', ')} y ${ultima}.`;
}

/**
 * Evalúa un único árbol de decisión.
 */
export function evaluarArbol(
  tipo: 'producto' | 'comunicacion' | 'precio',
  titulo: string,
  reglas: ReglaArbol[],
  perfil: PerfilCliente
): ResultadoArbol {
  const reglaCoincidente = reglas.find((regla) =>
    regla.condiciones.every((cond) => cond.valores.includes(perfil[cond.variable]))
  );

  if (!reglaCoincidente) {
    throw new Error(`Inconsistencia en árbol ${tipo}: no se encontró ninguna regla para el perfil dado.`);
  }

  const recRaw = reglaCoincidente.recomendacion;
  const recVisible = NOMBRES_RECOMENDACION[recRaw] || recRaw;
  const descripcion = DESCRIPCIONES_NEGOCIO[recRaw] || '';

  const probRecomendada = reglaCoincidente.probabilidades[recRaw] ?? 0;
  const confianzaPct = Math.round(probRecomendada * 1000) / 10;

  const probabilidades = Object.entries(reglaCoincidente.probabilidades).map(
    ([clase, val]) => ({
      clase,
      claseVisible: NOMBRES_RECOMENDACION[clase] || clase,
      valor: val,
      pct: Math.round(val * 1000) / 10,
    })
  );

  // Ordenar probabilidades de mayor a menor
  probabilidades.sort((a, b) => b.valor - a.valor);

  const explicacionPorQue = generarExplicacionPorQue(reglaCoincidente.condiciones, perfil);

  return {
    tipo,
    titulo,
    recomendacionRaw: recRaw,
    recomendacionVisible: recVisible,
    descripcion,
    confianzaPct,
    probabilidades,
    explicacionPorQue,
    n: reglaCoincidente.n,
  };
}

/**
 * Arma el párrafo unificado de estrategia sugerida con plantillas deterministas.
 */
export function construirEstrategiaSugerida(
  perfil: PerfilCliente,
  resProducto: ResultadoArbol,
  resComunicacion: ResultadoArbol,
  resPrecio: ResultadoArbol
): string {
  let sectorArticulo = '';
  let esMasculino = false;

  switch (perfil.tipo_cliente) {
    case 'Hidrocarburos':
      sectorArticulo = 'una empresa de Hidrocarburos';
      esMasculino = false;
      break;
    case 'Aseguradora':
      sectorArticulo = 'una Aseguradora';
      esMasculino = false;
      break;
    case 'Firma de abogados':
      sectorArticulo = 'una Firma de abogados';
      esMasculino = false;
      break;
    case 'Fondo de inversion':
      sectorArticulo = 'un Fondo de inversión';
      esMasculino = true;
      break;
  }

  let tamanoConcordado = '';
  if (perfil.tamano === 'Pequena') {
    tamanoConcordado = esMasculino ? 'pequeño' : 'pequeña';
  } else if (perfil.tamano === 'Mediana') {
    tamanoConcordado = esMasculino ? 'mediano' : 'mediana';
  } else {
    tamanoConcordado = 'grande';
  }

  const usoVisible = TEXTOS_VISIBLES.uso_principal[perfil.uso_principal];

  // Artículos para producto
  const prod = resProducto.recomendacionVisible;
  let prodConArticulo = `un ${prod}`;
  if (prod === 'Integración API') {
    prodConArticulo = 'una Integración API';
  } else if (prod === 'Suscripción') {
    prodConArticulo = 'una Suscripción';
  }

  // Comunicación
  const com = resComunicacion.recomendacionVisible;
  const comFrase = `llégale mediante ${com}`;

  // Precio
  const pre = resPrecio.recomendacionVisible;
  let preConArticulo = `propón ${pre}`;
  if (pre === 'Licencia corporativa') {
    preConArticulo = 'propón una Licencia corporativa';
  } else if (pre === 'Suscripción') {
    preConArticulo = 'propón una Suscripción mensual/anual';
  } else if (pre === 'Pago por consulta') {
    preConArticulo = 'propón el esquema de Pago por consulta';
  }

  return `Para ${sectorArticulo} ${tamanoConcordado} que realiza ${usoVisible}, ofrece ${prodConArticulo}, ${comFrase} y ${preConArticulo}.`;
}

/**
 * Evalúa los 3 árboles de decisión de forma completa.
 */
export function evaluarPerfilCompleto(perfil: PerfilCliente): ResultadoCompleto {
  const producto = evaluarArbol('producto', 'Producto', ARBOLES.producto, perfil);
  const comunicacion = evaluarArbol(
    'comunicacion',
    'Comunicación',
    ARBOLES.comunicacion,
    perfil
  );
  const precio = evaluarArbol('precio', 'Precio', ARBOLES.precio, perfil);

  const estrategiaSugerida = construirEstrategiaSugerida(
    perfil,
    producto,
    comunicacion,
    precio
  );

  return {
    producto,
    comunicacion,
    precio,
    estrategiaSugerida,
  };
}

/**
 * Lista de perfiles predeterminados realistas para el botón "Cargar ejemplo".
 */
export const EJEMPLOS_PREDEFINIDOS: { etiqueta: string; perfil: PerfilCliente }[] = [
  {
    etiqueta: 'Aseguradora multinacional',
    perfil: {
      tipo_cliente: 'Aseguradora',
      tamano: 'Grande',
      uso_principal: 'Suscripcion de polizas',
      frecuencia: 'Semanal o diaria',
      num_empresas: 'Mas de 10',
      madurez_digital: 'Alta',
    },
  },
  {
    etiqueta: 'Firma de abogados litigante',
    perfil: {
      tipo_cliente: 'Firma de abogados',
      tamano: 'Mediana',
      uso_principal: 'Litigio o defensa',
      frecuencia: 'Ocasional',
      num_empresas: '1',
      madurez_digital: 'Media',
    },
  },
  {
    etiqueta: 'Fondo de inversión de impacto',
    perfil: {
      tipo_cliente: 'Fondo de inversion',
      tamano: 'Pequena',
      uso_principal: 'Due diligence',
      frecuencia: 'Mensual',
      num_empresas: '2 a 10',
      madurez_digital: 'Alta',
    },
  },
  {
    etiqueta: 'Operador de Hidrocarburos',
    perfil: {
      tipo_cliente: 'Hidrocarburos',
      tamano: 'Grande',
      uso_principal: 'Cumplimiento interno',
      frecuencia: 'Mensual',
      num_empresas: '2 a 10',
      madurez_digital: 'Baja',
    },
  },
  {
    etiqueta: 'Boutique de asesoría ambiental',
    perfil: {
      tipo_cliente: 'Firma de abogados',
      tamano: 'Pequena',
      uso_principal: 'Monitoreo de portafolio',
      frecuencia: 'Ocasional',
      num_empresas: 'Mas de 10',
      madurez_digital: 'Baja',
    },
  },
];

export function obtenerEjemploAleatorio(): PerfilCliente {
  const index = Math.floor(Math.random() * EJEMPLOS_PREDEFINIDOS.length);
  return EJEMPLOS_PREDEFINIDOS[index].perfil;
}
