import { SupportedLanguage } from '../i18n/translations';
import { Fraction } from './fraction';

export interface StepTextConfig {
  std1Title: string;
  std1Badge: string;
  std1Desc: string;
  std1Takeaway: string;

  std2Title: string;
  std2Badge: string;
  std2DescEqual: string;
  std2DescScaled: (kStr: string) => string;
  std2Takeaway: (A: number, B: number, C1: number, C2Str: string) => string;
  std2Trap: (c1: number, c2: number) => string;

  std3Title: string;
  std3Badge: string;
  std3Desc: string;
  std3Takeaway: (c1: number, c2Str: string, cDiffStr: string, absDeltaStr: string) => string;
  std3Trap: string;

  std4Title: string;
  std4Badge: string;
  std4Desc: string;
  std4Takeaway: (distLatex: string, distDec: number) => string;

  // Completing the square texts
  sq1Title: string;
  sq1Badge: string;
  sq1Desc: (line1Latex: string) => string;
  sq1Takeaway: (x: number, y: number) => string;

  sq2Title: string;
  sq2Badge: string;
  sq2Desc: string;
  sq2Takeaway: string;

  sq3Title: string;
  sq3Badge: string;
  sq3Desc: (x0: number) => string;
  sq3Takeaway: (num: number, den: number) => string;

  sq4Title: string;
  sq4Badge: string;
  sq4Desc: string;
  sq4Takeaway: string;

  sq5Title: string;
  sq5Badge: string;
  sq5Desc: string;
  sq5Takeaway: (distLatex: string, qX: number, qY: number) => string;

  // Point to line texts
  pt1Title: string;
  pt1Badge: string;
  pt1Desc: string;
  pt1Takeaway: (A: number, B: number, C1: number, x: number, y: number) => string;

  pt2Title: string;
  pt2Badge: string;
  pt2Desc: string;
  pt2Takeaway: string;

  // Normal vector texts
  vec1Title: string;
  vec1Badge: string;
  vec1Desc: string;
  vec1Takeaway: string;

  vec2Title: string;
  vec2Badge: string;
  vec2Desc: (x1: number, y1: number, x2: number, y2: number) => string;
  vec2Takeaway: string;
}

