export type SupportedLanguage = 'en' | 'es' | 'fr' | 'pt' | 'zh';

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  tagline: string;
  badge: string;
  
  // Modes & Inputs
  inputSectionTitle: string;
  modeStandard: string;
  modeSlope: string;
  modeSmartParse: string;
  line1Title: string;
  line2Title: string;
  coefA: string;
  coefB: string;
  constC: string;
  slopeK: string;
  interceptB1: string;
  interceptB2: string;
  parsePlaceholder: string;
  parseTip: string;
  parsedSuccess: string;
  parseError: string;

  // Results
  resultTitle: string;
  exactValueLabel: string;
  decimalLabel: string;
  formulaLabel: string;
  normalizedCoefficients: string;
  statusStrictlyParallel: string;
  statusCoincident: string;
  statusIntersecting: string;

  // Traps & Diagnostics
  trapRadarTitle: string;
  trapCheckScaling: string;
  trapCheckScalingTriggered: string;
  trapCheckScalingPassed: string;
  trapCheckSign: string;
  trapCheckSignTriggered: string;
  trapCheckSignPassed: string;
  notParallelWarningTitle: string;
  notParallelWarningDesc: string;

  // Canvas
  canvasTitle: string;
  canvasSubtitle: string;
  canvasZoomIn: string;
  canvasZoomOut: string;
  canvasReset: string;
  canvasGrid: string;
  canvasPerp: string;
  canvasPerpDist: string;

  // Methods
  tabsTitle: string;
  tabsSubtitle: string;
  methodStandard: string;
  methodCompletingSquare: string;
  methodPointToLine: string;
  methodNormalVector: string;
  methodStandardDesc: string;
  methodCompletingSquareDesc: string;
  methodPointToLineDesc: string;
  methodNormalVectorDesc: string;
  stepOf: string;
  copyStep: string;
  copiedStep: string;
  copyAll: string;
  copiedAll: string;
  latexDerivation: string;
  coreConclusion: string;
  examTrapWarning: string;

  // Param solver
  paramSolverBtn: string;
  paramSolverCloseBtn: string;
  paramSolverTitle: string;
  paramSolverBadge: string;
  paramSolverModel: string;
  paramSolverGivenDist: string;
  paramSolverStep1: string;
  paramSolverStep2: string;
  paramSolverResult: string;
  paramSolverWarning: string;

  // Presets
  presetsTitle: string;
  presetsSubtitle: string;
  presets: {
    id: string;
    category: string;
    title: string;
    description: string;
    hint: string;
  }[];

  // Practice Quiz
  quizTitle: string;
  quizSubtitle: string;
  quizNewQuestion: string;
  quizYourAnswer: string;
  quizSubmit: string;
  quizCorrect: string;
  quizIncorrect: string;
  quizViewSteps: string;

  // FAQ & Knowledge
  faqTitle: string;
  faq1Q: string;
  faq1A: string;
  faq2Q: string;
  faq2A: string;
  faq3Q: string;
  faq3A: string;

  // Share & Print
  shareBtn: string;
  shareCopied: string;
  printBtn: string;
  footerText: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: 'Distance Between Parallel Lines Calculator',
    appSubtitle: 'Step-by-Step Derivation & Completing the Square Solver',
    tagline: 'High-precision analytic geometry calculator with rigorous algebraic proofs, sign-error radar, and dynamic coordinate geometry.',
    badge: 'Analytic Geometry',

    inputSectionTitle: 'Line Equations Input',
    modeStandard: 'Standard Form (Ax + By + C = 0)',
    modeSlope: 'Slope-Intercept (y = mx + b)',
    modeSmartParse: 'Smart Text Parser',
    line1Title: 'Line 1 (l₁)',
    line2Title: 'Line 2 (l₂)',
    coefA: 'Coefficient A (x)',
    coefB: 'Coefficient B (y)',
    constC: 'Constant C',
    slopeK: 'Common Slope (m)',
    interceptB1: 'l₁ Intercept (b₁)',
    interceptB2: 'l₂ Intercept (b₂)',
    parsePlaceholder: 'Type e.g. 3x - 4y + 5 = 0 or 2x + 3y = 8 or y = 3x - 4',
    parseTip: 'Smart parser automatically identifies linear equations in any standard algebraic format.',
    parsedSuccess: 'Successfully parsed equation',
    parseError: 'Unable to parse. Please use format like Ax + By + C = 0 or y = mx + b',

    resultTitle: 'Calculated Perpendicular Distance',
    exactValueLabel: 'Exact Radical / Fraction Form',
    decimalLabel: 'Decimal Approximation',
    formulaLabel: 'Applied Formula',
    normalizedCoefficients: 'Normalized Coefficients',
    statusStrictlyParallel: 'Parallel (Valid)',
    statusCoincident: 'Coincident Lines (d = 0)',
    statusIntersecting: 'Intersecting (d = 0)',

    trapRadarTitle: 'Exam Sign & Scaling Trap Radar',
    trapCheckScaling: '1. Coefficient Homogenization Check',
    trapCheckScalingTriggered: 'Warning: Coefficients are not aligned! l₂ is scaled by factor k. Formulas fail if you do not divide by k first!',
    trapCheckScalingPassed: 'Passed: Coefficients of x and y are identical. Standard formula is directly applicable.',
    trapCheckSign: '2. Subtraction & Double Negative Check',
    trapCheckSignTriggered: 'Caution: Constant term is negative. |C₁ - (-C₂)| becomes |C₁ + C₂| (two negatives make a positive).',
    trapCheckSignPassed: 'Normal: Direct subtraction |C₁ - C₂| with absolute value ensuring non-negativity.',
    notParallelWarningTitle: 'Lines are NOT Parallel!',
    notParallelWarningDesc: 'The normal vectors cross product is non-zero. The lines intersect at a single point. Intersecting lines do not have a constant parallel distance.',

    canvasTitle: 'Dynamic Geometry Visualizer',
    canvasSubtitle: 'Interactive cartesian plane with pan & zoom',
    canvasZoomIn: 'Zoom In',
    canvasZoomOut: 'Zoom Out',
    canvasReset: 'Reset View',
    canvasGrid: 'Grid',
    canvasPerp: 'Perpendicular',
    canvasPerpDist: 'Perpendicular Distance',

    tabsTitle: 'Complete Step-by-Step Derivations',
    tabsSubtitle: 'Light-gray bordered cards highlighting every logical phase',
    methodStandard: '1. Standard Formula (Unified Coefs)',
    methodCompletingSquare: '2. Completing the Square Proof',
    methodPointToLine: '3. Point-to-Line Reduction',
    methodNormalVector: '4. Vector Projection',
    methodStandardDesc: 'Official exam derivation: rigorously unifies coefficients before substituting into the distance formula, preventing lost negative signs.',
    methodCompletingSquareDesc: 'Algebraic minimum proof: constructs the squared distance function of a moving point, completes the square to eliminate the linear term, and yields the absolute minimum.',
    methodPointToLineDesc: 'Alternative reduction: picks a neat grid point on Line 1 and uses the point-to-line perpendicular distance formula.',
    methodNormalVectorDesc: 'Geometric vector approach: projects the displacement vector between lines onto the unit normal vector.',
    stepOf: 'Step',
    copyStep: 'Copy Step',
    copiedStep: 'Copied!',
    copyAll: 'Copy All Steps',
    copiedAll: 'Copied to Clipboard!',
    latexDerivation: 'LaTeX Mathematical Steps',
    coreConclusion: 'Key Takeaway',
    examTrapWarning: 'Common Student Mistake',

    paramSolverBtn: 'Solve Unknown Parameter m',
    paramSolverCloseBtn: 'Close Parameter Solver',
    paramSolverTitle: 'Inverse Problem: Find Parameter m Given Distance d',
    paramSolverBadge: 'High Frequency Exam Problem',
    paramSolverModel: 'Model: Line l₁: Ax + By + C₁ = 0 and Line l₂: Ax + By + m = 0 are separated by distance d. Find m.',
    paramSolverGivenDist: 'Given Distance d',
    paramSolverStep1: 'Step 1: Set up the absolute value equation',
    paramSolverStep2: 'Step 2: Solve with Dual Roots (±)',
    paramSolverResult: 'Final Values for Parameter m:',
    paramSolverWarning: 'Do NOT forget the plus-or-minus sign (±)! A parallel line can lie on either side of l₁, yielding two distinct solutions.',

    presetsTitle: 'Standard Curriculum & Exam Presets',
    presetsSubtitle: 'Click any problem to immediately inspect derivations',
    presets: [
      {
        id: 'preset-1',
        category: 'Standard Integers',
        title: 'Classic 3:4:5 Pythagorean Triplet',
        description: 'Find distance between 3x - 4y - 1 = 0 and 3x - 4y + 9 = 0.',
        hint: 'Coefficients are identical (A=3, B=-4). Denominator: √(3² + (-4)²) = 5. Numerator: |-1 - 9| = 10.',
      },
      {
        id: 'preset-2',
        category: 'Scaling Trap',
        title: 'Proportional Coefficients (2x Scaled)',
        description: 'Find distance between 2x + 3y - 8 = 0 and 4x + 6y + 5 = 0.',
        hint: '4x+6y is 2× (2x+3y). You must divide l₂ by 2 before subtracting constants!',
      },
      {
        id: 'preset-3',
        category: 'Negative Sign Trap',
        title: 'Sign Inversion & Double Negatives',
        description: 'Find distance between -x + 2y - 4 = 0 and 2x - 4y + 7 = 0.',
        hint: 'Scaling ratio is -2. Dividing by -2 changes the signs; do not drop the negative symbol.',
      },
      {
        id: 'preset-4',
        category: 'Radical Simplification',
        title: 'Rationalizing Denominators (√5)',
        description: 'Find distance between x - 2y + 1 = 0 and x - 2y - 4 = 0.',
        hint: 'Denominator is √(1²+(-2)²) = √5. Final exact distance simplifies to √5.',
      },
      {
        id: 'preset-5',
        category: 'Horizontal & Vertical',
        title: 'Horizontal Lines Special Case',
        description: 'Find distance between y = 3 and y = -5.',
        hint: 'A=0, B=1. Perpendicular distance is simply the absolute difference of intercepts: |3 - (-5)| = 8.',
      },
      {
        id: 'preset-6',
        category: 'Completing Square',
        title: 'Quadratic Optimization Model',
        description: 'Find minimum distance between x + y - 2 = 0 and x + y + 4 = 0.',
        hint: 'Parameterize point on l₂ and complete the square to directly obtain the vertex minimum.',
      },
    ],

    quizTitle: 'Quick Knowledge Check',
    quizSubtitle: 'Test your understanding of parallel line distance concepts',
    quizNewQuestion: 'Next Practice Question',
    quizYourAnswer: 'Your Answer (d = ?)',
    quizSubmit: 'Verify Answer',
    quizCorrect: 'Brilliant! That is correct.',
    quizIncorrect: 'Not quite. Check the coefficient scaling or negative signs.',
    quizViewSteps: 'Inspect Full Breakdown',

    faqTitle: 'Frequently Asked Questions & Theoretical Proofs',
    faq1Q: 'Why must the coefficients of x and y be identical before applying the formula?',
    faq1A: 'The formula d = |C₁ - C₂| / √(A² + B²) comes from the projection of displacement onto the unit normal vector n / ||n|| = (A, B) / √(A² + B²). If one equation is multiplied by k, its normal vector is scaled by k, skewing the metric unless normalized first.',
    faq2Q: 'How does Completing the Square prove this formula without vectors?',
    faq2A: 'Express any point Q on l₂ in terms of x: Q(x, (-Ax - C₂)/B). The Euclidean squared distance to a fixed point P(x₀, y₀) on l₁ is a quadratic function S(x) = a x² + bx + c. Completing the square produces S(x) = a(x - x*)² + (C₁ - C₂)²/(A² + B²). Since the squared term is ≥ 0, the vertex constant is the absolute minimum distance squared.',
    faq3Q: 'What happens when lines are vertical or horizontal?',
    faq3A: 'For horizontal lines (y = k₁ and y = k₂), A = 0, B = 1, so d = |k₁ - k₂|. For vertical lines (x = c₁ and x = c₂), B = 0, A = 1, so d = |c₁ - c₂|.',

    shareBtn: 'Share Problem',
    shareCopied: 'Link Copied to Clipboard!',
    printBtn: 'Print Worksheet',
    footerText: 'Distance Between Parallel Lines Calculator · High School & College Analytic Geometry Solver',
  },

  es: {
    appName: 'Calculadora de Distancia Entre Rectas Paralelas',
    appSubtitle: 'Resolución Paso a Paso y Método de Completar el Cuadrado',
    tagline: 'Calculadora de geometría analítica con demostraciones algebraicas rigurosas, radar de signos y plano cartesiano dinámico.',
    badge: 'Geometría Analítica',

    inputSectionTitle: 'Entrada de Ecuaciones de Rectas',
    modeStandard: 'Forma General (Ax + By + C = 0)',
    modeSlope: 'Pendiente-Ordenada (y = mx + b)',
    modeSmartParse: 'Analizador Inteligente de Texto',
    line1Title: 'Recta 1 (l₁)',
    line2Title: 'Recta 2 (l₂)',
    coefA: 'Coeficiente A (x)',
    coefB: 'Coeficiente B (y)',
    constC: 'Término C',
    slopeK: 'Pendiente Común (m)',
    interceptB1: 'Ordenada l₁ (b₁)',
    interceptB2: 'Ordenada l₂ (b₂)',
    parsePlaceholder: 'Ej: 3x - 4y + 5 = 0 o 2x + 3y = 8 o y = 3x - 4',
    parseTip: 'El analizador reconoce automáticamente cualquier formato lineal algebraico.',
    parsedSuccess: 'Ecuación analizada con éxito',
    parseError: 'No se pudo interpretar. Usa el formato Ax + By + C = 0 o y = mx + b',

    resultTitle: 'Distancia Perpendicular Calculada',
    exactValueLabel: 'Forma Exacta (Radical / Fracción)',
    decimalLabel: 'Aproximación Decimal',
    formulaLabel: 'Fórmula Aplicada',
    normalizedCoefficients: 'Coeficientes Unificados',
    statusStrictlyParallel: 'Paralelas (Válido)',
    statusCoincident: 'Rectas Coincidentes (d = 0)',
    statusIntersecting: 'Rectas Secantes (d = 0)',

    trapRadarTitle: 'Radar de Trampas de Signos y Coeficientes',
    trapCheckScaling: '1. Comprobación de Homogeneización',
    trapCheckScalingTriggered: '¡Atención: Coeficientes desalineados! l₂ está multiplicada por factor k. ¡La fórmula fallará si no divides primero por k!',
    trapCheckScalingPassed: 'Correcto: Coeficientes de x e y idénticos. Puedes aplicar la fórmula directamente.',
    trapCheckSign: '2. Verificación de Signos Negativos',
    trapCheckSignTriggered: 'Cuidado: Término constante negativo. |C₁ - (-C₂)| se convierte en suma |C₁ + C₂| (menos por menos da más).',
    trapCheckSignPassed: 'Normal: Resta directa |C₁ - C₂| con valor absoluto que garantiza no negatividad.',
    notParallelWarningTitle: '¡Las rectas NO son paralelas!',
    notParallelWarningDesc: 'El producto cruzado de los vectores normales no es cero. Las rectas se cortan en un punto. No existe distancia paralela constante.',

    canvasTitle: 'Visualizador Geométrico Dinámico',
    canvasSubtitle: 'Plano cartesiano interactivo con zoom y arrastre',
    canvasZoomIn: 'Acercar',
    canvasZoomOut: 'Alejar',
    canvasReset: 'Restablecer',
    canvasGrid: 'Cuadrícula',
    canvasPerp: 'Perpendicular',
    canvasPerpDist: 'Distancia Perpendicular',

    tabsTitle: 'Desarrollo y Deducción Paso a Paso',
    tabsSubtitle: 'Tarjetas con bordes grises que destacan cada fase lógica',
    methodStandard: '1. Fórmula Estándar (Coeficientes Unificados)',
    methodCompletingSquare: '2. Demostración por Completación del Cuadrado',
    methodPointToLine: '3. Reducción a Punto-Recta',
    methodNormalVector: '4. Proyección de Vector Normal',
    methodStandardDesc: 'Método estándar de examen: unifica los coeficientes antes de sustituir, evitando errores en los signos negativos.',
    methodCompletingSquareDesc: 'Demostración de mínimo algebraico: construye la función cuadrática de distancia y completa el cuadrado para encontrar el vértice mínimo.',
    methodPointToLineDesc: 'Método alternativo: toma un punto entero sobre l₁ y aplica la fórmula de distancia punto a recta.',
    methodNormalVectorDesc: 'Enfoque vectorial: proyecta el vector que une ambas rectas sobre el vector normal unitario.',
    stepOf: 'Paso',
    copyStep: 'Copiar Paso',
    copiedStep: '¡Copiado!',
    copyAll: 'Copiar Todo el Desarrollo',
    copiedAll: '¡Copiado al portapapeles!',
    latexDerivation: 'Desarrollo Matemático en LaTeX',
    coreConclusion: 'Conclusión Clave',
    examTrapWarning: 'Error Común de Examen',

    paramSolverBtn: 'Hallar Parámetro Desconocido m',
    paramSolverCloseBtn: 'Cerrar Buscador de Parámetro',
    paramSolverTitle: 'Problema Inverso: Hallar Parámetro m Dada la Distancia d',
    paramSolverBadge: 'Pregunta Clásica de Examen',
    paramSolverModel: 'Modelo: Recta l₁: Ax + By + C₁ = 0 y l₂: Ax + By + m = 0 distantes d unidades. Hallar m.',
    paramSolverGivenDist: 'Distancia Dada d',
    paramSolverStep1: 'Paso 1: Plantear la ecuación con valor absoluto',
    paramSolverStep2: 'Paso 2: Despejar con Doble Solución (±)',
    paramSolverResult: 'Valores finales para el parámetro m:',
    paramSolverWarning: '¡NUNCA olvides el signo más/menos (±)! Una recta paralela puede ubicarse a ambos lados, generando DOS soluciones.',

    presetsTitle: 'Modelos Típicos de Examen',
    presetsSubtitle: 'Haz clic en cualquier ejercicio para ver su resolución completa',
    presets: [
      {
        id: 'preset-1',
        category: 'Enteros Estándar',
        title: 'Trío Pitagórico Clásico 3:4:5',
        description: 'Distancia entre 3x - 4y - 1 = 0 y 3x - 4y + 9 = 0.',
        hint: 'Coeficientes idénticos (A=3, B=-4). Denominador: √(3² + (-4)²) = 5. Numerador: |-1 - 9| = 10.',
      },
      {
        id: 'preset-2',
        category: 'Trampa de Multiplicador',
        title: 'Coeficientes Proporcionales (Doble)',
        description: 'Distancia entre 2x + 3y - 8 = 0 y 4x + 6y + 5 = 0.',
        hint: '4x+6y es el doble de 2x+3y. ¡Debes dividir l₂ entre 2 antes de restar las constantes!',
      },
      {
        id: 'preset-3',
        category: 'Trampa de Signo Negativo',
        title: 'Inversión de Signos y Menos por Menos',
        description: 'Distancia entre -x + 2y - 4 = 0 y 2x - 4y + 7 = 0.',
        hint: 'El factor es -2. Al dividir entre -2 los signos se invierten; no olvides el signo negativo.',
      },
      {
        id: 'preset-4',
        category: 'Racionalización',
        title: 'Racionalizar Denominadores (√5)',
        description: 'Distancia entre x - 2y + 1 = 0 y x - 2y - 4 = 0.',
        hint: 'El denominador es √(1²+(-2)²) = √5. El resultado exacto racionalizado es √5.',
      },
      {
        id: 'preset-5',
        category: 'Casos Particulares',
        title: 'Rectas Horizontales',
        description: 'Distancia entre y = 3 e y = -5.',
        hint: 'A=0, B=1. La distancia es la diferencia absoluta de ordenadas: |3 - (-5)| = 8.',
      },
      {
        id: 'preset-6',
        category: 'Completar el Cuadrado',
        title: 'Modelo de Optimización Cuadrática',
        description: 'Distancia mínima entre x + y - 2 = 0 y x + y + 4 = 0.',
        hint: 'Parametriza un punto sobre l₂ y completa el cuadrado para obtener el mínimo exacto.',
      },
    ],

    quizTitle: 'Autoevaluación Rápida',
    quizSubtitle: 'Pon a prueba tus conocimientos sobre distancia entre rectas',
    quizNewQuestion: 'Siguiente Pregunta de Práctica',
    quizYourAnswer: 'Tu Respuesta (d = ?)',
    quizSubmit: 'Comprobar Respuesta',
    quizCorrect: '¡Excelente! Respuesta correcta.',
    quizIncorrect: 'Incorrecto. Revisa la homogeneización de coeficientes o los signos.',
    quizViewSteps: 'Ver Paso a Paso',

    faqTitle: 'Preguntas Frecuentes y Fundamento Teórico',
    faq1Q: '¿Por qué los coeficientes de x e y deben ser iguales antes de aplicar la fórmula?',
    faq1A: 'La fórmula d = |C₁ - C₂| / √(A² + B²) se basa en la proyección sobre el vector normal unitario (A, B) / √(A² + B²). Si una recta está multiplicada por k, su normal queda escalada y distorsiona el cálculo métrico.',
    faq2Q: '¿Cómo demuestra el método de completar el cuadrado esta fórmula?',
    faq2A: 'Expresando la distancia euclidiana al cuadrado entre dos puntos como una función cuadrática S(x) = a x² + bx + c. Al completar el cuadrado se obtiene el vértice S(x) = a(x - x*)² + (C₁ - C₂)²/(A² + B²). Como el término al cuadrado es ≥ 0, el residuo es el mínimo absoluto.',
    faq3Q: '¿Qué sucede cuando las rectas son puramente verticales u horizontales?',
    faq3A: 'Para rectas horizontales (y = k₁ e y = k₂), la distancia es |k₁ - k₂|. Para rectas verticales (x = c₁ y x = c₂), la distancia es |c₁ - c₂|.',

    shareBtn: 'Compartir Ejercicio',
    shareCopied: '¡Enlace copiado al portapapeles!',
    printBtn: 'Imprimir Ficha',
    footerText: 'Calculadora de Distancia Entre Rectas Paralelas · Geometría Analítica Paso a Paso',
  },

  fr: {
    appName: 'Calculateur de Distance Entre Deux Droites Parallèles',
    appSubtitle: 'Résolution Étape par Étape et Méthode de Complétion du Carré',
    tagline: 'Calculateur de géométrie analytique haute précision avec preuves algébriques rigoureuses, détection des pièges de signe et repère dynamique.',
    badge: 'Géométrie Analytique',

    inputSectionTitle: 'Saisie des Équations de Droites',
    modeStandard: 'Forme Cartésienne (Ax + By + C = 0)',
    modeSlope: 'Équation Réduite (y = mx + p)',
    modeSmartParse: 'Analyseur de Texte Intelligent',
    line1Title: 'Droite 1 (d₁)',
    line2Title: 'Droite 2 (d₂)',
    coefA: 'Coefficient A (x)',
    coefB: 'Coefficient B (y)',
    constC: 'Constante C',
    slopeK: 'Coefficient Directeur (m)',
    interceptB1: 'Ordonnée à l\'origine d₁ (p₁)',
    interceptB2: 'Ordonnée à l\'origine d₂ (p₂)',
    parsePlaceholder: 'Ex: 3x - 4y + 5 = 0 ou 2x + 3y = 8 ou y = 3x - 4',
    parseTip: 'L\'analyseur identifie automatiquement n\'importe quel format d\'équation linéaire.',
    parsedSuccess: 'Équation analysée avec succès',
    parseError: 'Format non reconnu. Utilisez Ax + By + C = 0 ou y = mx + p',

    resultTitle: 'Distance Perpendiculaire Calculée',
    exactValueLabel: 'Forme Exacte (Radical / Fraction)',
    decimalLabel: 'Valeur Décimale Approchée',
    formulaLabel: 'Formule Appliquée',
    normalizedCoefficients: 'Coefficients Normalisés',
    statusStrictlyParallel: 'Parallèles (Valide)',
    statusCoincident: 'Droites Confondues (d = 0)',
    statusIntersecting: 'Droites Sécantes (d = 0)',

    trapRadarTitle: 'Radar Anti-Pièges de Signes et Coefficients',
    trapCheckScaling: '1. Vérification d\'Homogénéisation',
    trapCheckScalingTriggered: 'Alerte: Coefficients non alignés! d₂ est multipliée par k. La formule échoue si vous ne divisez pas par k d\'abord!',
    trapCheckScalingPassed: 'Validé: Les coefficients de x et y sont identiques. La formule directe s\'applique.',
    trapCheckSign: '2. Soustraction et Règle des Signes',
    trapCheckSignTriggered: 'Attention: Constante négative. |C₁ - (-C₂)| devient |C₁ + C₂| (moins par moins donne plus).',
    trapCheckSignPassed: 'Normal: Soustraction directe |C₁ - C₂| avec valeur absolue garantissant la positivité.',
    notParallelWarningTitle: 'Les droites ne sont PAS parallèles!',
    notParallelWarningDesc: 'Le produit en croix des vecteurs normaux est non nul. Les droites sont sécantes en un point.',

    canvasTitle: 'Repère Géométrique Dynamique',
    canvasSubtitle: 'Plan cartésien interactif avec zoom et déplacement',
    canvasZoomIn: 'Zoomer',
    canvasZoomOut: 'Dézoomer',
    canvasReset: 'Réinitialiser',
    canvasGrid: 'Grille',
    canvasPerp: 'Perpendiculaire',
    canvasPerpDist: 'Distance Perpendiculaire',

    tabsTitle: 'Démonstrations Détaillées Étape par Étape',
    tabsSubtitle: 'Cartes bordées de gris mettant en valeur chaque étape logique',
    methodStandard: '1. Formule Standard (Coefficients Unifiés)',
    methodCompletingSquare: '2. Méthode du Carré Parfait (Extremum)',
    methodPointToLine: '3. Distance Point-Droite',
    methodNormalVector: '4. Projection de Vecteur Normal',
    methodStandardDesc: 'Méthode officielle d\'examen: unifie les coefficients avant substitution pour éviter les erreurs de signe.',
    methodCompletingSquareDesc: 'Démonstration par extremum algébrique: établit la fonction de distance au carré et complète le carré pour trouver le sommet minimal.',
    methodPointToLineDesc: 'Méthode alternative: choisit un point remarquable sur d₁ et calcule sa distance à la droite d₂.',
    methodNormalVectorDesc: 'Approche vectorielle: projette le vecteur reliant les droites sur le vecteur normal unitaire.',
    stepOf: 'Étape',
    copyStep: 'Copier l\'étape',
    copiedStep: 'Copié!',
    copyAll: 'Copier Toute la Démarche',
    copiedAll: 'Copié dans le presse-papiers!',
    latexDerivation: 'Développement Mathématique LaTeX',
    coreConclusion: 'Conclusion Clé',
    examTrapWarning: 'Erreur Classique d\'Élève',

    paramSolverBtn: 'Résoudre le Paramètre Inconnu m',
    paramSolverCloseBtn: 'Fermer le Solveur de Paramètre',
    paramSolverTitle: 'Problème Inverse: Trouver m à partir de la distance d',
    paramSolverBadge: 'Question Fréquente aux Examens',
    paramSolverModel: 'Modèle: Droites d₁: Ax + By + C₁ = 0 et d₂: Ax + By + m = 0 distantes de d. Trouver m.',
    paramSolverGivenDist: 'Distance Donnée d',
    paramSolverStep1: 'Étape 1: Poser l\'équation avec valeur absolue',
    paramSolverStep2: 'Étape 2: Résoudre avec Deux Solutions (±)',
    paramSolverResult: 'Valeurs finales pour le paramètre m:',
    paramSolverWarning: 'N\'oubliez JAMAIS le signe ± ! Une droite parallèle peut se situer de part et d\'autre de d₁, donnant deux solutions distinctes.',

    presetsTitle: 'Exercices Types du Baccalauréat',
    presetsSubtitle: 'Cliquez sur un exercice pour charger sa résolution complète',
    presets: [
      {
        id: 'preset-1',
        category: 'Entiers Classiques',
        title: 'Triplet Pythagoricien 3:4:5',
        description: 'Distance entre 3x - 4y - 1 = 0 et 3x - 4y + 9 = 0.',
        hint: 'Coefficients identiques (A=3, B=-4). Dénominateur: √(3² + (-4)²) = 5. Numérateur: |-1 - 9| = 10.',
      },
      {
        id: 'preset-2',
        category: 'Piège de Facteur',
        title: 'Coefficients Proportionnels (x2)',
        description: 'Distance entre 2x + 3y - 8 = 0 et 4x + 6y + 5 = 0.',
        hint: '4x+6y est le double de 2x+3y. Divisez d₂ par 2 avant de soustraire les constantes!',
      },
      {
        id: 'preset-3',
        category: 'Piège de Signe Moins',
        title: 'Inversion de Signe et Double Négation',
        description: 'Distance entre -x + 2y - 4 = 0 et 2x - 4y + 7 = 0.',
        hint: 'Le facteur multiplicateur est -2. La division par -2 inverse les signes.',
      },
      {
        id: 'preset-4',
        category: 'Simplification de Racine',
        title: 'Rendre Rationnel le Dénominateur (√5)',
        description: 'Distance entre x - 2y + 1 = 0 et x - 2y - 4 = 0.',
        hint: 'Le dénominateur est √(1²+(-2)²) = √5. La distance simplifiée vaut √5.',
      },
      {
        id: 'preset-5',
        category: 'Cas Particulier',
        title: 'Droites Horizontales',
        description: 'Distance entre y = 3 et y = -5.',
        hint: 'A=0, B=1. La distance est l\'écart absolu des ordonnées: |3 - (-5)| = 8.',
      },
      {
        id: 'preset-6',
        category: 'Forme Canonique',
        title: 'Modèle d\'Optimisation Quadratique',
        description: 'Distance minimale entre x + y - 2 = 0 et x + y + 4 = 0.',
        hint: 'Paramétrez un point sur d₂ et complétez le carré pour obtenir le minimum.',
      },
    ],

    quizTitle: 'Auto-Évaluation Express',
    quizSubtitle: 'Testez votre maîtrise du calcul de distance entre parallèles',
    quizNewQuestion: 'Nouvelle Question d\'Entraînement',
    quizYourAnswer: 'Votre Réponse (d = ?)',
    quizSubmit: 'Vérifier la Réponse',
    quizCorrect: 'Bravo! C\'est la réponse exacte.',
    quizIncorrect: 'Pas tout à fait. Vérifiez l\'homogénéisation ou les signes négatifs.',
    quizViewSteps: 'Voir la Démarche Complète',

    faqTitle: 'Foire Aux Questions & Démonstrations Théoriques',
    faq1Q: 'Pourquoi faut-il unifier les coefficients avant d\'appliquer la formule?',
    faq1A: 'La formule d = |C₁ - C₂| / √(A² + B²) provient de la projection sur le vecteur normal unitaire (A, B) / √(A² + B²). Si l\'équation est multipliée par k, le vecteur normal est dilaté et fausse le calcul métrique.',
    faq2Q: 'Comment la complétion du carré prouve-t-elle cette formule sans vecteurs?',
    faq2A: 'On exprime la distance euclidienne d\'un point variable sous forme d\'un polynôme du second degré S(x) = a x² + bx + c. La forme canonique livre S(x) = a(x - x*)² + (C₁ - C₂)²/(A² + B²), dont le minimum absolu est le terme constant.',
    faq3Q: 'Qu\'en est-il pour des droites purement horizontales ou verticales?',
    faq3A: 'Pour des horizontales (y = p₁ et y = p₂), la distance est |p₁ - p₂|. Pour des verticales (x = c₁ et x = c₂), la distance est |c₁ - c₂|.',

    shareBtn: 'Partager l\'Exercice',
    shareCopied: 'Lien copié dans le presse-papiers!',
    printBtn: 'Imprimer la Fiche',
    footerText: 'Calculateur de Distance Entre Deux Droites Parallèles · Géométrie Analytique Lycée & Supérieur',
  },

  pt: {
    appName: 'Calculadora de Distância Entre Retas Paralelas',
    appSubtitle: 'Resolução Passo a Passo e Método de Completar o Quadrado',
    tagline: 'Calculadora de geometria analítica com demonstrações algébricas rigorosas, radar de sinais e plano cartesiano interativo.',
    badge: 'Geometria Analítica',

    inputSectionTitle: 'Entrada de Equações de Retas',
    modeStandard: 'Forma Geral (Ax + By + C = 0)',
    modeSlope: 'Equação Reduzida (y = mx + q)',
    modeSmartParse: 'Analisador Inteligente de Texto',
    line1Title: 'Reta 1 (r₁)',
    line2Title: 'Reta 2 (r₂)',
    coefA: 'Coeficiente A (x)',
    coefB: 'Coeficiente B (y)',
    constC: 'Termo Independente C',
    slopeK: 'Coeficiente Angular (m)',
    interceptB1: 'Coeficiente Linear r₁ (q₁)',
    interceptB2: 'Coeficiente Linear r₂ (q₂)',
    parsePlaceholder: 'Ex: 3x - 4y + 5 = 0 ou 2x + 3y = 8 ou y = 3x - 4',
    parseTip: 'O analisador reconhece automaticamente qualquer formato linear algébrico.',
    parsedSuccess: 'Equação analisada com sucesso',
    parseError: 'Formato não reconhecido. Use Ax + By + C = 0 ou y = mx + q',

    resultTitle: 'Distância Perpendicular Calculada',
    exactValueLabel: 'Forma Exata (Radical / Fração)',
    decimalLabel: 'Aproximação Decimal',
    formulaLabel: 'Fórmula Aplicada',
    normalizedCoefficients: 'Coeficientes Unificados',
    statusStrictlyParallel: 'Paralelas (Válido)',
    statusCoincident: 'Retas Coincidentes (d = 0)',
    statusIntersecting: 'Retas Concorrentes (d = 0)',

    trapRadarTitle: 'Radar de Armadilhas de Sinais e Coeficientes',
    trapCheckScaling: '1. Verificação de Homogeneização',
    trapCheckScalingTriggered: 'Atenção: Coeficientes desalinhados! r₂ está multiplicada por k. A fórmula falha se você não dividir por k primeiro!',
    trapCheckScalingPassed: 'Correto: Coeficientes de x e y idênticos. Aplicação direta da fórmula permitida.',
    trapCheckSign: '2. Verificação de Sinais Negativos',
    trapCheckSignTriggered: 'Cuidado: Termo constante negativo. |C₁ - (-C₂)| vira soma |C₁ + C₂| (menos com menos dá mais).',
    trapCheckSignPassed: 'Normal: Subtração direta |C₁ - C₂| com valor absoluto garantindo não negatividade.',
    notParallelWarningTitle: 'As retas NÃO são paralelas!',
    notParallelWarningDesc: 'O produto cruzado dos vetores normais é diferente de zero. As retas se cruzam em um único ponto.',

    canvasTitle: 'Visualizador Geométrico Dinâmico',
    canvasSubtitle: 'Plano cartesiano interativo com zoom e arrasto',
    canvasZoomIn: 'Aproximar',
    canvasZoomOut: 'Afastar',
    canvasReset: 'Redefinir',
    canvasGrid: 'Grade',
    canvasPerp: 'Perpendicular',
    canvasPerpDist: 'Distância Perpendicular',

    tabsTitle: 'Demonstração Completa Passo a Passo',
    tabsSubtitle: 'Cartões com bordas cinzas destacando cada fase lógica',
    methodStandard: '1. Fórmula Padrão (Coeficientes Unificados)',
    methodCompletingSquare: '2. Método de Completar o Quadrado (Mínimo)',
    methodPointToLine: '3. Distância Ponto-Reta',
    methodNormalVector: '4. Projeção de Vetor Normal',
    methodStandardDesc: 'Método padrão de exames: unifica os coeficientes antes da substituição, evitando perda de sinais negativos.',
    methodCompletingSquareDesc: 'Demonstração por mínimo algébrico: constrói a função quadrática da distância e completa o quadrado para obter o vértice mínimo.',
    methodPointToLineDesc: 'Método alternativo: escolhe um ponto inteiro sobre r₁ e calcula a distância até a reta r₂.',
    methodNormalVectorDesc: 'Abordagem vetorial: projeta o vetor que une ambas as retas sobre o vetor normal unitário.',
    stepOf: 'Etapa',
    copyStep: 'Copiar Etapa',
    copiedStep: 'Copiado!',
    copyAll: 'Copiar Todo o Raciocínio',
    copiedAll: 'Copiado para a área de transferência!',
    latexDerivation: 'Desenvolvimento Matemático em LaTeX',
    coreConclusion: 'Conclusão Principal',
    examTrapWarning: 'Erro Comum de Alunos no Vestibular/ENEM',

    paramSolverBtn: 'Calcular Parâmetro Desconhecido m',
    paramSolverCloseBtn: 'Fechar Calculador de Parâmetro',
    paramSolverTitle: 'Problema Inverso: Descobrir o Parâmetro m Dada a Distância d',
    paramSolverBadge: 'Questão Clássica de Vestibular',
    paramSolverModel: 'Modelo: Retas r₁: Ax + By + C₁ = 0 e r₂: Ax + By + m = 0 com distância d. Encontrar m.',
    paramSolverGivenDist: 'Distância Fornecida d',
    paramSolverStep1: 'Passo 1: Montar a equação com módulo',
    paramSolverStep2: 'Passo 2: Resolver com Duas Soluções (±)',
    paramSolverResult: 'Valores finais para o parâmetro m:',
    paramSolverWarning: 'NUNCA esqueça o sinal ±! Uma reta paralela pode estar de qualquer um dos lados de r₁, gerando duas soluções reais.',

    presetsTitle: 'Modelos Típicos do ENEM e Vestibulares',
    presetsSubtitle: 'Clique em qualquer exercício para ver a resolução completa',
    presets: [
      {
        id: 'preset-1',
        category: 'Inteiros Padrão',
        title: 'Terno Pitagórico Clássico 3:4:5',
        description: 'Distância entre 3x - 4y - 1 = 0 e 3x - 4y + 9 = 0.',
        hint: 'Coeficientes idênticos (A=3, B=-4). Denominador: √(3² + (-4)²) = 5. Numerador: |-1 - 9| = 10.',
      },
      {
        id: 'preset-2',
        category: 'Armadilha de Múltiplo',
        title: 'Coeficientes Proporcionais (Dobro)',
        description: 'Distância entre 2x + 3y - 8 = 0 e 4x + 6y + 5 = 0.',
        hint: '4x+6y é o dobro de 2x+3y. Você deve dividir r₂ por 2 antes de subtrair as constantes!',
      },
      {
        id: 'preset-3',
        category: 'Armadilha de Sinal',
        title: 'Inversão de Sinais e Menos com Menos',
        description: 'Distância entre -x + 2y - 4 = 0 e 2x - 4y + 7 = 0.',
        hint: 'O fator é -2. Dividir por -2 inverte os sinais; tome cuidado redobrado com o sinal negativo.',
      },
      {
        id: 'preset-4',
        category: 'Racionalização',
        title: 'Racionalização de Denominador (√5)',
        description: 'Distância entre x - 2y + 1 = 0 e x - 2y - 4 = 0.',
        hint: 'O denominador é √(1²+(-2)²) = √5. A distância exata racionalizada resulta em √5.',
      },
      {
        id: 'preset-5',
        category: 'Casos Notáveis',
        title: 'Retas Horizontais',
        description: 'Distância entre y = 3 e y = -5.',
        hint: 'A=0, B=1. A distância é a diferença absoluta das ordenadas: |3 - (-5)| = 8.',
      },
      {
        id: 'preset-6',
        category: 'Completar Quadrados',
        title: 'Modelo de Otimização Quadrática',
        description: 'Distância mínima entre x + y - 2 = 0 e x + y + 4 = 0.',
        hint: 'Parametrize um ponto em r₂ e complete o quadrado para encontrar o vértice mínimo.',
      },
    ],

    quizTitle: 'Autoavaliação Rápida',
    quizSubtitle: 'Teste seu domínio sobre a distância entre retas paralelas',
    quizNewQuestion: 'Nova Questão de Prática',
    quizYourAnswer: 'Sua Resposta (d = ?)',
    quizSubmit: 'Verificar Resposta',
    quizCorrect: 'Parabéns! Resposta correta.',
    quizIncorrect: 'Incorreto. Verifique a homogeneização de coeficientes ou sinais.',
    quizViewSteps: 'Ver Passo a Passo',

    faqTitle: 'Perguntas Frequentes & Fundamentação Teórica',
    faq1Q: 'Por que os coeficientes de x e y precisam ser unificados antes de aplicar a fórmula?',
    faq1A: 'A fórmula d = |C₁ - C₂| / √(A² + B²) decorre da projeção sobre o vetor normal unitário (A, B) / √(A² + B²). Se uma equação estiver multiplicada por k, o vetor normal fica ampliado e corrompe a métrica.',
    faq2Q: 'Como o método de completar o quadrado prova essa fórmula sem usar vetores?',
    faq2A: 'Expressando a distância euclidiana ao quadrado de um ponto móvel como uma função quadrática S(x) = a x² + bx + c. Completando o quadrado, obtemos S(x) = a(x - x*)² + (C₁ - C₂)²/(A² + B²). Como o termo quadrático é ≥ 0, o termo constante é o mínimo absoluto.',
    faq3Q: 'O que ocorre quando as retas são horizontais ou verticais?',
    faq3A: 'Para retas horizontais (y = q₁ e y = q₂), a distância é |q₁ - q₂|. Para retas verticais (x = c₁ e x = c₂), a distância é |c₁ - c₂|.',

    shareBtn: 'Compartilhar Exercício',
    shareCopied: 'Link copiado para a área de transferência!',
    printBtn: 'Imprimir Folha de Exercício',
    footerText: 'Calculadora de Distância Entre Retas Paralelas · Geometria Analítica para Ensino Médio e Vestibulares',
  },

  zh: {
    appName: '两平行直线间距离计算器',
    appSubtitle: '详细解题步骤、配方法拆解与高二解析几何避坑',
    tagline: '支持LaTeX公式逐步排版、系数同化拆解、函数配方法求最值及动态几何画板验证。',
    badge: '高二解析几何专项',

    inputSectionTitle: '输入两直线方程',
    modeStandard: '一般式 (Ax + By + C = 0)',
    modeSlope: '斜截式 (y = kx + b)',
    modeSmartParse: '智能文本解析',
    line1Title: '直线 1 (l₁)',
    line2Title: '直线 2 (l₂)',
    coefA: 'x 系数 A',
    coefB: 'y 系数 B',
    constC: '常数项 C',
    slopeK: '共同斜率 k',
    interceptB1: 'l₁ 纵截距 b₁',
    interceptB2: 'l₂ 纵截距 b₂',
    parsePlaceholder: '输入如 3x - 4y + 5 = 0 或 2x + 3y = 8 或 y = 3x - 4',
    parseTip: '智能解析器自动识别常见的数学直线方程形式并提取系数。',
    parsedSuccess: '成功解析直线方程',
    parseError: '未识别方程格式，请使用如 Ax + By + C = 0 或 y = kx + b',

    resultTitle: '距离计算结果速查',
    exactValueLabel: '精确数学值（高考试卷标准格式）',
    decimalLabel: '十进制四位小数近似',
    formulaLabel: '代入公式',
    normalizedCoefficients: '同化系数',
    statusStrictlyParallel: '严格平行 (有解)',
    statusCoincident: '两线重合 (d = 0)',
    statusIntersecting: '两线相交 (不适用)',

    trapRadarTitle: '高二易错点防丢分自查雷达（符号与倍数诊断）',
    trapCheckScaling: '1. 系数同化检查',
    trapCheckScalingTriggered: '触发陷阱：l₂ 的系数是 l₁ 的倍数。手算时若直接代入原常数项必错，必须先同化系数！',
    trapCheckScalingPassed: '通过：两方程中 x, y 系数完全对齐，可直接套用公式。',
    trapCheckSign: '2. 分子减法与符号拆解',
    trapCheckSignTriggered: '防错提示：常数项为负数，减去负数等于加上正数，切记负负得正！',
    trapCheckSignPassed: '正常：分子直接相减并加绝对值，保证非负。',
    notParallelWarningTitle: '注意：当前两直线并不平行！',
    notParallelWarningDesc: '检测到法向量交叉积不为零，两直线在平面上相交于一点，不存在固定的平行线垂线段距离。',

    canvasTitle: '动态几何画板·解析验证',
    canvasSubtitle: '支持拖拽漫游与缩放的直角坐标画板',
    canvasZoomIn: '放大',
    canvasZoomOut: '缩小',
    canvasReset: '复位视图',
    canvasGrid: '网格',
    canvasPerp: '垂线段',
    canvasPerpDist: '垂直间距',

    tabsTitle: '全流程逐步推导与拆解展示',
    tabsSubtitle: '浅灰色边框卡片高亮每一个核心推理环节，杜绝手算丢符号',
    methodStandard: '1. 标准公式法 (同化系数)',
    methodCompletingSquare: '2. 二次函数·配方法拆解',
    methodPointToLine: '3. 点到直线转化法',
    methodNormalVector: '4. 几何法向量投影',
    methodStandardDesc: '高考与期末阅卷标准步骤：先严谨检验平行并同化系数，再代入公式展开绝对值，杜绝手算丢负号。',
    methodCompletingSquareDesc: '高中最值核心推导：设直线上动点坐标，将距离平方写成关于自变量的一元二次函数，通过配完全平方式严格证明极小值。',
    methodPointToLineDesc: '化归转化思想：在一条直线上任取特殊整点或截距点，转化为点到直线的垂线段距离，双向验算。',
    methodNormalVectorDesc: '向量空间视角：提取两直线的公共法向量，计算两线间任意连线向量在法向量上的投影长度。',
    stepOf: '步骤',
    copyStep: '复制本步解析',
    copiedStep: '已复制！',
    copyAll: '复制本题全部推导',
    copiedAll: '完整推导已复制到剪贴板！',
    latexDerivation: 'LaTeX 数学推导',
    coreConclusion: '核心结论',
    examTrapWarning: '高二易错雷区',

    paramSolverBtn: '已知距离反求未知参数 m',
    paramSolverCloseBtn: '收起参数 m 求解器',
    paramSolverTitle: '高二压轴必考：已知两平行线距离 d，反求未知参数 m',
    paramSolverBadge: '常考易漏解（双解）',
    paramSolverModel: '题目模型：已知直线 l₁: Ax + By + C₁ = 0 与平行直线 l₂: Ax + By + m = 0 的距离为 d，求参数 m 的值。',
    paramSolverGivenDist: '给定距离 d',
    paramSolverStep1: '步骤 1：列出绝对值等式',
    paramSolverStep2: '步骤 2：解绝对值方程（注意正负双解！）',
    paramSolverResult: '参数 m 最终结果：',
    paramSolverWarning: '在填空题中，平行线分布在 l₁ 的两侧各有一条，因此参数 m 必须有两个解！切勿只写一个导致失分。',

    presetsTitle: '高考与期末常考典题题库',
    presetsSubtitle: '点击任意题目自动载入验证',
    presets: [
      {
        id: 'preset-1',
        category: '高频真题·系数一致',
        title: '标准整系数基础题（3:4:5 勾股数）',
        description: '求直线 3x - 4y - 1 = 0 与 3x - 4y + 9 = 0 的距离。',
        hint: '最基础题型，A=3, B=-4，分母根号下为 3²+(-4)²=25，开方为 5。分子注意 |-1 - 9| = 10。',
      },
      {
        id: 'preset-2',
        category: '高考易错·倍数同化',
        title: '系数成倍数陷阱题（2倍缩放）',
        description: '求直线 2x + 3y - 8 = 0 与 4x + 6y + 5 = 0 的距离。',
        hint: '4x+6y 是 2x+3y 的 2 倍！直接套公式算 |-8 - 5| 必错！必须将 4x+6y+5=0 同除以 2 得到 C₂\' = 5/2。',
      },
      {
        id: 'preset-3',
        category: '符号陷阱·负号翻转',
        title: '全负号与相反系数陷阱',
        description: '求直线 -x + 2y - 4 = 0 与 2x - 4y + 7 = 0 的距离。',
        hint: '缩放倍数为 -2！两边同除以 -2 时，C 变为 -7/2，负负得正，极易丢掉负号。',
      },
      {
        id: 'preset-4',
        category: '高考真题·含根号',
        title: '全国卷真题（有理化化简）',
        description: '求直线 x - 2y + 1 = 0 与 x - 2y - 4 = 0 的距离。',
        hint: '分母为 √(1² + (-2)²) = √5，结果为 5/√5 = √5。考察根号分母有理化能力。',
      },
      {
        id: 'preset-5',
        category: '特殊位置·水平铅垂',
        title: '水平线/铅垂线特例',
        description: '求水平直线 y = 3 与 y = -5 的距离。',
        hint: 'A=0, B=1，距离直接是纵截距之差的绝对值 |3 - (-5)| = 8。',
      },
      {
        id: 'preset-6',
        category: '二次配方·经典证明',
        title: '配方法拆解极值教学经典模型',
        description: '求直线 x + y - 2 = 0 与 x + y + 4 = 0 之间的最短距离。',
        hint: '用配方法将动点距离平方展开为二次函数，顶点处配方完美消去交叉项，直观感受解析几何的精妙！',
      },
    ],

    quizTitle: '随堂实战模拟测试',
    quizSubtitle: '检验平行线距离公式与符号掌握程度',
    quizNewQuestion: '随机下一题',
    quizYourAnswer: '输入你的计算结果 (d = ?)',
    quizSubmit: '提交验算',
    quizCorrect: '回答正确！完全掌握了该题型的计算要领。',
    quizIncorrect: '计算有误，请注意检查系数是否已化同以及负负得正符号。',
    quizViewSteps: '载入此题并查看完整拆解',

    faqTitle: '常见考点答疑与深度几何原理',
    faq1Q: '为什么代入距离公式前必须把 x, y 的系数化为完全一致？',
    faq1A: '平行线距离公式 d = |C₁ - C₂| / √(A² + B²) 本质上是法向量的投影。分母的 √(A² + B²) 恰好是法向量的模长。如果一个方程的系数扩大了 k 倍，常数项和向量模长没有同比例抵消就会导致结果错误。',
    faq2Q: '高二解析几何中如何用「配方法」证明两平行线距离公式？',
    faq2A: '在 l₁ 上任取一点 P(x₀, y₀)，l₂ 上的任意动点 Q(x, y) 的坐标可表示为 x 的一次函数。两点欧氏距离平方 S(x) 展开后是关于自变量 x 的一元二次函数。通过加上并减去一次项系数一半的平方完成配方：S(x) = a(x - x*)² + (C₁ - C₂)²/(A² + B²)。因为平方式非负，其顶点纵坐标即为最短距离的平方，开方即得公式。',
    faq3Q: '遇到水平线 (y=c) 或铅垂线 (x=c) 时如何快速口算？',
    faq3A: '水平线斜率为 0，距离即为两纵截距之差的绝对值 |b₁ - b₂|；铅垂线斜率不存在，距离即为两横截距之差的绝对值 |x₁ - x₂|。',

    shareBtn: '分享题目链接',
    shareCopied: '专属题目链接已复制！',
    printBtn: '打印解题卡/作业纸',
    footerText: '两平行直线间距离计算器 · 高二解析几何逐步推导与配方法拆解 · 国际多语言版',
  },
};
