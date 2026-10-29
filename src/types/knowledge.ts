import { DomainArea } from '../types';

export interface SpecEvidence {
  evidence: string;
  evidence_desc: string;
  points: number; // Official point weight in 60-item simulation
  item_ids: number[];
}

export interface SpecAffirmation {
  affirmation: string;
  affirmation_desc: string;
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

// Master Dictionary of Mathematical Terms & Concepts
export const DICTIONARY_TERMS: DictionaryTerm[] = [
  // GEOMETRIA
  {
    id: 'circunferencia',
    term: 'Circunferencia',
    area: 'geometry',
    blockName: '1. Geometría - Geometría Analítica',
    definition: 'Lugar geométrico de todos los puntos del plano que equidistan de un punto fijo llamado centro $(h, k)$ a una distancia constante denominada radio $r$.',
    keyFormulas: ['(x - h)^2 + (y - k)^2 = r^2'],
    examples: ['Para un centro $(3, -2)$ y radio $r = 5$, la ecuación es $(x - 3)^2 + (y + 2)^2 = 25$.'],
    relatedEvidence: ['A1.1', 'A1.2', 'A1.3'],
  },
  {
    id: 'traslacion-circunferencia',
    term: 'Traslación de una Circunferencia',
    area: 'geometry',
    blockName: '1. Geometría - Geometría Analítica',
    definition: 'Transformación rígida que desplaza el centro de una circunferencia $(h, k)$ mediante un vector de traslación $(a, b)$ obteniendo un nuevo centro $(h+a, k+b)$, manteniendo el radio $r$ inalterado.',
    keyFormulas: ['(x - (h + a))^2 + (y - (k + b))^2 = r^2'],
    examples: ['Al trasladar $(x - 1)^2 + (y - 2)^2 = 9$ tres unidades a la derecha y dos hacia abajo, el nuevo centro es $(4, 0)$.'],
    relatedEvidence: ['A2.1', 'A2.2'],
  },
  {
    id: 'posicion-relativa-recta-circunferencia',
    term: 'Posición Relativa de Recta y Circunferencia',
    area: 'geometry',
    blockName: '1. Geometría - Geometría Analítica',
    definition: 'Clasificación de la relación geométrica entre una recta y una circunferencia: Secante (interseca en 2 puntos, distancia $d < r$), Tangente (interseca en 1 punto, $d = r$) o Exterior (0 puntos de intersección, $d > r$).',
    keyFormulas: ['\\Delta > 0 \\implies \\text{Secante}', '\\Delta = 0 \\implies \\text{Tangente}', '\\Delta < 0 \\implies \\text{Exterior}'],
    examples: ['Sustituir la ecuación de la recta en la circunferencia y analizar el discriminante $\\Delta = b^2 - 4ac$.'],
    relatedEvidence: ['A3.1', 'A3.2', 'A3.3'],
  },
  {
    id: 'poligono-regular',
    term: 'Polígono Regular',
    area: 'geometry',
    blockName: '1. Geometría - Polígonos',
    definition: 'Figura geométrica plana delimitada por segmentos de recta donde todos sus lados son congruentes entre sí y todos sus ángulos internos tienen la misma medida.',
    keyFormulas: ['m\\angle i = \\frac{180^\\circ(n - 2)}{n}', 'S_i = 180^\\circ(n - 2)', 'A = \\frac{P \\cdot a}{2}'],
    examples: ['Un hexágono regular ($n=6$) tiene la suma de ángulos internos $S_i = 180^\\circ \\cdot 4 = 720^\\circ$.'],
    relatedEvidence: ['A4.1', 'A4.2', 'A4.3'],
  },
  {
    id: 'seccion-plana-cilindro-esfera',
    term: 'Secciones Planas en Cilindro y Esfera',
    area: 'geometry',
    blockName: '1. Geometría - Visualización Espacial',
    definition: 'Intersección de un plano con un cuerpo tridimensional. En una esfera, la sección plana siempre es un círculo. En un cilindro circular recto, la corte paralelo a las bases genera un círculo, y la corte oblicuo genera una elipse.',
    keyFormulas: ['r_{seccion} = \\sqrt{R^2 - d^2}'],
    examples: ['En una esfera de radio $R = 10$ cortada a una distancia $d = 6$ del centro, el radio del círculo resultante es $\\sqrt{100 - 36} = 8$.'],
    relatedEvidence: ['A5.1', 'A5.2', 'A5.3', 'A5.4'],
  },
  {
    id: 'simetria-axial',
    term: 'Simetría Axial',
    area: 'geometry',
    blockName: '1. Geometría - Transformaciones en el Plano',
    definition: 'Transformación isométrica respecto a una recta llamada eje de simetría $L$, que mapea cada punto $P$ a un punto $P\'$ tal que $L$ es la mediatriz del segmento $PP\'$.',
    examples: ['El reflejo del punto $(2, 5)$ respecto al eje $y$ (recta $x=0$) es $(-2, 5)$.'],
    relatedEvidence: ['A6.1', 'A6.2', 'A6.3'],
  },
  {
    id: 'homotecia',
    term: 'Homotecia',
    area: 'geometry',
    blockName: '1. Geometría - Transformaciones en el Plano',
    definition: 'Transformación geométrica que escala una figura a partir de un punto fijo denominado centro de homotecia $O$ y una razón constante $k$. Si $|k| > 1$ es una ampliación, y si $|k| < 1$ es una reducción.',
    keyFormulas: ['P\' = O + k(P - O)'],
    examples: ['Con centro en el origen $(0,0)$ y razón $k = 3$, el punto $(2, 4)$ se transforma en $(6, 12)$.'],
    relatedEvidence: ['A7.1', 'A7.2'],
  },

  // RELACIONES Y ALGEBRA
  {
    id: 'concepto-funcion',
    term: 'Concepto de Función',
    area: 'functions',
    blockName: '2. Relaciones y Álgebra - Funciones',
    definition: 'Relación entre un conjunto dominio $A$ y un conjunto codominio $B$ tal que a cada elemento $x \\in A$ le corresponde un único elemento $f(x) \\in B$. Se verifica gráficamente mediante la prueba de la recta vertical.',
    relatedEvidence: ['A1.1', 'A1.2'],
  },
  {
    id: 'composicion-funciones',
    term: 'Composición de Funciones',
    area: 'functions',
    blockName: '2. Relaciones y Álgebra - Funciones',
    definition: 'Operación que combina dos funciones $f$ y $g$ evaluando $g$ en el resultado de $f$, denotada como $(g \\circ f)(x) = g(f(x))$. Requiere que el ámbito de $f$ esté contenido en el dominio de $g$.',
    keyFormulas: ['(g \\circ f)(x) = g(f(x))'],
    examples: ['Si $f(x) = 2x + 1$ y $g(x) = x^2$, entonces $(g \\circ f)(x) = (2x + 1)^2$.'],
    relatedEvidence: ['A1.3', 'A1.4'],
  },
  {
    id: 'funcion-lineal',
    term: 'Función Lineal',
    area: 'functions',
    blockName: '2. Relaciones y Álgebra - Función Lineal',
    definition: 'Función polinomial de primer grado de la forma $f(x) = mx + b$, donde $m$ representa la pendiente de la recta y $b$ la intersección con el eje $y$ en el punto $(0, b)$.',
    keyFormulas: ['m = \\frac{y_2 - y_1}{x_2 - x_1}', 'f(x) = mx + b'],
    examples: ['Dada la pendiente $m = 2$ y paso por $(1, 3)$, la ecuación es $y = 2x + 1$.'],
    relatedEvidence: ['A2.2', 'A2.3'],
  },
  {
    id: 'funcion-cuadratica',
    term: 'Función Cuadrática',
    area: 'functions',
    blockName: '2. Relaciones y Álgebra - Función Cuadrática',
    definition: 'Función polinomial de segundo grado $f(x) = ax^2 + bx + c$ ($a \\neq 0$). Su gráfica es una parábola con eje de simetría vertical en $x = -b / (2a)$ y vértice $V\\left(-\\frac{b}{2a}, -\\frac{\\Delta}{4a}\\right)$.',
    keyFormulas: ['\\Delta = b^2 - 4ac', 'V = \\left(-\\frac{b}{2a}, -\\frac{\\Delta}{4a}\\right)'],
    examples: ['Para $f(x) = x^2 - 4x + 3$, $\\Delta = 16 - 12 = 4$, el vértice está en $(2, -1)$.'],
    relatedEvidence: ['A3.1', 'A3.2', 'A3.3'],
  },
  {
    id: 'funcion-inversa',
    term: 'Función Inversa',
    area: 'functions',
    blockName: '2. Relaciones y Álgebra - Funciones Inversas',
    definition: 'Función $f^{-1}$ que invierte la acción de una función inyectiva $f$, tal que $f^{-1}(f(x)) = x$. Gráficamente es simétrica a $f$ respecto a la recta identidad $y = x$.',
    keyFormulas: ['f(f^{-1}(x)) = x', 'f^{-1}(x) = \\frac{x - b}{m} \\quad (m \\neq 0)'],
    examples: ['La inversa de $f(x) = 3x - 5$ es $f^{-1}(x) = \\frac{x + 5}{3}$.'],
    relatedEvidence: ['A4.1', 'A4.2', 'A4.3', 'A4.4'],
  },
  {
    id: 'funcion-exponencial-logaritmica',
    term: 'Función Exponencial y Logarítmica',
    area: 'functions',
    blockName: '2. Relaciones y Álgebra - Exponencial y Logarítmica',
    definition: 'Funciones mutuamente inversas $f(x) = a^x$ y $g(x) = \\log_a(x)$ con base $a > 0, a \\neq 1$. Si $a > 1$ ambas son estrictamente crecientes; si $0 < a < 1$ son estrictamente decrecientes.',
    keyFormulas: ['y = a^x \\iff x = \\log_a(y)', '\\log_a(xy) = \\log_a(x) + \\log_a(y)', '\\log_a\\left(\\frac{x}{y}\\right) = \\log_a(x) - \\log_a(y)'],
    examples: ['$\\log_2(8) = 3$ porque $2^3 = 8$.'],
    relatedEvidence: ['A5.1', 'A5.2', 'A5.3', 'A5.4', 'A5.6'],
  },

  // ESTADISTICA Y PROBABILIDAD
  {
    id: 'medidas-posicion',
    term: 'Medidas de Posición (Media, Mediana, Moda, Cuartiles)',
    area: 'statistics',
    blockName: '3. Estadística y Probabilidad - Resumen de Datos',
    definition: 'Valores que resumen un conjunto de datos indicando un centro o una posición relativa: Media aritmética $\\bar{x}$, Mediana $Me$ (Percentil 50), Moda $Mo$ (dato más frecuente) y Cuartiles ($Q_1, Q_2, Q_3$).',
    keyFormulas: ['\\bar{x} = \\frac{\\sum x_i}{n}', 'RIC = Q_3 - Q_1'],
    examples: ['En los datos $\\{2, 4, 6, 8, 10\\}$, la media es $\\bar{x} = 6$ y la mediana $Me = 6$.'],
    relatedEvidence: ['A1.1', 'A1.2', 'A1.3', 'A1.4'],
  },
  {
    id: 'diagrama-cajas',
    term: 'Diagrama de Cajas (Boxplot)',
    area: 'statistics',
    blockName: '3. Estadística y Probabilidad - Representaciones',
    definition: 'Representación gráfica basada en el resumen de 5 números: Mínimo, Cuartil 1 ($Q_1$), Mediana ($Q_2$), Cuartil 3 ($Q_3$) y Máximo. Permite visualizar dispersión, simetría y comparar grupos de datos.',
    keyFormulas: ['RIC = Q_3 - Q_1'],
    relatedEvidence: ['A3.2'],
  },
  {
    id: 'coeficiente-variacion-estandarizacion',
    term: 'Coeficiente de Variación y Posición Relativa',
    area: 'statistics',
    blockName: '3. Estadística y Probabilidad - Medidas Relativas',
    definition: 'El Coeficiente de Variación $C_v$ mide la variabilidad relativa porcentual independientemente de las unidades. La Posición Relativa $P_r$ (estandarización $z$) expresa a cuántas desviaciones estándar se encuentra un dato respecto a su media.',
    keyFormulas: ['C_v = \\frac{\\sigma}{\\bar{x}} \\cdot 100\\%', 'P_r = \\frac{x - \\bar{x}}{\\sigma}'],
    examples: ['Si $\\bar{x} = 50$ y $\\sigma = 5$, $C_v = \\frac{5}{50} \\cdot 100 = 10\\%$. Un dato $x = 60$ tiene $P_r = \\frac{60 - 50}{5} = +2.0$.'],
    relatedEvidence: ['A3.1', 'A3.3'],
  },
  {
    id: 'probabilidad-eventos',
    term: 'Probabilidad y Operaciones con Eventos',
    area: 'statistics',
    blockName: '3. Estadística y Probabilidad - Probabilidades',
    definition: 'Medida cuantitativa entre $0$ y $1$ de la frecuencia o certeza de ocurrencia de un evento. Incluye operaciones de Unión ($A \\cup B$), Intersección ($A \\cap B$) y Complemento ($A^c$).',
    keyFormulas: ['P(A) = \\frac{\\text{Casos Favorables}}{\\text{Casos Posibles}}', 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)', 'P(A^c) = 1 - P(A)'],
    examples: ['Al lanzar un dado de 6 caras, la probabilidad de obtener un número par es $3/6 = 0.50$.'],
    relatedEvidence: ['A2.1', 'A2.2', 'A2.3'],
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
        description: 'Representación de la circunferencia con centro en $(h, k)$ y radio $r > 0$.',
        variables: [
          { symbol: '(h, k)', meaning: 'Coordenadas del centro de la circunferencia' },
          { symbol: 'r', meaning: 'Radio de la circunferencia' },
        ],
      },
      {
        name: 'Suma de Ángulos Internos de un Polígono Regular',
        latex: 'S_i = 180^\\circ (n - 2)',
        description: 'Suma total de las medidas de los ángulos internos de un polígono convexo de $n$ lados.',
        variables: [{ symbol: 'n', meaning: 'Número de lados del polígono' }],
      },
      {
        name: 'Medida de un Ángulo Interno en Polígono Regular',
        latex: 'm\\angle i = \\frac{180^\\circ (n - 2)}{n}',
        description: 'Valor individual de cada ángulo interno en un polígono regular equiángulo.',
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
        name: 'Radio de la Sección Plana en una Esfera',
        latex: 'r = \\sqrt{R^2 - d^2}',
        description: 'Aplica el Teorema de Pitágoras para relacionar el radio de la esfera $R$, la distancia del plano al centro $d$ y el radio de la sección circular $r$.',
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
        description: 'Razón de cambio de la recta dados dos puntos $(x_1, y_1)$ y $(x_2, y_2)$ con $x_1 \\neq x_2$.',
      },
      {
        name: 'Vértice y Discriminante de la Parábola',
        latex: 'V = \\left( -\\frac{b}{2a}, -\\frac{\\Delta}{4a} \\right), \\quad \\Delta = b^2 - 4ac',
        description: 'Punto máximo o mínimo de la función cuadrática $f(x) = ax^2 + bx + c$.',
      },
      {
        name: 'Propiedad Fundamental de Logaritmos',
        latex: '\\log_a(x) = y \\iff a^y = x \\quad (a > 0, a \\neq 1)',
        description: 'Equivalencia entre forma logarítmica y exponencial.',
      },
      {
        name: 'Leyes de Logaritmos',
        latex: '\\log_a(u \\cdot v) = \\log_a(u) + \\log_a(v), \\quad \\log_a\\left(\\frac{u}{v}\\right) = \\log_a(u) - \\log_a(v), \\quad \\log_a(u^k) = k \\log_a(u)',
        description: 'Reglas para simplificar y resolver ecuaciones logarítmicas.',
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
        description: 'Medida de dispersión relativa entre la desviación estándar $\\sigma$ y la media $\\bar{x}$.',
      },
      {
        name: 'Posición Relativa (Estandarización Pr)',
        latex: 'P_r = \\frac{x - \\bar{x}}{\\sigma}',
        description: 'Mide cuántas desviaciones estándar dista un dato $x$ de la media del grupo.',
      },
      {
        name: 'Recorrido Intercuartílico (RIC)',
        latex: 'RIC = Q_3 - Q_1',
        description: 'Amplitud del rango central del 50% de los datos ordenados.',
      },
      {
        name: 'Regla de Laplace (Probabilidad)',
        latex: 'P(A) = \\frac{\\text{Número de casos favorables a } A}{\\text{Número total de casos posibles}}',
        description: 'Probabilidad teórica en experimentos con resultados equiprobables.',
      },
      {
        name: 'Regla de la Adición para Eventos',
        latex: 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)',
        description: 'Probabilidad de la unión de dos eventos cualesquiera.',
      },
    ],
  },
];
