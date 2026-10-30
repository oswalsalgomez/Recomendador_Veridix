/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  Layers,
  Cpu,
  FileText,
  LayoutDashboard,
  Users,
  Mail,
  BookOpen,
  CreditCard,
  Calendar,
  Building,
  Target,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import {
  PerfilCliente,
  TipoCliente,
  Tamano,
  UsoPrincipal,
  Frecuencia,
  NumEmpresas,
  MadurezDigital,
  TEXTOS_VISIBLES,
  evaluarPerfilCompleto,
  obtenerEjemploAleatorio,
  ResultadoCompleto,
  ResultadoArbol,
} from './lib/arbol';

// Helper for rendering class-specific icon
function getRecomendacionIcon(clase: string, className = 'w-5 h-5') {
  switch (clase) {
    case 'Reporte puntual':
      return <FileText className={className} />;
    case 'Panel de monitoreo':
      return <LayoutDashboard className={className} />;
    case 'Integracion API':
      return <Cpu className={className} />;
    case 'Contenido experto':
      return <BookOpen className={className} />;
    case 'Venta consultiva':
      return <Users className={className} />;
    case 'Email y gremios':
      return <Mail className={className} />;
    case 'Pago por consulta':
      return <CreditCard className={className} />;
    case 'Suscripcion':
      return <Calendar className={className} />;
    case 'Licencia corporativa':
      return <Building className={className} />;
    default:
      return <Layers className={className} />;
  }
}

// Colors for tree categories
const CATEGORY_STYLES = {
  producto: {
    accent: '#14532d',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    barClass: 'bg-emerald-700',
    iconBg: 'bg-emerald-100 text-emerald-900',
    headerBg: 'from-emerald-50 to-white',
  },
  comunicacion: {
    accent: '#1e3a8a',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    barClass: 'bg-blue-700',
    iconBg: 'bg-blue-100 text-blue-900',
    headerBg: 'from-blue-50 to-white',
  },
  precio: {
    accent: '#78350f',
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
    barClass: 'bg-amber-600',
    iconBg: 'bg-amber-100 text-amber-900',
    headerBg: 'from-amber-50 to-white',
  },
};

