# 📐 Parallel Lines Distance Calculator (两平行直线间距离计算器)

A high-performance, precision analytic geometry web application designed to compute and rigorously prove the perpendicular distance between two parallel lines. Built for high school, college students, and mathematics educators worldwide.

> **Live Demo**: [https://parallel-lines-distance-calculator.formulacalckit.com](https://parallel-lines-distance-calculator.formulacalckit.com)

---

## 🌟 Key Highlights & Features

### 1. 🧮 Four Comprehensive Derivation Methods
* **Method 1: Standard Formula (Coefficient Homogenization)**
  * Verifies parallelism ($A_1 B_2 - A_2 B_1 = 0$).
  * Automatically detects and diagnoses scaled coefficients ($l_2 = k \cdot l_1$) and unifies equations before applying $d = \frac{|C_1 - C_2'|}{\sqrt{A^2 + B^2}}$.
  * Simplifies radicals and rationalizes denominators to standard textbook format.
* **Method 2: Quadratic Completing the Square (配方法求极值)**
  * Formal algebraic minimum proof: parameterizes an arbitrary moving point on $l_2$ and constructs the squared Euclidean distance function $S(u) = a u^2 + b u + c$.
  * Completes the square to eliminate the linear term, proving that the vertex ordinate is the exact global minimum squared distance.
* **Method 3: Point-to-Line Reduction**
  * Selects an integer grid or intercept point on $l_1$ and evaluates the point-to-line perpendicular distance formula to provide mutual verification.
* **Method 4: Geometric Normal Vector Projection**
  * Extracts normal vector $\vec{n} = (A, B)$ and projects the displacement vector between lines onto the unit normal direction.

### 2. ⚡ Smart Equation Natural Text Parser
Accepts any standard algebraic format:
* Standard Form: `3x - 4y + 5 = 0`
* RHS Constant Form: `2x + 3y = 8`
* Slope-Intercept Form: `y = 2x - 3`
* Vertical & Horizontal Lines: `x = 5`, `y = -4`

### 3. 🎯 Exam Trap & Sign-Error Diagnostic Radar
* **Scaling Trap Detection**: Alerts students if Line 2 has scaled coefficients ($A_2 \neq A_1$), preventing lost points on exams.
* **Sign Inversion Breakdown**: Breaks down $|C_1 - (-C_2)| = |C_1 + C_2|$ step-by-step so students never drop negative signs.
* **Inverse Parameter $m$ Solver**: Solves for unknown parameter $m$ given distance $d$ with automatic dual-solution ($\pm$) verification.

### 4. 🎨 Interactive Dynamic Coordinate Plane (SVG)
* Interactive Cartesian coordinate grid with drag-and-pan and zoom controls.
* Draws parallel lines, perpendicular distance segment, right-angle mark ($\llcorner$), and exact coordinate readouts for points $P$ and $Q$.

### 5. 🌐 Full Multilingual Support (i18n)
* **English (Default)** 🇺🇸
* **Spanish (Español)** 🇪🇸
* **French (Français)** 🇫🇷
* **Portuguese (Português)** 🇵🇹
* **Chinese (中文简体)** 🇨🇳
* Dynamically adapts all UI labels, step descriptions, derivations, exam presets, and diagnostic feedback.

### 6. 🚀 SEO Optimized for Google Search Traffic
* Semantic HTML5 architecture.
* Schema.org structured data for `WebApplication` and `FAQPage` (enabling Google rich snippet search results).
* Clean OpenGraph social share cards and Twitter cards.
* Standard `robots.txt` and `sitemap.xml`.

---

## 🛠 Tech Stack

* **Framework**: React 19 + TypeScript
* **Build Tool**: Vite
* **Styling**: Tailwind CSS
* **Math Rendering**: KaTeX (Fast LaTeX typesetting)
* **Icons**: Lucide React
* **Zero Backend Latency**: Client-side instant evaluation with exact rational arithmetic (`Fraction`) and radical simplifier.

---

## 🚀 Getting Started

### Prerequisites
* Node.js >= 18.0.0
* npm >= 9.0.0

### Installation
```bash
# Clone the repository
git clone https://github.com/laohu90/parallel-lines-distance-calculator.git

# Navigate to project directory
cd parallel-lines-distance-calculator

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Building for Production
```bash
npm run build
```

---

## 📄 License

MIT License. Free for educational and commercial use.
