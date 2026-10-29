import { DomainArea } from '../types';

export interface SpecEvidence {
  evidence: string;
  evidence_desc: string;
  points: number; // Official target point weight in 60-item simulation
  item_ids: number[];
}

export interface SpecAffirmation {
  affirmation: string;
  affirmation_desc: string;
  targetPoints: number;
  evidences: SpecEvidence[];
}

export interface SpecBlock {
  id: DomainArea;
  block: string;
  name: string;
  totalPoints: number;
  affirmations: SpecAffirmation[];
}

export interface DictionaryTerm {
  id: string;
  term: string;
  area: DomainArea;
  blockName: string;
  definition: string;
  keyFormulas?: string[];
  examples?: string[];
  relatedEvidence?: string[];
}

export interface FormulaCategory {
  id: string;
  title: string;
  area: DomainArea;
  formulas: Array<{
    name: string;
    latex: string;
    description: string;
    variables?: Array<{ symbol: string; meaning: string }>;
    notes?: string;
  }>;
}

// Comprehensive Master Dictionary of Mathematical Terms & Concepts from MEP BXM Convocatoria 02-2026
export const DICTIONARY_TERMS: DictionaryTerm[] = [
  // ================= GEOMETRÍA =================
  {
    id: 'circunferencia',
    term: 'Circunferencia',
    area: 'geometry',
    blockName: '1. Geometría - Geometría Analítica',
    definition: 'Lugar geométrico de todos los puntos del plano cartesiano que equidistan de un punto fijo denominado centro $(h, k)$ a una distancia constante llamada radio $r > 0$.',
    keyFormulas: ['(x - h)^2 + (y - k)^2 = r^2'],
    examples: ['Para un centro $(3, -2)$ y radio $r = 5$, la ecuación ordinaria es $(x - 3)^2 + (y + 2)^2 = 25$.'],
    relatedEvidence: ['A1.1', 'A1.2', 'A1.3'],
  },
  {
    id: 'centro-radio-circunferencia',
    term: 'Centro y Radio de la Circunferencia',
    area: 'geometry',
    blockName: '1. Geometría - Geometría Analítica',
    definition: 'El centro es el punto coordenado $(h, k)$ desde el cual se mide la distancia hacia cualquier punto de la circunferencia. El radio $r$ representa dicha distancia fija, cumpliendo que $r = \\sqrt{(x-h)^2 + (y-k)^2}$. El diámetro es el doble del radio ($d = 2r$).',
    keyFormulas: ['r = \\sqrt{(x - h)^2 + (y - k)^2}', 'd = 2r'],
    examples: ['Si la ecuación es $(x + 4)^2 + y^2 = 16$, el centro es $(-4, 0)$ y el radio es $r = \\sqrt{16} = 4$.'],
    relatedEvidence: ['A1.1', 'A1.2'],
  },
  {
    id: 'traslacion-circunferencia',
    term: 'Traslación de una Circunferencia',
    area: 'geometry',
    blockName: '1. Geometría - Geometría Analítica',
    definition: 'Transformación rígida que desplaza el centro de una circunferencia $(h, k)$ mediante un vector o instrucción de movimiento horizontal ($a$ unidades) y vertical ($b$ unidades), obteniendo un nuevo centro $(h+a, k+b)$ mientras el radio $r$ permanece invariante.',
    keyFormulas: ['(x - (h + a))^2 + (y - (k + b))^2 = r^2'],
    examples: ['Mover la circunferencia $(x - 1)^2 + (y - 2)^2 = 9$ tres unidades a la derecha y dos hacia abajo genera un nuevo centro $(4, 0)$ y la ecuación $(x - 4)^2 + y^2 = 9$.'],
    relatedEvidence: ['A2.1', 'A2.2'],
  },
  {
    id: 'posicion-punto-circunferencia',
    term: 'Posición Relativa de un Punto respecto a una Circunferencia',
    area: 'geometry',
    blockName: '1. Geometría - Geometría Analítica',
    definition: 'Un punto $P(x_0, y_0)$ se clasifica según su distancia $d$ al centro $(h, k)$ comparada con el radio $r$: Interior si $(x_0-h)^2 + (y_0-k)^2 < r^2$, Sobre la circunferencia si es igual a $r^2$, o Exterior si es mayor que $r^2$.',
    keyFormulas: ['d < r \\implies \\text{Interior}', 'd = r \\implies \\text{Sobre}', 'd > r \\implies \\text{Exterior}'],
    examples: ['Para $(x-1)^2 + y^2 = 25$, el punto $(1, 3)$ satisface $(1-1)^2 + 3^2 = 9 < 25$, por lo que es un punto interior.'],
    relatedEvidence: ['A3.1'],
  },
  {
    id: 'posicion-recta-circunferencia',
    term: 'Posición Relativa de una Recta y una Circunferencia',
    area: 'geometry',
    blockName: '1. Geometría - Geometría Analítica',
    definition: 'Clasificación algebraica/gráfica de la intersección entre una recta $y = mx + b$ y una circunferencia: Secante (interseca en 2 puntos, discriminante $\\Delta > 0$), Tangente (1 punto de intersección, $\\Delta = 0$) o Exterior (0 puntos, $\\Delta < 0$).',
    keyFormulas: ['\\Delta > 0 \\implies \\text{Secante}', '\\Delta = 0 \\implies \\text{Tangente}', '\\Delta < 0 \\implies \\text{Exterior}'],
    examples: ['Sustituir $y = 3$ en $(x-2)^2 + y^2 = 25$ produce $(x-2)^2 + 9 = 25 \\implies (x-2)^2 = 16$, con dos soluciones ($x = 6, x = -2$), por tanto es una recta secante.'],
    relatedEvidence: ['A3.2', 'A3.3'],
  },
  {
    id: 'rectas-paralelas-perpendiculares',
    term: 'Rectas Paralelas y Perpendiculares',
    area: 'geometry',
    blockName: '1. Geometría - Geometría Analítica',
    definition: 'Dos rectas en el plano con pendientes $m_1$ y $m_2$ son Paralelas si poseen igual pendiente ($m_1 = m_2$) y Perpendiculares si el producto de sus pendientes es $-1$ ($m_1 \\cdot m_2 = -1$).',
    keyFormulas: ['m_1 = m_2 \\iff L_1 \\parallel L_2', 'm_1 \\cdot m_2 = -1 \\iff L_1 \\perp L_2'],
    examples: ['Si $L_1: y = 2x + 1$, una recta perpendicular $L_2$ tiene pendiente $m_2 = -1/2$.'],
    relatedEvidence: ['A3.4'],
  },
  {
    id: 'propiedad-tangencia-perpendicularidad',
    term: 'Propiedad de la Tangente a la Circunferencia',
    area: 'geometry',
    blockName: '1. Geometría - Geometría Analítica',
    definition: 'Toda recta tangente a una circunferencia es estrictamente perpendicular al radio que pasa por el punto de tangencia. Esto permite formar triángulos rectángulos con el centro y puntos exteriores.',
    keyFormulas: ['a^2 + b^2 = c^2 \\quad (\\text{Teorema de Pitágoras con radio y tangente})'],
    relatedEvidence: ['A3.5'],
  },
  {
    id: 'poligono-regular',
    term: 'Polígono Regular y sus Elementos',
    area: 'geometry',
    blockName: '1. Geometría - Polígonos',
    definition: 'Figura plana cerrada con $n$ lados congruentes y $n$ ángulos internos iguales. Sus elementos métricos clave son el radio $r$, la apotema $a$, el ángulo central $m\\angle c = \\frac{360^\\circ}{n}$ y la suma de ángulos internos $S_i = 180^\\circ(n-2)$.',
    keyFormulas: ['S_i = 180^\\circ(n - 2)', 'm\\angle i = \\frac{180^\\circ(n - 2)}{n}', 'A = \\frac{P \\cdot a}{2}'],
    examples: ['Un octágono regular ($n=8$) tiene un ángulo central de $\\frac{360^\\circ}{8} = 45^\\circ$.'],
    relatedEvidence: ['A4.1'],
  },
  {
    id: 'poligonos-irregulares-coordenadas',
    term: 'Área de Polígonos Irregulares por Coordenadas',
    area: 'geometry',
    blockName: '1. Geometría - Polígonos',
    definition: 'Método para calcular el área de polígonos irregulares sobre el plano cartesiano mediante descomposición en triángulos/rectángulos sencillos o utilizando la fórmula de los determinantes de Gauss (Sarrus).',
    keyFormulas: ['A = \\frac{1}{2} |(x_1y_2 + x_2y_3 + \\dots) - (y_1x_2 + y_2x_3 + \\dots)|'],
    relatedEvidence: ['A4.2', 'A4.3'],
  },
  {
    id: 'cilindro-circular-recto',
    term: 'Cilindro Circular Recto',
    area: 'geometry',
    blockName: '1. Geometría - Visualización Espacial',
    definition: 'Cuerpo tridimensional formado por dos bases circulares congruentes y una superficie lateral curva generada por un segmento perpendicular a las bases de longitud $h$ (altura).',
    keyFormulas: ['A_{lateral} = 2\\pi r h', 'V = \\pi r^2 h'],
    relatedEvidence: ['A5.1', 'A5.2', 'A5.3'],
  },
  {
    id: 'seccion-plana-esfera-cilindro',
    term: 'Sección Plana y Elipse en Cuerpos 3D',
    area: 'geometry',
    blockName: '1. Geometría - Visualización Espacial',
    definition: 'Intersección de un plano con una figura 3D. En una esfera toda sección plana es una circunferencia cuyo radio cumple $r = \\sqrt{R^2 - d^2}$. En un cilindro, cortes paralelos a la base forman círculos y cortes oblicuos forman elipses.',
    keyFormulas: ['r_{seccion} = \\sqrt{R^2 - d^2}'],
    examples: ['Una esfera de radio $R=5$ cortada a distancia $d=3$ del centro genera un círculo de radio $r = \\sqrt{25 - 9} = 4$.'],
    relatedEvidence: ['A5.2', 'A5.3', 'A5.4'],
  },
  {
    id: 'simetria-axial-homologos',
    term: 'Simetría Axial y Elementos Homólogos',
    area: 'geometry',
    blockName: '1. Geometría - Geometría Analítica',
    definition: 'Reflexión respecto a una recta llamada eje de simetría $L$. Los puntos u objetos mapeados a través del eje son homólogos y conservan las distancias (isometría).',
    examples: ['El punto $(3, 4)$ reflejado respecto al eje $y$ tiene como punto homólogo $(-3, 4)$.'],
    relatedEvidence: ['A6.1', 'A6.2', 'A6.3'],
  },
  {
    id: 'transformaciones-plano-homotecia',
    term: 'Transformaciones en el Plano (Homotecia, Traslación, Reflexión, Rotación)',
    area: 'geometry',
    blockName: '1. Geometría - Transformaciones en el Plano',
    definition: 'Mapeos geométricos en el plano. La homotecia escala una figura según una razón $k$ desde un centro $O$; la traslación desplaza; la reflexión invierte respecto a un eje; y la rotación gira un ángulo $\\theta$.',
    keyFormulas: ['P\' = O + k(P - O)'],
    relatedEvidence: ['A7.1', 'A7.2', 'A7.3', 'A7.4'],
  },

  // ================= RELACIONES Y ÁLGEBRA =================
  {
    id: 'concepto-funcion-dominio-ambito',
    term: 'Función, Dominio, Ámbito e Imágenes',
    area: 'functions',
    blockName: '2. Relaciones y Álgebra - Funciones',
    definition: 'Relación $f: A \\to B$ donde a cada valor $x$ del dominio $A$ (preimagen) le corresponde una única imagen $y = f(x)$ en el codominio. El ámbito es el conjunto de todas las imágenes efectivamente alcanzadas.',
    keyFormulas: ['y = f(x)'],
    relatedEvidence: ['A1.1', 'A1.2'],
  },
  {
    id: 'composicion-funciones',
    term: 'Composición de Funciones',
    area: 'functions',
    blockName: '2. Relaciones y Álgebra - Funciones',
    definition: 'Operación que consiste en evaluar una función en el resultado de otra, denotada $(g \\circ f)(x) = g(f(x))$. Requiere que el ámbito de $f$ esté contenido en el dominio de $g$.',
    keyFormulas: ['(g \\circ f)(x) = g(f(x))'],
    examples: ['Si $f(x) = x + 3$ y $g(x) = x^2$, entonces $(g \\circ f)(x) = (x + 3)^2$.'],
    relatedEvidence: ['A1.3', 'A1.4'],
  },
  {
    id: 'funcion-lineal-pendiente',
    term: 'Función Lineal y Pendiente de una Recta',
    area: 'functions',
    blockName: '2. Relaciones y Álgebra - Función Lineal',
    definition: 'Función de la forma $f(x) = mx + b$. La pendiente $m = \\frac{y_2 - y_1}{x_2 - x_1}$ indica la inclinación y tasa de cambio; $b$ determina la intersección con el eje $y$ en $(0, b)$.',
    keyFormulas: ['m = \\frac{y_2 - y_1}{x_2 - x_1}', 'f(x) = mx + b'],
    examples: ['Dada la pendiente $m = -2$ y corte en $b = 5$, la función es $f(x) = -2x + 5$.'],
    relatedEvidence: ['A2.1', 'A2.2', 'A2.3', 'A2.4'],
  },
  {
    id: 'funcion-cuadratica-vertice',
    term: 'Función Cuadrática, Vértice y Discriminante',
    area: 'functions',
    blockName: '2. Relaciones y Álgebra - Función Cuadrática',
    definition: 'Función $f(x) = ax^2 + bx + c$ ($a \\neq 0$) cuya representación gráfica es una parábola. Su concavidad depende del signo de $a$. El discriminante $\\Delta = b^2 - 4ac$ indica las intersecciones con el eje $x$, y el vértice es $V\\left(-\\frac{b}{2a}, -\\frac{\\Delta}{4a}\\right)$.',
    keyFormulas: ['\\Delta = b^2 - 4ac', 'V = \\left(-\\frac{b}{2a}, -\\frac{\\Delta}{4a}\\right)'],
    examples: ['Para $f(x) = x^2 - 6x + 8$, $\\Delta = 36 - 32 = 4 > 0$, el vértice se ubica en $(3, -1)$.'],
    relatedEvidence: ['A2.5', 'A2.6', 'A3.1'],
  },
  {
    id: 'sistemas-ecuaciones-lineales',
    term: 'Sistemas de Ecuaciones Lineales (2x2)',
    area: 'functions',
    blockName: '2. Relaciones y Álgebra - Sistemas de Ecuaciones',
    definition: 'Conjunto de dos ecuaciones de primer grado con dos incógnitas. Gráficamente representa dos rectas que pueden tener una Única solución (rectas secantes), Solución vacía (rectas paralelas distintas) o Infinitas soluciones (rectas coincidentes).',
    keyFormulas: ['\\begin{cases} a_1x + b_1y = c_1 \\\\ a_2x + b_2y = c_2 \\end{cases}'],
    relatedEvidence: ['A3.2', 'A3.3'],
  },
  {
    id: 'funcion-inversa',
    term: 'Función Inversa',
    area: 'functions',
    blockName: '2. Relaciones y Álgebra - Funciones Inversas',
    definition: 'Función $f^{-1}$ definida únicamente para funciones inyectivas (o en intervalos donde $f$ sea inyectiva) tal que $f^{-1}(f(x)) = x$. El dominio de $f^{-1}$ coincide con el ámbito de $f$ y sus gráficas son reflejos respecto a la recta $y = x$.',
    keyFormulas: ['f^{-1}(x) = \\frac{x - b}{m} \\quad (\\text{Inversa de } f(x) = mx + b)'],
    examples: ['La inversa de $f(x) = 2x - 4$ es $f^{-1}(x) = \\frac{x + 4}{2}$.'],
    relatedEvidence: ['A4.1', 'A4.2', 'A4.3', 'A4.4'],
  },
  {
    id: 'funcion-raiz-cuadrada',
    term: 'Función Raíz Cuadrada y sus Transformaciones',
    area: 'functions',
    blockName: '2. Relaciones y Álgebra - Raíz Cuadrada',
    definition: 'Función de la forma $f(x) = a\\sqrt{x + b} + c$. Sus transformaciones alteran el punto de inicio $(-b, c)$, la orientación y amplitud según el coeficiente $a$. Su dominio requiere $x + b \\ge 0$.',
    keyFormulas: ['f(x) = a\\sqrt{x + b} + c'],
    relatedEvidence: ['A4.5', 'A4.6', 'A4.7'],
  },
  {
    id: 'funcion-exponencial-logaritmica',
    term: 'Función Exponencial y Logarítmica',
    area: 'functions',
    blockName: '2. Relaciones y Álgebra - Exponenciales y Logaritmos',
    definition: 'Funciones de la forma $f(x) = a^x$ y $g(x) = \\log_a(x)$ con $a > 0, a \\neq 1$. Son funciones estrictamente inversas. Si $a > 1$ ambas son crecientes; si $0 < a < 1$ son decrecientes.',
    keyFormulas: ['y = a^x \\iff x = \\log_a(y)'],
    examples: ['$\\log_3(81) = 4$ puesto que $3^4 = 81$.'],
    relatedEvidence: ['A5.1', 'A5.2', 'A5.3', 'A5.5', 'A6.1'],
  },
  {
    id: 'propiedades-logaritmos-ecuaciones',
    term: 'Propiedades de Logaritmos y Ecuaciones Exponenciales',
    area: 'functions',
    blockName: '2. Relaciones y Álgebra - Logaritmos',
    definition: 'Reglas algebraicas que permiten simplificar expresiones y despejar variables en ecuaciones donde la incógnita se encuentra en el exponente o dentro de un argumento logarítmico.',
    keyFormulas: ['\\log_a(u \\cdot v) = \\log_a(u) + \\log_a(v)', '\\log_a\\left(\\frac{u}{v}\\right) = \\log_a(u) - \\log_a(v)', '\\log_a(u^k) = k \\log_a(u)'],
    examples: ['Resolver $2^{x+1} = 5$ aplicando $\\log_2$: $x + 1 = \\log_2(5) \\implies x = \\log_2(5) - 1$.'],
    relatedEvidence: ['A5.4', 'A5.6', 'A5.7', 'A5.8', 'A5.9'],
  },

  // ================= ESTADÍSTICA Y PROBABILIDAD =================
  {
    id: 'medidas-posicion-media-ponderada',
    term: 'Medidas de Posición y Media Aritmética Ponderada',
    area: 'statistics',
    blockName: '3. Estadística y Probabilidad - Resumen de Datos',
    definition: 'Valores cuantitativos que describen la tendencia central o ubicación de los datos: Moda $Mo$, Mediana $Me$, Cuartiles ($Q_1, Q_2, Q_3$) y Media Aritmética Ponderada $\\bar{x}_w = \\frac{\\sum (x_i \\cdot w_i)}{\\sum w_i}$ según el peso relativo de cada categoría.',
    keyFormulas: ['\\bar{x} = \\frac{\\sum x_i}{n}', '\\bar{x}_w = \\frac{\\sum (x_i \\cdot w_i)}{\\sum w_i}'],
    relatedEvidence: ['A1.1', 'A1.2', 'A1.3', 'A1.4', 'A1.5'],
  },
  {
    id: 'eventos-aleatorios-operaciones',
    term: 'Eventos Aleatorios, Operaciones y Diagramas de Venn',
    area: 'statistics',
    blockName: '3. Estadística y Probabilidad - Probabilidades',
    definition: 'Subconjuntos del espacio muestral $S$. Las operaciones básicas entre eventos incluyen Unión ($A \\cup B$), Intersección ($A \\cap B$) y Complemento ($A^c$). Eventos mutuamente excluyentes cumplen $A \\cap B = \\emptyset$.',
    keyFormulas: ['P(A \\cup B) = P(A) + P(B) - P(A \\cap B)', 'P(A^c) = 1 - P(A)'],
    relatedEvidence: ['A2.1', 'A2.2', 'A2.3', 'A2.4', 'A2.5'],
  },
  {
    id: 'diagrama-cajas-ric',
    term: 'Diagrama de Cajas y Recorrido Intercuartílico (RIC)',
    area: 'statistics',
    blockName: '3. Estadística y Probabilidad - Análisis Comparativo',
    definition: 'Representación gráfica basada en los 5 números resumen (Mínimo, $Q_1$, Mediana, $Q_3$, Máximo). El Recorrido Intercuartílico $RIC = Q_3 - Q_1$ mide la dispersión del 50% central de los datos.',
    keyFormulas: ['RIC = Q_3 - Q_1', 'R = \\text{Máx} - \\text{Mín}'],
    relatedEvidence: ['A3.1', 'A3.2'],
  },
  {
    id: 'estandarizacion-coeficiente-variacion',
    term: 'Estandarización (Posición Relativa) y Coeficiente de Variación',
    area: 'statistics',
    blockName: '3. Estadística y Probabilidad - Medidas Relativas',
    definition: 'Herramientas estadísticas para comparar grupos heterogéneos. La Posición Relativa $P_r = z = \\frac{x - \\bar{x}}{\\sigma}$ indica a cuántas desviaciones estándar está un dato de la media. El Coeficiente de Variación $C_v = \\frac{\\sigma}{\\bar{x}} \\cdot 100\\%$ mide la variabilidad relativa porcentual.',
    keyFormulas: ['P_r = \\frac{x - \\bar{x}}{\\sigma}', 'C_v = \\frac{\\sigma}{\\bar{x}} \\cdot 100\\%'],
    examples: ['Un dato $x = 85$ con $\\bar{x} = 75$ y $\\sigma = 5$ tiene una posición relativa $P_r = \\frac{85 - 75}{5} = +2.0$.'],
    relatedEvidence: ['A3.3'],
  },
];