export const STEP_TEXTS: Record<SupportedLanguage, StepTextConfig> = {
  en: {
    std1Title: 'Verify Parallelism & Slope Condition',
    std1Badge: 'Parallel Check',
    std1Desc:
      'Verify if the lines are parallel. Parallel lines share identical or proportional normal vectors: cross product A₁B₂ - A₂B₁ = 0.',
    std1Takeaway: 'Cross product is 0: lines are parallel (or both vertical).',

    std2Title: 'Crucial Step: Coefficient Homogenization (Aligning A & B)',
    std2Badge: 'Unify Coefficients',
    std2DescEqual:
      'Observation: The coefficients of x and y are already identical. No scaling is needed.',
    std2DescScaled: (kStr) =>
      `[Warning] Coefficients are unaligned! Line 2 is scaled by factor k = ${kStr}. You must divide Line 2 by ${kStr} before applying the distance formula!`,
    std2Takeaway: (A, B, C1, C2Str) =>
      `Unified coefficients: A = ${A}, B = ${B}, C₁ = ${C1}, C₂' = ${C2Str}`,
    std2Trap: (c1, c2) =>
      `Directly computing |${c1} - (${c2})| without scaling produces an incorrect result! Always equalize coefficients first.`,

    std3Title: 'Substitute into Parallel Distance Formula & Expand Signs',
    std3Badge: 'Formula Substitution',
    std3Desc:
      'Substitute unified constants C₁, C₂\' and coefficients A, B into d = |C₁ - C₂\'| / √(A² + B²). Pay close attention to negative signs.',
    std3Takeaway: (c1, c2Str, cDiffStr, absDeltaStr) =>
      `Numerator expansion: |${c1} - (${c2Str})| = |${cDiffStr}| = ${absDeltaStr}`,
    std3Trap:
      'When the constant is negative, subtracting a negative yields an addition (two negatives make a positive).',

    std4Title: 'Radical Simplification, Rationalization & Final Exact Value',
    std4Badge: 'Exact Result',
    std4Desc:
      'Evaluate √(A² + B²). If radicals remain in the denominator, rationalize by multiplying the root to both numerator and denominator.',
    std4Takeaway: (distLatex, distDec) =>
      `Exact distance is ${distLatex} (approximately ${distDec.toFixed(4)}).`,

    sq1Title: 'Select Base Point P on Line 1',
    sq1Badge: 'Base Point',
    sq1Desc: (lLatex) => `Pick a convenient reference point P(x₀, y₀) on line l₁: ${lLatex}.`,
    sq1Takeaway: (x, y) => `Selected reference point P(${x}, ${y}).`,

    sq2Title: 'Express Moving Point Q on Line 2 & Build Distance Function',
    sq2Badge: 'Distance Function',
    sq2Desc:
      'Let Q(x, y) be an arbitrary point on l₂. Express y in terms of x and construct the squared Euclidean distance S(x) = |PQ|².',
    sq2Takeaway: 'The squared distance is a quadratic function in x.',

    sq3Title: 'Expand into Quadratic Form: S(u) = a u² + b u + c',
    sq3Badge: 'Quadratic Form',
    sq3Desc: (x0) => `Set displacement u = x - (${x0}). Expand and group descending powers:`,
    sq3Takeaway: (num, den) =>
      `Quadratic leading coefficient is (A²+B²)/B² = ${num}/${den} > 0, opening upwards with a unique absolute minimum.`,

    sq4Title: 'Completing the Square: Eliminate the Linear Term',
    sq4Badge: 'Complete Square',
    sq4Desc:
      'Factor out the leading coefficient and add/subtract the square of half the linear coefficient to form a perfect square:',
    sq4Takeaway:
      'Since the squared term is ≥ 0, the function attains its global minimum exactly when the square equals 0!',

    sq5Title: 'Extract Vertex Minimum & Prove Formula',
    sq5Badge: 'Proof Complete',
    sq5Desc:
      'The constant remainder at the vertex of the parabola is the minimum squared distance. Taking the square root proves the formula.',
    sq5Takeaway: (distLatex, qX, qY) =>
      `Minimum distance is d = ${distLatex}, attained at perpendicular foot Q(${qX.toFixed(2)}, ${qY.toFixed(2)})!`,

    pt1Title: 'Select Clean Point on Line 1',
    pt1Badge: 'Choose Point',
    pt1Desc: 'Take a point P(x₀, y₀) on l₁ and reduce the problem to point-to-line distance.',
    pt1Takeaway: (A, B, C1, x, y) => `Verified: ${A}(${x}) + ${B}(${y}) + (${C1}) = 0.`,

    pt2Title: 'Apply Point-to-Line Distance Formula d(P, l₂)',
    pt2Badge: 'Point-to-Line',
    pt2Desc: 'Use d = |A₂ x₀ + B₂ y₀ + C₂| / √(A₂² + B₂²).',
    pt2Takeaway: 'Both methods yield the exact same distance, confirming the result.',

    vec1Title: 'Extract Normal Vector & Unit Direction',
    vec1Badge: 'Normal Vector',
    vec1Desc: 'Common normal vector perpendicular to both lines is n = (A, B).',
    vec1Takeaway: 'Perpendicular distance equals the scalar projection of line displacement onto n.',

    vec2Title: 'Compute Vector Dot Product Projection',
    vec2Badge: 'Scalar Projection',
    vec2Desc: (x1, y1, x2, y2) =>
      `Connect P(${x1}, ${y1}) and Q(${x2.toFixed(2)}, ${y2.toFixed(2)}), projecting onto normal vector.`,
    vec2Takeaway: 'Geometric projection validates the algebraic formula.',
  },

  es: {
    std1Title: 'Comprobar Paralelismo y Pendientes',
    std1Badge: 'Verificación',
    std1Desc:
      'Verificar si las rectas son paralelas: producto cruzado de vectores normales A₁B₂ - A₂B₁ = 0.',
    std1Takeaway: 'El producto cruzado es 0: las rectas son paralelas (o ambas verticales).',

    std2Title: 'Paso Crucial: Homogeneización de Coeficientes (Alinear A y B)',
    std2Badge: 'Unificar Coeficientes',
    std2DescEqual:
      'Observación: Los coeficientes de x e y ya son idénticos. No se requiere factor de escala.',
    std2DescScaled: (kStr) =>
      `[Alerta] ¡Coeficientes desalineados! La recta 2 está multiplicada por k = ${kStr}. ¡Debes dividir la recta 2 entre ${kStr} antes de usar la fórmula!`,
    std2Takeaway: (A, B, C1, C2Str) =>
      `Coeficientes unificados: A = ${A}, B = ${B}, C₁ = ${C1}, C₂' = ${C2Str}`,
    std2Trap: (c1, c2) =>
      `¡Calcular directamente |${c1} - (${c2})| sin escalar genera un error grave! Homogeneiza siempre primero.`,

    std3Title: 'Sustituir en la Fórmula de Distancia y Cuidar Signos',
    std3Badge: 'Sustitución',
    std3Desc:
      'Sustituir C₁, C₂\' y los coeficientes A, B en d = |C₁ - C₂\'| / √(A² + B²). Prestar atención a los signos negativos.',
    std3Takeaway: (c1, c2Str, cDiffStr, absDeltaStr) =>
      `Desarrollo del numerador: |${c1} - (${c2Str})| = |${cDiffStr}| = ${absDeltaStr}`,
    std3Trap:
      'Al restar un término constante negativo, se convierte en suma (menos por menos da más).',

    std4Title: 'Simplificación de Radicales, Racionalización y Valor Exacto',
    std4Badge: 'Resultado Exacto',
    std4Desc:
      'Calcular √(A² + B²). Si quedan raíces en el denominador, racionalizar multiplicando numerador y denominador.',
    std4Takeaway: (distLatex, distDec) =>
      `La distancia exacta es ${distLatex} (aproximadamente ${distDec.toFixed(4)}).`,

    sq1Title: 'Elegir Punto Base P en la Recta 1',
    sq1Badge: 'Punto Base',
    sq1Desc: (lLatex) => `Elegir un punto de referencia P(x₀, y₀) en l₁: ${lLatex}.`,
    sq1Takeaway: (x, y) => `Punto de referencia seleccionado P(${x}, ${y}).`,

    sq2Title: 'Expresar Punto Móvil Q en la Recta 2 y Función Distancia',
    sq2Badge: 'Función Distancia',
    sq2Desc:
      'Sea Q(x, y) un punto sobre l₂. Despejar y en función de x y construir la función de distancia euclidiana al cuadrado S(x) = |PQ|².',
    sq2Takeaway: 'La distancia al cuadrado es una función polinómica cuadrática en x.',

    sq3Title: 'Desarrollar en Forma Cuadrática: S(u) = a u² + b u + c',
    sq3Badge: 'Forma Cuadrática',
    sq3Desc: (x0) => `Definir desplazamiento u = x - (${x0}). Agrupar potencias descendentes:`,
    sq3Takeaway: (num, den) =>
      `El coeficiente principal es (A²+B²)/B² = ${num}/${den} > 0, parábola convexa con mínimo absoluto único.`,

    sq4Title: 'Completar el Cuadrado para Eliminar el Término Lineal',
    sq4Badge: 'Completar Cuadrado',
    sq4Desc:
      'Factorizar el coeficiente cuadrático y sumar/restar el cuadrado de la mitad del término lineal para formar un trinomio cuadrado perfecto:',
    sq4Takeaway:
      'Dado que el cuadrado es ≥ 0, la función alcanza su mínimo global exactamente cuando dicho término es cero.',

    sq5Title: 'Extraer el Vértice Mínimo y Demostrar la Fórmula',
    sq5Badge: 'Demostración Lista',
    sq5Desc:
      'El residuo constante en el vértice es la distancia mínima al cuadrado. Aplicando raíz cuadrada se obtiene la fórmula oficial.',
    sq5Takeaway: (distLatex, qX, qY) =>
      `La distancia mínima es d = ${distLatex}, con pie de la perpendicular en Q(${qX.toFixed(2)}, ${qY.toFixed(2)})!`,

    pt1Title: 'Elegir Punto Entero en Recta 1',
    pt1Badge: 'Elegir Punto',
    pt1Desc: 'Tomar P(x₀, y₀) en l₁ y reducir a distancia de un punto a la recta l₂.',
    pt1Takeaway: (A, B, C1, x, y) => `Verificado: ${A}(${x}) + ${B}(${y}) + (${C1}) = 0.`,

    pt2Title: 'Aplicar Fórmula Punto-Recta d(P, l₂)',
    pt2Badge: 'Punto a Recta',
    pt2Desc: 'Usar d = |A₂ x₀ + B₂ y₀ + C₂| / √(A₂² + B₂²).',
    pt2Takeaway: 'Ambos métodos coinciden exactamente, confirmando el resultado.',

    vec1Title: 'Extraer Vector Normal y Dirección',
    vec1Badge: 'Vector Normal',
    vec1Desc: 'El vector normal perpendicular a ambas rectas es n = (A, B).',
    vec1Takeaway: 'La distancia es la proyección escalar del vector entre rectas sobre n.',

    vec2Title: 'Calcular Proyección Vectorial por Producto Escalar',
    vec2Badge: 'Proyección',
    vec2Desc: (x1, y1, x2, y2) =>
      `Unir P(${x1}, ${y1}) y Q(${x2.toFixed(2)}, ${y2.toFixed(2)}) y proyectar sobre n.`,
    vec2Takeaway: 'La proyección geométrica confirma el resultado algebraico.',
  },

  fr: {
    std1Title: 'Vérifier le Parallélisme et les Pentes',
    std1Badge: 'Vérification',
    std1Desc:
      'Vérifier si les droites sont parallèles : produit en croix des vecteurs normaux A₁B₂ - A₂B₁ = 0.',
    std1Takeaway: 'Le produit en croix vaut 0 : les droites sont parallèles (ou verticales).',

    std2Title: 'Étape Cruciale : Homogénéisation des Coefficients',
    std2Badge: 'Unifier Coefficients',
    std2DescEqual:
      'Observation : Les coefficients de x et y sont déjà identiques. Aucun facteur d\'échelle nécessaire.',
    std2DescScaled: (kStr) =>
      `[Alerte] Coefficients non alignés ! La droite 2 est multipliée par k = ${kStr}. Vous devez diviser la droite 2 par ${kStr} avant d\'appliquer la formule !`,
    std2Takeaway: (A, B, C1, C2Str) =>
      `Coefficients unifiés : A = ${A}, B = ${B}, C₁ = ${C1}, C₂' = ${C2Str}`,
    std2Trap: (c1, c2) =>
      `Calculer directement |${c1} - (${c2})| sans normaliser fausse le résultat ! Homogénéisez toujours d\'abord.`,

    std3Title: 'Substitution dans la Formule et Gestion des Signes',
    std3Badge: 'Substitution',
    std3Desc:
      'Substituer C₁, C₂\' et les coefficients A, B dans d = |C₁ - C₂\'| / √(A² + B²). Attention aux signes négatifs.',
    std3Takeaway: (c1, c2Str, cDiffStr, absDeltaStr) =>
      `Développement du numérateur : |${c1} - (${c2Str})| = |${cDiffStr}| = ${absDeltaStr}`,
    std3Trap:
      'Soustraire une constante négative revient à une addition (la règle des signes : moins par moins donne plus).',

    std4Title: 'Simplification des Racines et Valeur Exacte',
    std4Badge: 'Résultat Exact',
    std4Desc:
      'Calculer √(A² + B²). Si des racines subsistent au dénominateur, rendre rationnel le dénominateur.',
    std4Takeaway: (distLatex, distDec) =>
      `La distance exacte est ${distLatex} (environ ${distDec.toFixed(4)}).`,

    sq1Title: 'Choisir un Point de Référence P sur la Droite 1',
    sq1Badge: 'Point Base',
    sq1Desc: (lLatex) => `Choisir un point P(x₀, y₀) sur d₁ : ${lLatex}.`,
    sq1Takeaway: (x, y) => `Point de référence sélectionné P(${x}, ${y}).`,

    sq2Title: 'Exprimer le Point Mobile Q sur la Droite 2',
    sq2Badge: 'Fonction Distance',
    sq2Desc:
      'Soit Q(x, y) sur d₂. Exprimer y en fonction de x et établir la fonction de distance au carré S(x) = |PQ|².',
    sq2Takeaway: 'Le carré de la distance est un polynôme du second degré en x.',

    sq3Title: 'Développer sous Forme Quadratique : S(u) = a u² + b u + c',
    sq3Badge: 'Forme Quadratique',
    sq3Desc: (x0) => `Poser le déplacement u = x - (${x0}). Regrouper les puissances :`,
    sq3Takeaway: (num, den) =>
      `Le coefficient dominant est (A²+B²)/B² = ${num}/${den} > 0, admettant un minimum absolu unique.`,

    sq4Title: 'Mise sous Forme Canonique (Complétion du Carré)',
    sq4Badge: 'Complétion Carré',
    sq4Desc:
      'Factoriser le terme de plus haut degré et former un carré parfait pour éliminer le terme en u :',
    sq4Takeaway:
      'Puisque le carré est ≥ 0, le minimum global est atteint exactement quand le terme au carré s\'annule.',

    sq5Title: 'Extraire le Minimum du Sommet et Conclure',
    sq5Badge: 'Démonstration Finie',
    sq5Desc:
      'Le terme constant restant au sommet est le carré de la distance minimale. La racine carrée livre la formule.',
    sq5Takeaway: (distLatex, qX, qY) =>
      `La distance minimale vaut d = ${distLatex}, atteinte au pied de la hauteur Q(${qX.toFixed(2)}, ${qY.toFixed(2)}) !`,

    pt1Title: 'Choisir un Point Entier sur d₁',
    pt1Badge: 'Choix Point',
    pt1Desc: 'Prendre P(x₀, y₀) sur d₁ et se ramener à la distance du point à la droite d₂.',
    pt1Takeaway: (A, B, C1, x, y) => `Vérifié : ${A}(${x}) + ${B}(${y}) + (${C1}) = 0.`,

    pt2Title: 'Appliquer la Formule Point-Droite d(P, d₂)',
    pt2Badge: 'Point-Droite',
    pt2Desc: 'Calculer d = |A₂ x₀ + B₂ y₀ + C₂| / √(A₂² + B₂²).',
    pt2Takeaway: 'Les deux méthodes donnent exactement le même résultat.',

    vec1Title: 'Extraire le Vecteur Normal et sa Norme',
    vec1Badge: 'Vecteur Normal',
    vec1Desc: 'Le vecteur normal commun orthogonal aux deux droites est n = (A, B).',
    vec1Takeaway: 'La distance est la projection scalaire sur n.',

    vec2Title: 'Calculer la Projection par Produit Scalaire',
    vec2Badge: 'Projection Scalaire',
    vec2Desc: (x1, y1, x2, y2) =>
      `Relier P(${x1}, ${y1}) et Q(${x2.toFixed(2)}, ${y2.toFixed(2)}) et projeter sur n.`,
    vec2Takeaway: 'La projection vectorielle valide la formule algébrique.',
  },

  pt: {
    std1Title: 'Verificar Paralelismo e Coeficientes Angulares',
    std1Badge: 'Verificação',
    std1Desc:
      'Verificar se as retas são paralelas: produto cruzado dos vetores normais A₁B₂ - A₂B₁ = 0.',
    std1Takeaway: 'O produto cruzado é 0: as retas são paralelas (ou verticais).',

    std2Title: 'Passo Crucial: Homogeneização de Coeficientes (Alinhar A e B)',
    std2Badge: 'Unificar Coeficientes',
    std2DescEqual:
      'Observação: Os coeficientes de x e y já são idênticos. Nenhum fator de escala necessário.',
    std2DescScaled: (kStr) =>
      `[Alerta] Coeficientes desalinhados! A reta 2 está multiplicada por k = ${kStr}. Você deve dividir a reta 2 por ${kStr} antes de aplicar a fórmula!`,
    std2Takeaway: (A, B, C1, C2Str) =>
      `Coeficientes unificados: A = ${A}, B = ${B}, C₁ = ${C1}, C₂' = ${C2Str}`,
    std2Trap: (c1, c2) =>
      `Calcular diretamente |${c1} - (${c2})| sem escalar produz erro grave! Homogeneize sempre antes.`,

    std3Title: 'Substituição na Fórmula e Cuidado com Sinais',
    std3Badge: 'Substituição',
    std3Desc:
      'Substituir C₁, C₂\' e coeficientes A, B em d = |C₁ - C₂\'| / √(A² + B²). Muita atenção aos sinais negativos.',
    std3Takeaway: (c1, c2Str, cDiffStr, absDeltaStr) =>
      `Desenvolvimento do numerador: |${c1} - (${c2Str})| = |${cDiffStr}| = ${absDeltaStr}`,
    std3Trap:
      'Ao subtrair uma constante negativa, vira soma (menos com menos dá mais).',

    std4Title: 'Simplificação de Radicais, Racionalização e Valor Exato',
    std4Badge: 'Resultado Exato',
    std4Desc:
      'Calcular √(A² + B²). Se restarem raízes no denominador, racionalizar multiplicando numerador e denominador.',
    std4Takeaway: (distLatex, distDec) =>
      `A distância exata é ${distLatex} (aproximadamente ${distDec.toFixed(4)}).`,

    sq1Title: 'Escolher Ponto de Referência P na Reta 1',
    sq1Badge: 'Ponto Base',
    sq1Desc: (lLatex) => `Escolher um ponto P(x₀, y₀) em r₁: ${lLatex}.`,
    sq1Takeaway: (x, y) => `Ponto de referência selecionado P(${x}, ${y}).`,

    sq2Title: 'Expressar Ponto Móvel Q na Reta 2 e Função Distância',
    sq2Badge: 'Função Distância',
    sq2Desc:
      'Seja Q(x, y) em r₂. Isolar y em função de x e construir a função de distância euclidiana ao quadrado S(x) = |PQ|².',
    sq2Takeaway: 'A distância ao quadrado é uma função polinomial do 2º grau em x.',

    sq3Title: 'Desenvolver na Forma Quadrática: S(u) = a u² + b u + c',
    sq3Badge: 'Forma Quadrática',
    sq3Desc: (x0) => `Definir deslocamento u = x - (${x0}). Agrupar potências decrescentes:`,
    sq3Takeaway: (num, den) =>
      `O coeficiente principal é (A²+B²)/B² = ${num}/${den} > 0, parábola com concavidade para cima e ponto de mínimo único.`,

    sq4Title: 'Completar o Quadrado para Eliminar o Termo Linear',
    sq4Badge: 'Completar Quadrado',
    sq4Desc:
      'Fatorar o coeficiente quadrático e somar/subtrair o quadrado da metade do coeficiente linear:',
    sq4Takeaway:
      'Como o quadrado é ≥ 0, a função atinge seu mínimo global exatamente quando o termo ao quadrado é zero.',

    sq5Title: 'Extrair o Vértice Mínimo e Demonstrar a Fórmula',
    sq5Badge: 'Demonstração Concluída',
    sq5Desc:
      'O resíduo constante no vértice é a distância mínima ao quadrado. Extraindo a raiz quadrada obtém-se a fórmula.',
    sq5Takeaway: (distLatex, qX, qY) =>
      `A distância mínima é d = ${distLatex}, com pé da perpendicular em Q(${qX.toFixed(2)}, ${qY.toFixed(2)})!`,

    pt1Title: 'Escolher Ponto Inteiro em r₁',
    pt1Badge: 'Escolha de Ponto',
    pt1Desc: 'Tomar P(x₀, y₀) em r₁ e reduzir ao problema de distância ponto a reta r₂.',
    pt1Takeaway: (A, B, C1, x, y) => `Verificado: ${A}(${x}) + ${B}(${y}) + (${C1}) = 0.`,

    pt2Title: 'Aplicar Fórmula Ponto-Reta d(P, r₂)',
    pt2Badge: 'Ponto a Reta',
    pt2Desc: 'Usar d = |A₂ x₀ + B₂ y₀ + C₂| / √(A₂² + B₂²).',
    pt2Takeaway: 'Ambos os métodos chegam ao mesmo valor, validando a resposta.',

    vec1Title: 'Extrair Vetor Normal e Módulo',
    vec1Badge: 'Vetor Normal',
    vec1Desc: 'O vetor normal ortogonal a ambas as retas é n = (A, B).',
    vec1Takeaway: 'A distância é a projeção escalar sobre o vetor normal unitário.',

    vec2Title: 'Calcular Projeção por Produto Escalar',
    vec2Badge: 'Projeção Escalar',
    vec2Desc: (x1, y1, x2, y2) =>
      `Ligar P(${x1}, ${y1}) e Q(${x2.toFixed(2)}, ${y2.toFixed(2)}) e projetar sobre n.`,
    vec2Takeaway: 'A projeção vetorial confirma a dedução algébrica.',
  },

  zh: {
    std1Title: '判定两直线平行性与斜率关系',
    std1Badge: '平行检验',
    std1Desc:
      '先验证两条直线是否平行。若法向量成比例（即交叉相乘差为 0），则两直线平行。高中常考陷阱是忽略直线相交或重合情况。',
    std1Takeaway: '交叉相乘差为 0，确认两直线平行（斜率相等或同为铅垂线）。',

    std2Title: '关键避坑：系数同化拆解（统一 A 和 B）',
    std2Badge: '核心避坑',
    std2DescEqual: '观察发现，两方程中 x 与 y 的系数已经完全相同，无需缩放倍数。',
    std2DescScaled: (kStr) =>
      `【易错预警】两方程 x, y 系数未统一！l₂ 的系数是 l₁ 的 k = ${kStr} 倍。必须将方程 l₂ 两边同除以 k = ${kStr}，否则代入公式会导致结果严重错误！`,
    std2Takeaway: (A, B, C1, C2Str) =>
      `统一后：A = ${A}, B = ${B}, C₁ = ${C1}, C₂' = ${C2Str}`,
    std2Trap: (c1, c2) =>
      `许多同学直接用原式常数项算 |${c1} - (${c2})|，得出错误答案！必须先统一系数！`,

    std3Title: '代入平行线距离公式与符号拆解',
    std3Badge: '公式代入',
    std3Desc:
      '将同化后的常数项 C₁, C₂\' 以及共同系数 A, B 代入两平行线距离公式 d = |C₁ - C₂\'| / √(A² + B²)。注意括号与负负得正运算！',
    std3Takeaway: (c1, c2Str, cDiffStr, absDeltaStr) =>
      `分子绝对值展开：|${c1} - (${c2Str})| = |${cDiffStr}| = ${absDeltaStr}`,
    std3Trap:
      '常数项为负数时，相减变成加法（减去负数等于加上正数），手算切勿丢掉双重符号！',

    std4Title: '分母根号化简、有理化与最终化简',
    std4Badge: '精简结果',
    std4Desc:
      '计算分母根号项 √(A² + B²)，若分母含有根式，进行分母有理化，输出规范的精确根式/分数形式。',
    std4Takeaway: (distLatex, distDec) =>
      `两平行线间距离精确值为 ${distLatex}（保留四位小数约为 ${distDec.toFixed(4)}）。`,

    sq1Title: '在第一条直线上取基准定点 P',
    sq1Badge: '配方起步',
    sq1Desc: (lLatex) => `在直线 l₁: ${lLatex} 上选取一组容易计算的坐标定点 P(x₀, y₀)。`,
    sq1Takeaway: (x, y) => `基准点选取为 P(${x}, ${y})。`,

    sq2Title: '用自变量表示第二条直线上的动点 Q 并列出距离函数',
    sq2Badge: '建立二次函数',
    sq2Desc:
      '设直线 l₂ 上任意动点为 Q(x, y)。由方程解出 y 表达式，设两点间距离平方为函数 S(x) = |PQ|²。',
    sq2Takeaway: '距离的平方是关于自变量 x 的一元二次多项式函数。',

    sq3Title: '展开整理为二次函数标准型：S(u) = a u² + b u + c',
    sq3Badge: '展开变形',
    sq3Desc: (x0) => `令位移变量 u = x - (${x0})。展开并按降幂排列二次项与一次项：`,
    sq3Takeaway: (num, den) =>
      `二次项系数为 (A²+B²)/B² = ${num}/${den} > 0，开口向上，存在唯一的绝对极小值。`,

    sq4Title: '核心配方法拆解：加上并减去一次项系数一半的平方',
    sq4Badge: '配方极值',
    sq4Desc: '【配方法核心拆解】提取二次项系数，构造完全平方式 (u - u*)²：',
    sq4Takeaway:
      '因为平方式 (u - u*)² ≥ 0，当且仅当平方式为 0 时，函数取得最小值！',

    sq5Title: '求出最小值并开方得到两直线间最短距离',
    sq5Badge: '配方得证',
    sq5Desc:
      '通过配方法求出的二次函数顶点纵坐标，就是动点到直线的垂线段长度平方！开方即可严格求出距离。',
    sq5Takeaway: (distLatex, qX, qY) =>
      `配方法不仅求出最短距离 d = ${distLatex}，还确定了垂足动点坐标 Q(${qX.toFixed(2)}, ${qY.toFixed(2)})！`,

    pt1Title: '在直线 l₁ 上任取一个特殊整点或截距点',
    pt1Badge: '选定特殊点',
    pt1Desc:
      '两平行线间距离处处相等，因此只需在 l₁ 上取任意一点 P(x₀, y₀)，转化为求点 P 到直线 l₂ 的距离。',
    pt1Takeaway: (A, B, C1, x, y) => `代入检验：${A}(${x}) + ${B}(${y}) + (${C1}) = 0，确保点在直线上。`,

    pt2Title: '套用点到直线距离公式 d(P, l₂)',
    pt2Badge: '点线距离',
    pt2Desc: '点到直线的距离公式为 d = |A₂ x₀ + B₂ y₀ + C₂| / √(A₂² + B₂²)。',
    pt2Takeaway: '两种方法结果完全一致，互为验算，杜绝计算失误！',

    vec1Title: '提取两直线的法向量与方向',
    vec1Badge: '法向量分析',
    vec1Desc: '两条直线的公共法向量为 n = (A, B)，它同时垂直于两直线。',
    vec1Takeaway: '两平行直线间的距离即为两线上任两点连线向量在法向量上的投影长度绝对值。',

    vec2Title: '计算向量投影距离',
    vec2Badge: '投影公式',
    vec2Desc: (x1, y1, x2, y2) =>
      `连接 P(${x1}, ${y1}) 与 Q(${x2.toFixed(2)}, ${y2.toFixed(2)})，计算内积投影。`,
    vec2Takeaway: '向量法直观展示了垂直距离的几何本质。',
  },
};