export default function App() {
  const [perfil, setPerfil] = useState<Partial<PerfilCliente>>({});
  const [resultado, setResultado] = useState<ResultadoCompleto | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [mostrarSobreModelo, setMostrarSobreModelo] = useState(false);
  const [activoEjemploAnim, setActivoEjemploAnim] = useState(false);

  const resultadosRef = useRef<HTMLDivElement>(null);

  // Check if all 6 questions have answers
  const formCompleto = Boolean(
    perfil.tipo_cliente &&
      perfil.tamano &&
      perfil.uso_principal &&
      perfil.frecuencia &&
      perfil.num_empresas &&
      perfil.madurez_digital
  );

  const handleSeleccionar = <K extends keyof PerfilCliente>(
    clave: K,
    valor: PerfilCliente[K]
  ) => {
    setPerfil((prev) => ({
      ...prev,
      [clave]: valor,
    }));
  };

  const handleGenerar = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formCompleto) return;
    const res = evaluarPerfilCompleto(perfil as PerfilCliente);
    setResultado(res);

    // Smooth scroll to results
    setTimeout(() => {
      resultadosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCargarEjemplo = () => {
    const ejemplo = obtenerEjemploAleatorio();
    setPerfil(ejemplo);
    setActivoEjemploAnim(true);
    setTimeout(() => setActivoEjemploAnim(false), 500);

    // Auto calculate recommendation for convenience
    const res = evaluarPerfilCompleto(ejemplo);
    setResultado(res);

    setTimeout(() => {
      resultadosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleLimpiar = () => {
    setPerfil({});
    setResultado(null);
  };

  const handleCopiarEstrategia = () => {
    if (!resultado) return;
    navigator.clipboard.writeText(resultado.estrategiaSugerida);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 pb-16 font-sans">
      {/* Header */}
      <header className="bg-[#14532d] text-white shadow-md border-b border-[#0f3f22]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start sm:items-center space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center shadow-inner shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    Veridix · Recomendador comercial
                  </h1>
                  <span className="text-[11px] font-semibold uppercase tracking-wider bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 px-2 py-0.5 rounded-full">
                    Motor ANLA · rpart
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-100/90 mt-0.5">
                  Árboles de decisión para producto, comunicación y precio
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs bg-emerald-950/40 px-3.5 py-1.5 rounded-lg border border-emerald-800/60 text-emerald-200/90">
              <Info className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <span>Inteligencia sancionatoria ambiental (Colombia)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Intro Context Banner */}
        <div className="mb-8 bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-[#14532d]" />
              Segmentación comercial automatizada
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">
              Selecciona las características del cliente potencial para determinar al instante la oferta óptima basada en el análisis de actos administrativos sancionatorios de la ANLA. Los modelos se ejecutan en local de forma inmediata.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCargarEjemplo}
            className={`cursor-pointer inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-medium px-4 py-2.5 rounded-lg border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 transition shadow-xs shrink-0 ${
              activoEjemploAnim ? 'ring-2 ring-emerald-600 scale-95' : ''
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-700" />
            Cargar ejemplo aleatorio
          </button>
        </div>

        {/* Formulario: "Perfil del cliente" */}
        <section aria-labelledby="form-heading" className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4 mb-6">
            <div>
              <h2 id="form-heading" className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#14532d]" />
                Perfil del cliente
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Responde las 6 preguntas obligatorias mediante los botones de selección
              </p>
            </div>
            {Object.keys(perfil).length > 0 && (
              <button
                type="button"
                onClick={handleLimpiar}
                className="cursor-pointer text-xs font-medium text-stone-500 hover:text-stone-800 flex items-center gap-1 self-start sm:self-auto py-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Limpiar respuestas
              </button>
            )}
          </div>

          <form onSubmit={handleGenerar} className="space-y-6 sm:space-y-7">
            {/* 1. Sector del cliente */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-semibold text-stone-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#14532d] flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  Sector del cliente
                </label>
                <span className="text-[11px] text-stone-400">tipo_cliente</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    'Hidrocarburos',
                    'Aseguradora',
                    'Firma de abogados',
                    'Fondo de inversion',
                  ] as TipoCliente[]
                ).map((val) => {
                  const seleccionado = perfil.tipo_cliente === val;
                  const label = TEXTOS_VISIBLES.tipo_cliente[val];
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleSeleccionar('tipo_cliente', val)}
                      className={`cursor-pointer px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-150 flex items-center gap-1.5 ${
                        seleccionado
                          ? 'bg-[#14532d] text-white border-[#14532d] shadow-sm ring-2 ring-emerald-600/30'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {seleccionado && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Tamaño de la empresa */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-semibold text-stone-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#14532d] flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  Tamaño de la empresa
                </label>
                <span className="text-[11px] text-stone-400">tamano</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['Pequena', 'Mediana', 'Grande'] as Tamano[]).map((val) => {
                  const seleccionado = perfil.tamano === val;
                  const label = TEXTOS_VISIBLES.tamano[val];
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleSeleccionar('tamano', val)}
                      className={`cursor-pointer px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-150 flex items-center gap-1.5 ${
                        seleccionado
                          ? 'bg-[#14532d] text-white border-[#14532d] shadow-sm ring-2 ring-emerald-600/30'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {seleccionado && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Uso principal de la información */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-semibold text-stone-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#14532d] flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  Uso principal de la información
                </label>
                <span className="text-[11px] text-stone-400">uso_principal</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    'Due diligence',
                    'Suscripcion de polizas',
                    'Litigio o defensa',
                    'Monitoreo de portafolio',
                    'Cumplimiento interno',
                  ] as UsoPrincipal[]
                ).map((val) => {
                  const seleccionado = perfil.uso_principal === val;
                  const label = TEXTOS_VISIBLES.uso_principal[val];
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleSeleccionar('uso_principal', val)}
                      className={`cursor-pointer px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-150 flex items-center gap-1.5 ${
                        seleccionado
                          ? 'bg-[#14532d] text-white border-[#14532d] shadow-sm ring-2 ring-emerald-600/30'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {seleccionado && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Frecuencia de consulta */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-semibold text-stone-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#14532d] flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  Frecuencia de consulta
                </label>
                <span className="text-[11px] text-stone-400">frecuencia</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['Ocasional', 'Mensual', 'Semanal o diaria'] as Frecuencia[]).map(
                  (val) => {
                    const seleccionado = perfil.frecuencia === val;
                    const label = TEXTOS_VISIBLES.frecuencia[val];
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleSeleccionar('frecuencia', val)}
                        className={`cursor-pointer px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-150 flex items-center gap-1.5 ${
                          seleccionado
                            ? 'bg-[#14532d] text-white border-[#14532d] shadow-sm ring-2 ring-emerald-600/30'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        {seleccionado && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                        {label}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* 5. Número de empresas a analizar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-semibold text-stone-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#14532d] flex items-center justify-center text-xs font-bold">
                    5
                  </span>
                  Número de empresas a analizar
                </label>
                <span className="text-[11px] text-stone-400">num_empresas</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['1', '2 a 10', 'Mas de 10'] as NumEmpresas[]).map((val) => {
                  const seleccionado = perfil.num_empresas === val;
                  const label = TEXTOS_VISIBLES.num_empresas[val];
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleSeleccionar('num_empresas', val)}
                      className={`cursor-pointer px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-150 flex items-center gap-1.5 ${
                        seleccionado
                          ? 'bg-[#14532d] text-white border-[#14532d] shadow-sm ring-2 ring-emerald-600/30'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {seleccionado && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Madurez digital del equipo */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-semibold text-stone-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#14532d] flex items-center justify-center text-xs font-bold">
                    6
                  </span>
                  Madurez digital del equipo
                </label>
                <span className="text-[11px] text-stone-400">madurez_digital</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['Baja', 'Media', 'Alta'] as MadurezDigital[]).map((val) => {
                  const seleccionado = perfil.madurez_digital === val;
                  const label = TEXTOS_VISIBLES.madurez_digital[val];
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleSeleccionar('madurez_digital', val)}
                      className={`cursor-pointer px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-150 flex items-center gap-1.5 ${
                        seleccionado
                          ? 'bg-[#14532d] text-white border-[#14532d] shadow-sm ring-2 ring-emerald-600/30'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {seleccionado && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={!formCompleto}
                className={`cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  formCompleto
                    ? 'bg-[#14532d] hover:bg-[#0e3d20] text-white shadow-md hover:shadow-lg active:scale-98'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-200'
                }`}
              >
                <span>Generar recomendación</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleCargarEjemplo}
                className="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 transition"
              >
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Cargar ejemplo</span>
              </button>

              {!formCompleto && (
                <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200 w-full sm:w-auto">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  <span>
                    Faltan {6 - Object.keys(perfil).length} pregunta(s) por responder.
                  </span>
                </div>
              )}
            </div>
          </form>
        </section>

        {/* Resultados */}
        <div ref={resultadosRef}>
          {resultado && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-[#14532d]" />
                    Recomendaciones comerciales
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                    Resultados generados por los árboles de decisión según el perfil seleccionado
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopiarEstrategia}
                  className="cursor-pointer hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 shadow-xs transition"
                >
                  {copiado ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-500" />
                      <span>Copiar resumen</span>
                    </>
                  )}
                </button>
              </div>

              {/* 3 Tarjetas: Producto · Comunicación · Precio */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. Producto */}
                <TarjetaRecomendacion
                  resultado={resultado.producto}
                  tipo="producto"
                  estilos={CATEGORY_STYLES.producto}
                />

                {/* 2. Comunicación */}
                <TarjetaRecomendacion
                  resultado={resultado.comunicacion}
                  tipo="comunicacion"
                  estilos={CATEGORY_STYLES.comunicacion}
                />

                {/* 3. Precio */}
                <TarjetaRecomendacion
                  resultado={resultado.precio}
                  tipo="precio"
                  estilos={CATEGORY_STYLES.precio}
                />
              </div>

              {/* Estrategia Sugerida */}
              <div className="bg-gradient-to-r from-emerald-900 via-[#14532d] to-emerald-950 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-emerald-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                      <Target className="w-4 h-4" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-emerald-50">
                      Estrategia sugerida
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopiarEstrategia}
                    className="cursor-pointer self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-800/60 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 transition"
                  >
                    {copiado ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Copiado al portapapeles</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar estrategia</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-sm sm:text-base text-emerald-50 font-normal leading-relaxed bg-emerald-950/40 border border-emerald-700/50 rounded-xl p-4 sm:p-5">
                  "{resultado.estrategiaSugerida}"
                </p>

                <div className="mt-4 pt-3 border-t border-emerald-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-200/80">
                  <span>
                    Perfil evaluado:{' '}
                    <strong>{TEXTOS_VISIBLES.tipo_cliente[perfil.tipo_cliente!]}</strong> (
                    {TEXTOS_VISIBLES.tamano[perfil.tamano!]}) ·{' '}
                    {TEXTOS_VISIBLES.num_empresas[perfil.num_empresas!]} empresas
                  </span>
                  <span className="text-emerald-300 font-medium">
                    Ejecución determinista en cliente (sin latencia de red)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sección "Sobre el modelo" (Plegable) */}
        <section className="mt-12 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setMostrarSobreModelo(!mostrarSobreModelo)}
            className="cursor-pointer w-full px-6 py-5 flex items-center justify-between bg-stone-50/70 hover:bg-stone-50 transition border-b border-stone-100 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-stone-200/70 text-stone-700 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-stone-900">
                  Sobre el modelo y metodología
                </h3>
                <p className="text-xs text-stone-500">
                  Entrenamiento en R con <code className="text-emerald-800 font-mono">rpart</code>, base sintética de 900 clientes y métricas de exactitud
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-stone-500">
              <span className="text-xs font-semibold hidden sm:inline">
                {mostrarSobreModelo ? 'Ocultar detalles' : 'Ver detalles'}
              </span>
              {mostrarSobreModelo ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </button>

          {mostrarSobreModelo && (
            <div className="p-6 sm:p-8 space-y-6 text-sm text-stone-700 border-t border-stone-100 animate-fadeIn">
              <div className="prose prose-stone max-w-none text-xs sm:text-sm text-stone-600 leading-relaxed">
                <p>
                  Los tres árboles de decisión fueron entrenados en el lenguaje estadístico <strong>R</strong> utilizando el paquete{' '}
                  <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-800 font-mono text-xs">
                    rpart
                  </code>{' '}
                  (Recursive Partitioning and Regression Trees) sobre una base sintética de{' '}
                  <strong>900 clientes</strong>, dividida aleatoriamente en{' '}
                  <strong>450 clientes de entrenamiento</strong> y <strong>450 clientes de prueba</strong>.
                </p>
              </div>

              {/* Tabla de Exactitud */}
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-800" />
                  Exactitud (Accuracy) en la base de prueba (450 casos de evaluación)
                </h4>
                <div className="overflow-x-auto rounded-xl border border-stone-200">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider text-[11px] border-b border-stone-200">
                      <tr>
                        <th className="py-3 px-4 font-semibold">Árbol de decisión</th>
                        <th className="py-3 px-4 font-semibold">Exactitud en prueba</th>
                        <th className="py-3 px-4 font-semibold">Variables más importantes</th>
                        <th className="py-3 px-4 font-semibold">Clases resultantes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 bg-white">
                      <tr>
                        <td className="py-3 px-4 font-semibold text-stone-900 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                          Producto
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                          75,6 %
                        </td>
                        <td className="py-3 px-4 text-stone-600">
                          Número de empresas, frecuencia
                        </td>
                        <td className="py-3 px-4 text-stone-500 text-xs">
                          Reporte puntual, Panel de monitoreo, Integración API
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-stone-900 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                          Comunicación
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-blue-800">
                          77,6 %
                        </td>
                        <td className="py-3 px-4 text-stone-600">
                          Tamaño, madurez digital
                        </td>
                        <td className="py-3 px-4 text-stone-500 text-xs">
                          Contenido experto, Venta consultiva, Email y gremios
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-stone-900 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                          Precio
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-amber-800">
                          74,2 %
                        </td>
                        <td className="py-3 px-4 text-stone-600">
                          Frecuencia, tamaño
                        </td>
                        <td className="py-3 px-4 text-stone-500 text-xs">
                          Pago por consulta, Suscripción, Licencia corporativa
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Grid explicativo de variables */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                  <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs sm:text-sm mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-700"></span>
                    Árbol de Producto
                  </div>
                  <p className="text-xs text-stone-600">
                    Segmenta principalmente según el <strong>volumen de empresas</strong> a consultar y la <strong>frecuencia</strong>. Por ejemplo, para clientes con más de 10 empresas y alta madurez digital se recomienda Integración API (76 % a 84 % de probabilidad según la frecuencia).
                  </p>
                </div>

                <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                  <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs sm:text-sm mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-700"></span>
                    Árbol de Comunicación
                  </div>
                  <p className="text-xs text-stone-600">
                    El <strong>tamaño de la organización</strong> es clave: a las empresas Grandes se les recomienda Venta consultiva (73 % de probabilidad), mientras que a empresas Medianas y Pequeñas se les suele sugerir Contenido experto o Email y gremios según su madurez digital y sector.
                  </p>
                </div>

                <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                  <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs sm:text-sm mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-700"></span>
                    Árbol de Precio
                  </div>
                  <p className="text-xs text-stone-600">
                    La <strong>frecuencia de consulta</strong> y el <strong>tamaño</strong> orientan el esquema: para consultas ocasionales suele predominar Pago por consulta (80 % de probabilidad); en empresas grandes se propone Licencia corporativa cuando analizan más de 10 empresas o consultan semanalmente (67 % a 78 % de probabilidad); si consultan mensualmente pocas empresas, se recomienda Suscripción.
                  </p>
                </div>
              </div>

              {/* Nota académica */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <strong className="font-semibold">Nota:</strong> Datos sintéticos con fines académicos.
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 text-center text-xs text-stone-500">
        <p>
          Veridix · Recomendador comercial para actos sancionatorios ambientales (ANLA, Colombia).
        </p>
        <p className="mt-1 text-stone-400">
          Ejecución estática en navegador con React + Vite + TypeScript + Tailwind CSS.
        </p>
      </footer>
    </div>
  );
}

// Subcomponent for each recommendation card (Producto, Comunicación, Precio)
function TarjetaRecomendacion({
  resultado,
  tipo,
  estilos,
}: {
  resultado: ResultadoArbol;
  tipo: 'producto' | 'comunicacion' | 'precio';
  estilos: (typeof CATEGORY_STYLES)['producto'];
}) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden">
      <div>
        {/* Card Header */}
        <div className={`p-5 sm:p-6 bg-gradient-to-b ${estilos.headerBg} border-b border-stone-100`}>
          <div className="flex items-center justify-between mb-3">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${estilos.badgeBg}`}
            >
              {resultado.titulo}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Basado en <strong className="text-stone-800">{resultado.n}</strong> clientes similares
            </span>
          </div>

          <div className="flex items-center gap-3 mt-1">
            <div className={`w-11 h-11 rounded-xl ${estilos.iconBg} flex items-center justify-center shrink-0 shadow-xs`}>
              {getRecomendacionIcon(resultado.recomendacionRaw, 'w-6 h-6')}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight leading-tight">
                {resultado.recomendacionVisible}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-semibold text-stone-600">Confianza:</span>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {resultado.confianzaPct}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Descripción de Negocio */}
          <div className="space-y-1">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Descripción
            </p>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {resultado.descripcion}
            </p>
          </div>

          {/* Distribución de Probabilidades (Barra horizontal) */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-700 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-stone-400" />
                Probabilidades por clase
              </span>
              <span className="text-stone-400 text-[11px]">rpart hojas</span>
            </div>

            {/* Barra apilada o lista de barras */}
            <div className="space-y-1.5">
              {resultado.probabilidades.map((item, idx) => {
                const esRecomendada = item.clase === resultado.recomendacionRaw;
                return (
                  <div key={item.clase} className="space-y-0.5">
                    <div className="flex justify-between items-center text-xs">
                      <span
                        className={`truncate ${
                          esRecomendada ? 'font-bold text-stone-900' : 'text-stone-500'
                        }`}
                      >
                        {item.claseVisible}
                      </span>
                      <span
                        className={`font-mono text-xs ${
                          esRecomendada ? 'font-bold text-emerald-900' : 'text-stone-400'
                        }`}
                      >
                        {item.pct}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          esRecomendada
                            ? estilos.barClass
                            : 'bg-stone-300'
                        }`}
                        style={{ width: `${Math.max(item.pct, 1)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ¿Por qué? */}
          <div className="space-y-1.5 pt-2 border-t border-stone-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
              <HelpCircle className="w-3.5 h-3.5 text-[#14532d]" />
              <span>¿Por qué esta recomendación?</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed font-normal">
              <span className="font-medium text-stone-900">{resultado.explicacionPorQue}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 py-3 bg-stone-50/70 border-t border-stone-100 text-[11px] text-stone-400 flex items-center justify-between">
        <span>Árbol {resultado.titulo.toLowerCase()}</span>
        <span>Muestra: n={resultado.n}</span>
      </div>
    </div>
  );
}