// Master Formula Sheet Categories
export const FORMULA_CATEGORIES: FormulaCategory[] = [
  {
    id: 'geom-formulas',
    title: 'Geometría y Geometría Analítica',
    area: 'geometry',
    formulas: [
      {
        name: 'Ecuación Ordinaria de la Circunferencia',
        latex: '(x - h)^2 + (y - k)^2 = r^2',
        description: 'Representación algebraica de una circunferencia con centro en $(h, k)$ y radio $r > 0$.',
        variables: [
          { symbol: '(h, k)', meaning: 'Coordenadas del centro de la circunferencia' },
          { symbol: 'r', meaning: 'Radio de la circunferencia' },
        ],
      },
      {
        name: 'Suma de Ángulos Internos de un Polígono Regular',
        latex: 'S_i = 180^\\circ (n - 2)',
        description: 'Suma total de los ángulos internos de un polígono convexo de $n$ lados.',
        variables: [{ symbol: 'n', meaning: 'Número de lados del polígono' }],
      },
      {
        name: 'Medida de un Ángulo Interno en Polígono Regular',
        latex: 'm\\angle i = \\frac{180^\\circ (n - 2)}{n}',
        description: 'Medida de un ángulo interno individual en un polígono regular.',
      },
      {
        name: 'Área de un Polígono Regular',
        latex: 'A = \\frac{P \\cdot a}{2}',
        description: 'Cálculo del área en función del perímetro $P$ y la apotema $a$.',
        variables: [
          { symbol: 'P', meaning: 'Perímetro ($P = n \\cdot l$)' },
          { symbol: 'a', meaning: 'Apotema del polígono' },
        ],
      },
      {
        name: 'Radio de la Sección Plana Esférica',
        latex: 'r = \\sqrt{R^2 - d^2}',
        description: 'Aplica el Teorema de Pitágoras para relacionar el radio de la esfera $R$, la distancia del plano al centro $d$ y el radio del círculo cortado $r$.',
      },
    ],
  },
  {
    id: 'algebra-formulas',
    title: 'Relaciones y Álgebra',
    area: 'functions',
    formulas: [
      {
        name: 'Pendiente de una Recta (Función Lineal)',
        latex: 'm = \\frac{y_2 - y_1}{x_2 - x_1}',
        description: 'Pendiente e inclinación de la recta dados dos puntos $(x_1, y_1)$ y $(x_2, y_2)$ con $x_1 \\neq x_2$.',
      },
      {
        name: 'Vértice y Discriminante Parabólico',
        latex: 'V = \\left( -\\frac{b}{2a}, -\\frac{\\Delta}{4a} \\right), \\quad \\Delta = b^2 - 4ac',
        description: 'Coordenadas del vértice (máximo o mínimo) y discriminante de $f(x) = ax^2 + bx + c$.',
      },
      {
        name: 'Equivalencia Exponencial-Logarítmica',
        latex: '\\log_a(x) = y \\iff a^y = x \\quad (a > 0, a \\neq 1)',
        description: 'Definición fundamental de la función logarítmica como inversa de la exponencial.',
      },
      {
        name: 'Propiedades de los Logaritmos',
        latex: '\\log_a(u \\cdot v) = \\log_a(u) + \\log_a(v), \\quad \\log_a\\left(\\frac{u}{v}\\right) = \\log_a(u) - \\log_a(v), \\quad \\log_a(u^k) = k \\log_a(u)',
        description: 'Reglas para simplificar y resolver ecuaciones logarítmicas y exponenciales.',
      },
    ],
  },
  {
    id: 'stats-formulas',
    title: 'Estadística y Probabilidad',
    area: 'statistics',
    formulas: [
      {
        name: 'Coeficiente de Variación (Cv)',
        latex: 'C_v = \\frac{\\sigma}{\\bar{x}} \\cdot 100\\%',
        description: 'Porcentaje de variabilidad relativa respecto a la desviación estándar $\\sigma$ y la media $\\bar{x}$.',
      },
      {
        name: 'Posición Relativa (Estandarización Pr / Z)',
        latex: 'P_r = \\frac{x - \\bar{x}}{\\sigma}',
        description: 'Número de desviaciones estándar que separan a un dato $x$ de la media del grupo.',
      },
      {
        name: 'Recorrido Intercuartílico (RIC)',
        latex: 'RIC = Q_3 - Q_1',
        description: 'Rango de dispersión del 50% central de los datos ordenados.',
      },
      {
        name: 'Regla de Laplace (Probabilidad)',
        latex: 'P(A) = \\frac{\\text{Número de casos favorables a } A}{\\text{Número total de casos posibles}}',
        description: 'Cálculo de probabilidad teórica en experimentos con resultados equiprobables.',
      },
      {
        name: 'Regla de Adición de Probabilidades',
        latex: 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)',
        description: 'Probabilidad de la unión de dos eventos aleatorios.',
      },
    ],
  },
];
