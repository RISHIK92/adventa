import type { Subject } from './types';

export const subjects: Omit<Subject, 'icon'>[] = [
  {
    id: 'physics',
    title: 'Physics',
    description: 'Explore the fundamental principles of the universe, from motion to matter and energy.',
    iconName: 'Atom',
    lessons: [
      { id: 'newtonian-mechanics', title: 'Newtonian Mechanics' },
      { id: 'electromagnetism', title: 'Electromagnetism' },
      { id: 'quantum-physics', title: 'Quantum Physics' },
      { id: 'thermodynamics', title: 'Thermodynamics' },
      { id: 'kinematics', title: 'Kinematics' },
      { id: 'dynamics', title: 'Dynamics' },
      { id: 'work-energy-power', title: 'Work, Energy, and Power' },
      { id: 'circular-motion', title: 'Circular Motion & Gravitation' },
      { id: 'simple-harmonic-motion', title: 'Simple Harmonic Motion' },
      { id: 'waves-sound', title: 'Waves and Sound' },
      { id: 'optics', title: 'Optics' },
      { id: 'fluid-mechanics', title: 'Fluid Mechanics' },
      { id: 'electrostatics', title: 'Electrostatics' },
      { id: 'electric-circuits', title: 'Electric Circuits' },
      { id: 'magnetism', title: 'Magnetism' },
      { id: 'electromagnetic-induction', title: 'Electromagnetic Induction' },
      { id: 'special-relativity', title: 'Special Relativity' },
      { id: 'general-relativity', title: 'General Relativity' },
      { id: 'nuclear-physics', title: 'Nuclear Physics' },
      { id: 'particle-physics', title: 'Particle Physics' },
      { id: 'astrophysics', title: 'Astrophysics' },
      { id: 'cosmology', title: 'Cosmology' },
      { id: 'statistical-mechanics', title: 'Statistical Mechanics' },
      { id: 'solid-state-physics', title: 'Solid State Physics' },
      { id: 'plasma-physics', title: 'Plasma Physics' },
      { id: 'biophysics', title: 'Biophysics' },
      { id: 'acoustics', title: 'Acoustics' },
      { id: 'condensed-matter', title: 'Condensed Matter Physics' },
      { id: 'quantum-field-theory', title: 'Quantum Field Theory' },
      { id: 'string-theory', title: 'String Theory' },
    ],
  },
  {
    id: 'mathematics',
    title: 'Mathematics',
    description: 'Discover the language of the universe through numbers, structures, and patterns.',
    iconName: 'Calculator',
    lessons: [
      { id: 'calculus', title: 'Calculus' },
      { id: 'linear-algebra', title: 'Linear Algebra' },
      { id: 'probability-theory', title: 'Probability Theory' },
      { id: 'set-theory', title: 'Set Theory' },
      { id: 'number-theory', title: 'Number Theory' },
      { id: 'group-theory', title: 'Group Theory' },
      { id: 'ring-theory', title: 'Ring Theory' },
      { id: 'field-theory', title: 'Field Theory' },
      { id: 'topology', title: 'Topology' },
      { id: 'differential-geometry', title: 'Differential Geometry' },
      { id: 'real-analysis', title: 'Real Analysis' },
      { id: 'complex-analysis', title: 'Complex Analysis' },
      { id: 'functional-analysis', title: 'Functional Analysis' },
      { id: 'numerical-analysis', title: 'Numerical Analysis' },
      { id: 'combinatorics', title: 'Combinatorics' },
      { id: 'graph-theory', title: 'Graph Theory' },
      { id: 'game-theory', title: 'Game Theory' },
      { id: 'cryptography', title: 'Cryptography' },
      { id: 'information-theory', title: 'Information Theory' },
      { id: 'logic', title: 'Logic' },
      { id: 'differential-equations', title: 'Differential Equations' },
      { id: 'pdes', title: 'Partial Differential Equations' },
      { id: 'measure-theory', title: 'Measure Theory' },
      { id: 'stochastic-processes', title: 'Stochastic Processes' },
      { id: 'statistics', title: 'Statistics' },
      { id: 'operations-research', title: 'Operations Research' },
      { id: 'chaos-theory', title: 'Chaos Theory' },
      { id: 'fractal-geometry', title: 'Fractal Geometry' },
      { id: 'category-theory', title: 'Category Theory' },
    ],
  },
  {
    id: 'chemistry',
    title: 'Chemistry',
    description: 'Investigate the properties of matter and how substances combine or separate to form other substances.',
    iconName: 'Beaker',
    lessons: [
      { id: 'atomic-structure', title: 'Atomic Structure' },
      { id: 'chemical-bonding', title: 'Chemical Bonding' },
      { id: 'stoichiometry', title: 'Stoichiometry' },
      { id: 'gas-laws', title: 'Gas Laws' },
      { id: 'thermochemistry', title: 'Thermochemistry' },
      { id: 'chemical-kinetics', title: 'Chemical Kinetics' },
      { id: 'chemical-equilibrium', title: 'Chemical Equilibrium' },
      { id: 'acids-and-bases', title: 'Acids and Bases' },
      { id: 'redox-reactions', title: 'Redox Reactions' },
      { id: 'electrochemistry', title: 'Electrochemistry' },
      { id: 'organic-chem-1', title: 'Organic Chem I' },
      { id: 'organic-chem-2', title: 'Organic Chem II' },
      { id: 'stereochemistry', title: 'Stereochemistry' },
      { id: 'spectroscopy', title: 'Spectroscopy' },
      { id: 'biochemistry', title: 'Biochemistry' },
      { id: 'inorganic-chemistry', title: 'Inorganic Chemistry' },
      { id: 'polymer-chemistry', title: 'Polymer Chemistry' },
      { id: 'analytical-chemistry', title: 'Analytical Chemistry' },
      { id: 'physical-chemistry', title: 'Physical Chemistry' },
      { id: 'quantum-chemistry', title: 'Quantum Chemistry' },
      { id: 'environmental-chemistry', title: 'Environmental Chemistry' },
      { id: 'materials-science', title: 'Materials Science' },
      { id: 'medicinal-chemistry', title: 'Medicinal Chemistry' },
      { id: 'food-chemistry', title: 'Food Chemistry' },
      { id: 'forensic-chemistry', title: 'Forensic Chemistry' },
      { id: 'industrial-chemistry', title: 'Industrial Chemistry' },
      { id: 'photochemistry', title: 'Photochemistry' },
      { id: 'radiochemistry', title: 'Radiochemistry' },
      { id: 'geochemistry', title: 'Geochemistry' },
      { id: 'astrochemistry', title: 'Astrochemistry' },
    ],
  },
];
