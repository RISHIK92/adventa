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
          cheatsheet: 'F=ma. An object in motion stays in motion. For every action, there is an equal and opposite reaction. These are Newton\'s three laws of motion, forming the basis of classical mechanics.',
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
      }
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
    ],
  },
];
