export interface OfficialSpecEvidence {
  code: string; // e.g., "A3.1"
  desc: string;
}

export interface OfficialSpecAffirmation {
  code: string; // e.g., "A3"
  desc: string;
  targetPoints: number; // Official item points allocated in 60-item exam
  evidences: OfficialSpecEvidence[];
}

export interface OfficialSpecBlock {
  blockCode: string; // e.g., "1. Geometría"
  name: string;
  areaId: 'geometry' | 'functions' | 'statistics';
  totalPoints: number;
  affirmations: OfficialSpecAffirmation[];
}

// Complete Official MEP Specification Table Data from Convocatoria 02-2026 PDF
export const OFFICIAL_SPECIFICATION_TABLE: OfficialSpecBlock[] = [
  {
    blockCode: '1. Geometría',
    name: 'Geometría',
    areaId: 'geometry',
    totalPoints: 23,
    affirmations: [
      {
        code: 'A1',
        desc: 'Resuelve problemas, de diversos contextos, relacionados con la representación de circunferencias de manera analítica o gráfica.',
        targetPoints: 4,
        evidences: [
          { code: 'A1.1', desc: 'Reconoce la representación gráfica de una circunferencia dado su centro y su radio, en diversos contextos.' },
          { code: 'A1.2', desc: 'Reconoce la representación algebraica de una circunferencia dado su centro y su radio, en diversos contextos.' },
          { code: 'A1.3', desc: 'Resuelve problemas, de diversos contextos, relacionados con la circunferencia y sus representaciones.' },
        ],
      },
      {
        code: 'A2',
        desc: 'Resuelve problemas, de diversos contextos, relacionados con traslaciones de circunferencias.',
        targetPoints: 3,
        evidences: [
          { code: 'A2.1', desc: 'Reconoce la representación gráfica o algebraica de la traslación de una circunferencia en diversos contextos.' },
          { code: 'A2.2', desc: 'Resuelve problemas, de diversos contextos, relacionados con la traslación de una circunferencia y sus representaciones.' },
        ],
      },
      {
        code: 'A3',
        desc: 'Resuelve problemas, de diversos contextos, que involucran relaciones de posición relativa entre rectas, rectas y circunferencias o puntos y circunferencias.',
        targetPoints: 4,
        evidences: [
          { code: 'A3.1', desc: 'Determina gráfica y algebraicamente si un punto se ubica en el interior o en el exterior de una circunferencia en diversos contextos.' },
          { code: 'A3.2', desc: 'Determina si una recta dada gráfica o algebraicamente es secante, tangente o exterior a una circunferencia en diversos contextos.' },
          { code: 'A3.3', desc: 'Determina gráfica o algebraicamente rectas secantes, tangentes y exteriores a una circunferencia, en diversos contextos.' },
          { code: 'A3.4', desc: 'Determina geométrica o algebraicamente la posición relativa entre rectas en el plano desde el punto de vista del paralelismo o la perpendicularidad, en diversos contextos.' },
          { code: 'A3.5', desc: 'Determina elementos relacionados con la propiedad que establece que una recta tangente a una circunferencia es perpendicular al radio de la circunferencia en el punto de tangencia en diversos contextos.' },
        ],
      },
      {
        code: 'A4',
        desc: 'Resuelve problemas sobre áreas y perímetros de polígonos y de figuras planas no poligonales en diversos contextos.',
        targetPoints: 4,
        evidences: [
          { code: 'A4.1', desc: 'Determina elementos de los polígonos regulares para la obtención de perímetros o áreas de estos en diversos contextos.' },
          { code: 'A4.2', desc: 'Determina perímetros o áreas de polígonos no regulares mediante un sistema de coordenadas rectangulares en diversos contextos.' },
          { code: 'A4.3', desc: 'Estima perímetros o áreas de figuras planas no poligonales mediante un sistema de coordenadas rectangulares en diversos contextos.' },
        ],
      },
      {
        code: 'A5',
        desc: 'Resuelve problemas, de diversos contextos, relacionados con secciones planas y características métricas en figuras geométricas tridimensionales.',
        targetPoints: 3,
        evidences: [
          { code: 'A5.1', desc: 'Identifica la superficie lateral, las bases, la altura, el radio o el diámetro de un cilindro circular recto en diversos contextos.' },
          { code: 'A5.2', desc: 'Determina qué figuras se obtienen mediante secciones planas de una esfera o un cilindro circular recto en diversos contextos.' },
          { code: 'A5.3', desc: 'Determina características métricas de secciones planas en un cilindro circular recto o en una esfera en diversos contextos.' },
          { code: 'A5.4', desc: 'Reconoce elipses en diferentes contextos.' },
        ],
      },
      {
        code: 'A6',
        desc: 'Resuelve problemas, de diversos contextos, relacionados con la simetría en diversas figuras.',
        targetPoints: 2,
        evidences: [
          { code: 'A6.1', desc: 'Determina ejes de simetría en figuras simétricas en diversos contextos.' },
          { code: 'A6.2', desc: 'Identifica elementos homólogos en figuras que presentan simetría axial en diversos contextos.' },
          { code: 'A6.3', desc: 'Resuelve problemas, de diversos contextos, relacionados con la simetría de figuras.' },
        ],
      },
      {
        code: 'A7',
        desc: 'Resuelve problemas, de diversos contextos, relacionados con diversas transformaciones en el plano de figuras geométricas.',
        targetPoints: 3,
        evidences: [
          { code: 'A7.1', desc: 'Reconoce las figuras obtenidas a partir del concepto de transformación (traslación, homotecia, reflexión o rotación) a figuras dadas, en diversos contextos.' },
          { code: 'A7.2', desc: 'Identifica elementos de las figuras geométricas que aparecen invariantes bajo reflexiones o rotaciones, en diversos contextos.' },
          { code: 'A7.3', desc: 'Determina el punto imagen de puntos dados mediante una transformación en diversos contextos.' },
          { code: 'A7.4', desc: 'Resuelve problemas, de diversos contextos, relacionados con diversas transformaciones en el plano.' },
        ],
      },
    ],
  },
  {
    blockCode: '2. Relaciones y Álgebra',
    name: 'Relaciones y Álgebra',
    areaId: 'functions',
    totalPoints: 25,
    affirmations: [
      {
        code: 'A1',
        desc: 'Resuelve problemas, de diversos contextos, relacionados con elementos, propiedades o composición de funciones, en sus distintas representaciones.',
        targetPoints: 4,
        evidences: [
          { code: 'A1.1', desc: 'Identifica en diversos contextos si una relación dada en forma tabular, simbólica o gráfica corresponde a una función.' },
          { code: 'A1.2', desc: 'Determina elementos o propiedades de una función a partir de sus representaciones, en diversos contextos.' },
          { code: 'A1.3', desc: 'Determina la composición de dos funciones, en diversos contextos.' },
          { code: 'A1.4', desc: 'Determina las condiciones necesarias y suficientes para que se defina la composición de dos funciones en diversos contextos.' },
        ],
      },
      {
        code: 'A2',
        desc: 'Resuelve problemas utilizando distintas representaciones de algunas funciones algebraicas.',
        targetPoints: 3,
        evidences: [
          { code: 'A2.1', desc: 'Analiza una función a partir de sus representaciones en diversos contextos.' },
          { code: 'A2.2', desc: 'Reconoce la representación gráfica de una función lineal en diversos contextos.' },
          { code: 'A2.3', desc: 'Determina la pendiente, la intersección con el eje de las ordenadas o de las abscisas de una recta dada en forma gráfica o algebraica en diversos contextos.' },
          { code: 'A2.4', desc: 'Determina la ecuación de una recta utilizando datos relacionados con ella en diversos contextos.' },
          { code: 'A2.5', desc: 'Determina elementos o propiedades de la función cuadrática con criterio dado por f(x)= ax^2 + bx + c, a ≠ 0, en su representación gráfica o algebraica, en diversos contextos.' },
          { code: 'A2.6', desc: 'Identifica la representación gráfica a partir de la algebraica y viceversa, en diversos contextos (lineal o cuadrática).' },
        ],
      },
      {
        code: 'A3',
        desc: 'Resuelve problemas de diversos contextos, relacionados con funciones lineales y cuadráticas y sistemas de ecuaciones lineales con dos incógnitas.',
        targetPoints: 4,
        evidences: [
          { code: 'A3.1', desc: 'Resuelve problemas en contextos reales utilizando las funciones lineales y cuadráticas.' },
          { code: 'A3.2', desc: 'Determina si un sistema de dos ecuaciones lineales con dos incógnitas tiene una única solución, solución vacía o infinitas soluciones, en situaciones de diversos contextos.' },
          { code: 'A3.3', desc: 'Resuelve problemas, de diversos contextos (reales), relacionados con sistemas de dos ecuaciones con dos incógnitas.' },
        ],
      },
      {
        code: 'A4',
        desc: 'Resuelve problemas, de diversos contextos, relacionados con funciones: la inversa de la función lineal y de la raíz cuadrada, y las transformaciones (homotecia, traslación, reflexión) de la gráfica de la función de la forma f(x) = a√x + b + c.',
        targetPoints: 5,
        evidences: [
          { code: 'A4.1', desc: 'Identifica las condiciones para que una función tenga inversa en diversos contextos.' },
          { code: 'A4.2', desc: 'Reconoce la gráfica de la inversa de una función a partir de la gráfica de la función en diversos contextos.' },
          { code: 'A4.3', desc: 'Determina intervalos en los cuales una función representada gráficamente tiene inversa en diversos contextos.' },
          { code: 'A4.4', desc: 'Determina la función inversa de f(x) = mx + b, m ≠ 0, en diversos contextos.' },
          { code: 'A4.5', desc: 'Determina la transformación de la gráfica de la función dada por f(x) = a√x + b + c, en diversos contextos.' },
          { code: 'A4.6', desc: 'Resuelve problemas de diversos contextos (reales), relacionados con las funciones de la forma f(x) = a√x + b + c.' },
          { code: 'A4.7', desc: 'Reconoce la representación gráfica de la función dada por f(x) = a√x + b + c, a partir de la representación algebraica y viceversa en diversos contextos.' },
        ],
      },
      {
        code: 'A5',
        desc: 'Resuelve problemas de diversos contextos, relacionados con funciones, ecuaciones o simplificación de expresiones mediante la utilización de propiedades de los logaritmos.',
        targetPoints: 5,
        evidences: [
          { code: 'A5.1', desc: 'Identifica la función logarítmica como la inversa de la función exponencial en diversos contextos.' },
          { code: 'A5.2', desc: 'Determina elementos y propiedades de la función exponencial en su representación gráfica, tabular o algebraica en diversos contextos.' },
          { code: 'A5.3', desc: 'Determina elementos y propiedades de las funciones logarítmicas en su representación gráfica o algebraica, en diversos contextos.' },
          { code: 'A5.4', desc: 'Resuelve problemas en contextos reales utilizando ecuaciones exponenciales.' },
          { code: 'A5.5', desc: 'Determina elementos y propiedades de las funciones logarítmicas en su representación gráfica o algebraica en diversos contextos.' },
          { code: 'A5.6', desc: 'Simplifica expresiones mediante la utilización de propiedades de los logaritmos en diversos contextos.' },
          { code: 'A5.7', desc: 'Resuelve problemas en contextos reales utilizando ecuaciones logarítmicas.' },
          { code: 'A5.8', desc: 'Resuelve ecuaciones exponenciales de la forma a^f(x) = b^g(x) mediante la utilización de logaritmos, en diversos contextos.' },
          { code: 'A5.9', desc: 'Utiliza las funciones estudiadas para resolver problemas a partir de una situación dada (raíz cuadrada, exponencial y logarítmica; e inversa de esas funciones).' },
        ],
      },
      {
        code: 'A6',
        desc: 'Resuelve problemas en diversos contextos relacionados con modelos matemáticos en una situación dada.',
        targetPoints: 4,
        evidences: [
          { code: 'A6.1', desc: 'Identifica modelos matemáticos que involucran las funciones exponenciales en diversos contextos.' },
          { code: 'A6.2', desc: 'Determina elementos en modelos matemáticos que involucran las funciones exponenciales en diversos contextos.' },
          { code: 'A6.3', desc: 'Identifica modelos matemáticos que involucran las funciones logarítmicas en diversos contextos.' },
          { code: 'A6.4', desc: 'Determina elementos en modelos matemáticos que involucran las funciones logarítmicas, en diversos contextos.' },
          { code: 'A6.5', desc: 'Determina la función lineal, cuadrática, raíz cuadrada, exponencial o logarítmica que sirva de modelo en diversos contextos.' },
        ],
      },
    ],
  },
  {
    blockCode: '3. Estadística y Probabilidad',
    name: 'Estadística y Probabilidad',
    areaId: 'statistics',
    totalPoints: 12,
    affirmations: [
      {
        code: 'A1',
        desc: 'Resuelve problemas, de diversos contextos, relacionados con las medidas de posición de un grupo de datos cuantitativos o cualitativos.',
        targetPoints: 4,
        evidences: [
          { code: 'A1.1', desc: 'Utiliza en diferentes contextos las representaciones gráficas o tabulares para el análisis de datos cuantitativos o cualitativos.' },
          { code: 'A1.2', desc: 'Interpreta la información que proporcionan algunas medidas de posición (moda, media aritmética, mediana, cuartiles, el máximo o el mínimo) de un grupo de datos resumido en situaciones de diversos contextos.' },
          { code: 'A1.3', desc: 'Identifica la ubicación aproximada de las medidas de posición de acuerdo con el tipo de asimetría de la distribución de los datos en diversos contextos.' },
          { code: 'A1.4', desc: 'Determina la media aritmética en grupos de datos que tienen pesos relativos (o ponderación) diferentes entre sí en diversos contextos.' },
          { code: 'A1.5', desc: 'Determina la media aritmética ponderada en datos que se encuentran agrupados en una distribución de frecuencias en diversos contextos.' },
        ],
      },
      {
        code: 'A2',
        desc: 'Resuelve problemas, de diversos contextos, relacionados con probabilidades o eventos aleatorios.',
        targetPoints: 4,
        evidences: [
          { code: 'A2.1', desc: 'Determina los puntos muestrales del evento aleatorio obtenido mediante las operaciones: unión “U”, intersección “∩” o “complemento” de dos o más eventos aleatorios en diversos contextos.' },
          { code: 'A2.2', desc: 'Identifica diagramas de Venn correspondientes a operaciones (unión “U”, intersección “∩” o “complemento”) entre eventos aleatorios en diversos contextos.' },
          { code: 'A2.3', desc: 'Reconoce eventos aleatorios mutuamente excluyentes, en diversos contextos.' },
          { code: 'A2.4', desc: 'Resuelve problemas de diversos contextos relacionados con probabilidades obtenidas mediante axiomas o propiedades básicas.' },
          { code: 'A2.5', desc: 'Resuelve problemas de diversos contextos relacionados con probabilidades para la toma de decisiones en fenómenos aleatorios.' },
        ],
      },
      {
        code: 'A3',
        desc: 'Resuelve problemas de diversos contextos relacionados con el análisis de las medidas de posición o variabilidad de dos o más grupos en datos cuantitativos.',
        targetPoints: 4,
        evidences: [
          { code: 'A3.1', desc: 'Resuelve problemas de diversos contextos relacionados con la variabilidad de un grupo de datos a partir de la información que proporcionan algunas medidas (recorrido, recorrido intercuartílico, la variancia o la desviación estándar).' },
          { code: 'A3.2', desc: 'Compara medidas de posición o de variabilidad de dos grupos de datos mediante la utilización de diagramas de cajas en diversos contextos.' },
          { code: 'A3.3', desc: 'Aplica estandarización y el coeficiente de variación para la comparación de la posición o variabilidad de dos o más grupos de datos, en diversos contextos.' },
        ],
      },
    ],
  },
];
