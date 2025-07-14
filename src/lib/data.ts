import type { Subject } from './types';

export const subjects: Omit<Subject, 'icon'>[] = [
  {
    id: 'physics',
    title: 'Physics',
    description: 'Explore the fundamental principles of the universe, from motion to matter and energy.',
    iconName: 'Atom',
    lessons: [
      {
        id: 'newtonian-mechanics',
        title: 'Newtonian Mechanics',
        content: {
          cheatsheet: `
# Newtonian Mechanics

Classical mechanics as described by Sir Isaac Newton. It's based on three fundamental laws of motion.

### Newton's Three Laws

1.  **First Law (Inertia):** An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.
2.  **Second Law (F=ma):** The acceleration of an object is dependent upon two variables - the net force acting upon the object and the mass of the object.
3.  **Third Law (Action-Reaction):** For every action, there is an equal and opposite reaction.

### Key Formulas

| Concept      | Formula         | Description                                  |
|--------------|-----------------|----------------------------------------------|
| Force        | \`F = m * a\`     | Force equals mass times acceleration.        |
| Momentum     | \`p = m * v\`     | Momentum is mass times velocity.             |
| Work         | \`W = F * d\`     | Work is force applied over a distance.       |
          `,
          formulasheet: '1. ΣF = ma\n2. p = mv\n3. W = Fdcos(θ)',
        },
      },
      {
        id: 'electromagnetism',
        title: 'Electromagnetism',
        content: {
          cheatsheet: 'The study of the electromagnetic force, a type of physical interaction that occurs between electrically charged particles. Governed by Maxwell\'s Equations.',
          formulasheet: '1. ∇ ⋅ E = ρ/ε₀\n2. ∇ ⋅ B = 0\n3. ∇ × E = -∂B/∂t\n4. ∇ × B = μ₀(J + ε₀∂E/∂t)',
        },
      },
      {
        id: 'quantum-physics',
        title: 'Quantum Physics',
        content: {
          cheatsheet: 'The study of matter and energy at the most fundamental level. Key concepts include quantization, wave-particle duality, and the uncertainty principle.',
          formulasheet: '1. E = hν\n2. iħ(∂/∂t)Ψ = ĤΨ\n3. ΔxΔp ≥ ħ/2',
        },
      },
      {
        id: 'thermodynamics',
        title: 'Thermodynamics',
        content: {
            cheatsheet: 'Deals with heat, work, and temperature, and their relation to energy, radiation, and physical properties of matter. The four laws of thermodynamics govern the behavior of these quantities.',
            formulasheet: '1. ΔU = Q - W\n2. ΔS_universe ≥ 0\n3. S = k ln(W)\n4. T→0, S→S₀'
        }
      },
      { id: 'kinematics', title: 'Kinematics', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'dynamics', title: 'Dynamics', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'work-energy-power', title: 'Work, Energy, and Power', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'circular-motion', title: 'Circular Motion & Gravitation', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'simple-harmonic-motion', title: 'Simple Harmonic Motion', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'waves-sound', title: 'Waves and Sound', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'optics', title: 'Optics', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'fluid-mechanics', title: 'Fluid Mechanics', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'electrostatics', title: 'Electrostatics', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'electric-circuits', title: 'Electric Circuits', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'magnetism', title: 'Magnetism', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'electromagnetic-induction', title: 'Electromagnetic Induction', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'special-relativity', title: 'Special Relativity', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'general-relativity', title: 'General Relativity', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'nuclear-physics', title: 'Nuclear Physics', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'particle-physics', title: 'Particle Physics', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'astrophysics', title: 'Astrophysics', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'cosmology', title: 'Cosmology', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'statistical-mechanics', title: 'Statistical Mechanics', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'solid-state-physics', title: 'Solid State Physics', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'plasma-physics', title: 'Plasma Physics', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'biophysics', title: 'Biophysics', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'acoustics', title: 'Acoustics', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'condensed-matter', title: 'Condensed Matter Physics', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'quantum-field-theory', title: 'Quantum Field Theory', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'string-theory', title: 'String Theory', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
    ],
  },
  {
    id: 'mathematics',
    title: 'Mathematics',
    description: 'Discover the language of the universe through numbers, structures, and patterns.',
    iconName: 'Calculator',
    lessons: [
      {
        id: 'calculus',
        title: 'Calculus',
        content: {
          cheatsheet: 'The mathematical study of continuous change. It has two major branches, differential calculus and integral calculus.',
          formulasheet: '1. d/dx(xⁿ) = nxⁿ⁻¹\n2. ∫xⁿ dx = (xⁿ⁺¹)/(n+1) + C\n3. Fundamental Theorem: ∫[a,b] f(x)dx = F(b) - F(a)',
        },
      },
      {
        id: 'linear-algebra',
        title: 'Linear Algebra',
        content: {
          cheatsheet: 'The branch of mathematics concerning linear equations, linear maps, and their representations in vector spaces and through matrices.',
          formulasheet: '1. A(u+v) = Au + Av\n2. A(cv) = c(Av)\n3. Ax = λx',
        },
      },
      {
        id: 'probability-theory',
        title: 'Probability Theory',
        content: {
          cheatsheet: 'The branch of mathematics concerned with probability, the analysis of random phenomena. The central objects of probability theory are random variables, stochastic processes, and events.',
          formulasheet: '1. P(A∪B) = P(A)+P(B)-P(A∩B)\n2. P(A|B) = P(A∩B)/P(B)\n3. E[X] = ΣxP(X=x)',
        },
      },
      { id: 'set-theory', title: 'Set Theory', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'number-theory', title: 'Number Theory', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'group-theory', title: 'Group Theory', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'ring-theory', title: 'Ring Theory', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'field-theory', title: 'Field Theory', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'topology', title: 'Topology', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'differential-geometry', title: 'Differential Geometry', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'real-analysis', title: 'Real Analysis', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'complex-analysis', title: 'Complex Analysis', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'functional-analysis', title: 'Functional Analysis', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'numerical-analysis', title: 'Numerical Analysis', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'combinatorics', title: 'Combinatorics', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'graph-theory', title: 'Graph Theory', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'game-theory', title: 'Game Theory', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'cryptography', title: 'Cryptography', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'information-theory', title: 'Information Theory', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'logic', title: 'Logic', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'differential-equations', title: 'Differential Equations', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'pdes', title: 'Partial Differential Equations', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'measure-theory', title: 'Measure Theory', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'stochastic-processes', title: 'Stochastic Processes', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'statistics', title: 'Statistics', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'operations-research', title: 'Operations Research', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'chaos-theory', title: 'Chaos Theory', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'fractal-geometry', title: 'Fractal Geometry', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'category-theory', title: 'Category Theory', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
    ],
  },
  {
    id: 'chemistry',
    title: 'Chemistry',
    description: 'Investigate the properties of matter and how substances combine or separate to form other substances.',
    iconName: 'Beaker',
    lessons: [
      {
        id: 'atomic-structure',
        title: 'Atomic Structure',
        content: {
          cheatsheet: 'Atoms are composed of a nucleus of protons and neutrons, surrounded by electrons in orbitals. The number of protons determines the element.',
          formulasheet: '1. A = Z + N (A=mass number, Z=atomic number, N=neutrons)\n2. c = λν',
        },
      },
      {
        id: 'chemical-bonding',
        title: 'Chemical Bonding',
        content: {
          cheatsheet: 'The lasting attraction between atoms, ions or molecules that enables the formation of chemical compounds. Main types are ionic, covalent, and metallic bonds.',
          formulasheet: 'Formal Charge = (Valence e⁻) - (Non-bonding e⁻) - (Bonding e⁻)/2',
        },
      },
      { id: 'stoichiometry', title: 'Stoichiometry', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'gas-laws', title: 'Gas Laws', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'thermochemistry', title: 'Thermochemistry', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'chemical-kinetics', title: 'Chemical Kinetics', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'chemical-equilibrium', title: 'Chemical Equilibrium', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'acids-and-bases', title: 'Acids and Bases', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'redox-reactions', title: 'Redox Reactions', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'electrochemistry', title: 'Electrochemistry', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'organic-chem-1', title: 'Organic Chem I', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'organic-chem-2', title: 'Organic Chem II', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'stereochemistry', title: 'Stereochemistry', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'spectroscopy', title: 'Spectroscopy', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'biochemistry', title: 'Biochemistry', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'inorganic-chemistry', title: 'Inorganic Chemistry', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'polymer-chemistry', title: 'Polymer Chemistry', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'analytical-chemistry', title: 'Analytical Chemistry', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'physical-chemistry', title: 'Physical Chemistry', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'quantum-chemistry', title: 'Quantum Chemistry', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'environmental-chemistry', title: 'Environmental Chemistry', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'materials-science', title: 'Materials Science', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'medicinal-chemistry', title: 'Medicinal Chemistry', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'food-chemistry', title: 'Food Chemistry', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'forensic-chemistry', title: 'Forensic Chemistry', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'industrial-chemistry', title: 'Industrial Chemistry', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'photochemistry', title: 'Photochemistry', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'radiochemistry', title: 'Radiochemistry', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'geochemistry', title: 'Geochemistry', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
      { id: 'astrochemistry', title: 'Astrochemistry', content: { cheatsheet: 'Placeholder content', formulasheet: 'Placeholder content' } },
    ],
  },
];
