import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  ClipboardCheck,
  Zap,
  Target,
  TrendingUp,
  Sparkles,
  Award,
  Clock,
  BarChart3,
  Eye,
  Lightbulb,
  Rocket,
  Shield,
  CheckCircle,
  ArrowUpRight,
  Play,
  Crown,
  Timer,
  Gauge,
  Trophy,
  Atom,
  Calculator,
  Dna,
  FlaskConical,
  Zap as Lightning,
  Download,
} from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl font-serif text-primary/100 transform sm:block hidden -rotate-12 select-none animate-pulse">
          ∫f(x)dx
        </div>
        <div className="absolute top-20 right-20 text-4xl font-serif text-accent/50 transform sm:block hidden rotate-6 select-none animate-pulse delay-100">
          x = (-b ± √(b² - 4ac)) / 2a
        </div>
        <div className="absolute bottom-40 left-20 text-5xl font-serif text-secondary/50 transform sm:block hidden rotate-12 select-none animate-pulse delay-200">
          e^(iπ) + 1 = 0
        </div>
        <div className="absolute top-1/3 left-1/4 text-3xl font-serif text-muted-foreground/50 transform sm:block hidden -rotate-6 select-none animate-pulse delay-400">
          lim(x→0) sin(x)/x = 1
        </div>
        <div className="absolute bottom-20 right-10 text-4xl font-serif text-primary/50 transform sm:block hidden rotate-8 select-none animate-pulse delay-400">
          a² + b² = c²
        </div>
        <div className="absolute top-40 left-1/3 text-3xl font-serif text-accent/50 transform sm:block hidden -rotate-3 select-none animate-pulse delay-500">
          ∂f/∂x = dy/dx
        </div>

        <div className="absolute bottom-32 left-1/4 text-5xl font-serif text-primary/50 transform sm:block hidden rotate-15 select-none animate-pulse delay-400">
          E = mc²
        </div>
        <div className="absolute top-[450px] left-24 text-4xl font-serif text-primary/50 transform sm:block hidden -rotate-8 select-none animate-pulse delay-400">
          F = ma
        </div>
        <div className="absolute top-1/2 right-16 text-3xl font-serif text-secondary/50 transform sm:block hidden rotate-10 select-none animate-pulse delay-400">
          v = u + at
        </div>
        <div className="absolute bottom-32 left-1/2 text-4xl font-serif text-primary/50 transform sm:block hidden -rotate-5 select-none animate-pulse delay-400">
          PV = nRT
        </div>
        <div className="absolute top-80 left-16 text-3xl font-serif text-muted-foreground/100 transform sm:block hidden rotate-20 select-none animate-pulse delay-400">
          λ = h/p
        </div>
        <div className="absolute top-[600px] left-96 text-3xl font-serif text-muted-foreground/50 transform sm:block hidden rotate-4 select-none animate-pulse delay-400">
          Σ(x - μ)²/n
        </div>
        <div className="absolute bottom-80 right-1/3 text-4xl font-serif text-accent/50 transform sm:block hidden -rotate-10 select-none animate-pulse delay-400">
          ω = 2πf
        </div>
        <div className="absolute top-[600px] right-60 text-3xl font-serif text-primary/100 transform sm:block hidden rotate-1 select-none animate-pulse delay-400">
          C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O
        </div>

        <div className="absolute top-48 left-3/4 text-2xl font-serif text-primary/50 transform sm:block hidden rotate-5 select-none animate-pulse delay-400">
          CH₄ + 2O₂ → CO₂ + 2H₂O
        </div>
        <div className="absolute bottom-48 right-20 text-3xl font-serif text-secondary/50 transform sm:block hidden -rotate-12 select-none animate-pulse delay-400">
          C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O
        </div>
        <div className="absolute top-80 right-10 text-3xl font-serif text-accent/50 transform sm:block hidden rotate-12 select-none animate-pulse delay-400">
          pH = -log[H⁺]
        </div>
        <div className="absolute bottom-1/4 left-10 text-4xl font-serif text-primary/50 transform sm:block hidden -rotate-15 select-none animate-pulse delay-400">
          NaCl → Na⁺ + Cl⁻
        </div>
        <div className="absolute top-52 left-32 text-3xl font-serif text-muted-foreground/50 transform sm:block hidden -rotate-12 select-none animate-pulse delay-400">
          ΔG = ΔH - TΔS
        </div>
        <div className="absolute bottom-72 left-1/4 text-4xl font-serif text-secondary/50 transform sm:block hidden -rotate-8 select-none animate-pulse delay-400">
          C₂H₅OH
        </div>

        {/* Additional mathematical symbols */}
        <div className="absolute top-96 left-3/4 text-3xl font-serif text-primary/50 transform sm:block hidden rotate-18 select-none animate-pulse delay-400">
          ∇²φ = 0
        </div>
        <div className="absolute bottom-96 right-1/4 text-3xl font-serif text-accent/50 transform sm:block hidden -rotate-20 select-none animate-pulse delay-400">
          Σ(x - μ)²/n
        </div>
        <div className="absolute top-1/2 left-8 text-2xl font-serif text-muted-foreground/50 transform sm:block hidden rotate-25 select-none animate-pulse delay-400">
          sin²θ + cos²θ = 1
        </div>
        <div className="absolute bottom-1/2 right-8 text-2xl font-serif text-secondary/50 transform sm:block hidden -rotate-25 select-none animate-pulse delay-400">
          d/dx[xⁿ] = nxⁿ⁻¹
        </div>

        {/* Gradient overlay for better text readability -- VISIBILITY FIXED */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/50 to-background/85"></div>
      </div>

      <main className="flex-grow relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-16 pb-8">
          <div className="text-center max-w-5xl mx-auto">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6 animate-bounce">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                AI-Powered Learning Revolution
              </span>
              <Lightning className="h-4 w-4 text-primary" />
            </div>

            {/* Main Heading with enhanced styling */}
            <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent leading-tight">
              Vertical Ascent
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-light">
              Where Intelligence Meets{" "}
              <span className="text-primary font-semibold">Ambition</span>
            </p>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground/50 mb-8 max-w-4xl mx-auto leading-relaxed">
              Your AI-powered companion for JEE & NEET domination. We don't just
              teach - we transform your thinking, predict your potential, and
              accelerate your journey to the top.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Start Your AI Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Play className="mr-2 h-5 w-5" />
                See How It Works
              </Button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">99%</div>
                <div className="text-sm text-muted-foreground">
                  Success Rate
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">3x</div>
                <div className="text-sm text-muted-foreground">
                  Faster Learning
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">AI Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Learning Arsenal
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose your weapon of mass instruction. Each path is designed to
              unlock your potential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Vertical Ascent Card */}
            <Card className="group transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-gradient-to-br from-card/95 to-primary/5 backdrop-blur-sm border-2 hover:border-primary/30 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <div className="mb-6 flex justify-center">
                  <div className="rounded-full bg-primary/20 p-6 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <CardTitle className="font-headline text-2xl mb-2 text-center">
                  Vertical Ascent
                </CardTitle>
                <CardDescription className="text-center text-base leading-relaxed">
                  Embark on a structured learning odyssey. From fundamentals to
                  mastery, our AI guides you through every concept with
                  precision.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Adaptive Learning Paths</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Interactive Concepts</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Progress Tracking</span>
                  </div>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="w-full group-hover:bg-primary/50 transition-colors"
                >
                  <Link href="/learning">
                    Begin Your Ascent
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quiz Card */}
            <Card className="group transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-gradient-to-br from-card/95 to-accent/5 backdrop-blur-sm border-2 hover:border-accent/30 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <div className="mb-6 flex justify-center">
                  <div className="rounded-full bg-accent/20 p-6 group-hover:scale-110 transition-transform duration-300">
                    <BrainCircuit className="h-12 w-12 text-accent" />
                  </div>
                </div>
                <CardTitle className="font-headline text-2xl mb-2 text-center">
                  AI Quiz Arena
                </CardTitle>
                <CardDescription className="text-center text-base leading-relaxed">
                  Challenge your mind with AI-generated questions that adapt to
                  your skill level. Every question is a step toward excellence.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightning className="h-4 w-4 text-accent" />
                    <span className="text-sm">Instant AI Feedback</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-accent" />
                    <span className="text-sm">Personalized Difficulty</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    <span className="text-sm">Performance Analytics</span>
                  </div>
                </div>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="w-full group-hover:bg-accent/50 group-hover:text-accent-foreground transition-colors"
                >
                  <Link href="/quiz">
                    Enter the Arena
                    <Zap className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Mock Test Card */}
            <Card className="group transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-gradient-to-br from-card/95 to-secondary/5 backdrop-blur-sm border-2 hover:border-secondary/30 overflow-hidden relative md:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <div className="mb-6 flex justify-center">
                  <div className="rounded-full bg-secondary/20 p-6 group-hover:scale-110 transition-transform duration-300">
                    <ClipboardCheck className="h-12 w-12 text-secondary-foreground" />
                  </div>
                </div>
                <CardTitle className="font-headline text-2xl mb-2 text-center">
                  Mock Test Simulator
                </CardTitle>
                <CardDescription className="text-center text-base leading-relaxed">
                  Experience the real deal with our advanced exam simulator.
                  Time pressure, real questions, instant analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-secondary-foreground" />
                    <span className="text-sm">Timed Exam Environment</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-secondary-foreground" />
                    <span className="text-sm">Detailed Analysis</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="h-4 w-4 text-secondary-foreground" />
                    <span className="text-sm">Performance Ranking</span>
                  </div>
                </div>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="w-full group-hover:bg-secondary/50 transition-colors"
                >
                  <Link href="/test">
                    Start Simulation
                    <Timer className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Features Highlight */}
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                The AI Advantage
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience learning like never before with our intelligent
                companion
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/20">
                <Eye className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Predictive Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Foresee your performance before you even take the test
                </p>
              </div>
              <div className="text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-accent/20">
                <Lightbulb className="h-8 w-8 text-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Smart Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Uncover hidden patterns in your learning journey
                </p>
              </div>
              <div className="text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-secondary/20">
                <Shield className="h-8 w-8 text-secondary-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Adaptive Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Content that evolves with your understanding
                </p>
              </div>
              <div className="text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/20">
                <Gauge className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Real-time Optimization</h3>
                <p className="text-sm text-muted-foreground">
                  Continuously improving your study efficiency
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Icons Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Master Every Subject
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                From atoms to algorithms, we've got you covered
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Calculator className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Mathematics</h3>
                <p className="text-sm text-muted-foreground">
                  Calculus to Complex Numbers
                </p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Atom className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg">Physics</h3>
                <p className="text-sm text-muted-foreground">
                  Mechanics to Quantum
                </p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-secondary/10 rounded-full flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <FlaskConical className="h-8 w-8 text-secondary-foreground" />
                </div>
                <h3 className="font-semibold text-lg">Chemistry</h3>
                <p className="text-sm text-muted-foreground">
                  Organic to Inorganic
                </p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Dna className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Biology</h3>
                <p className="text-sm text-muted-foreground">
                  Cell to Ecosystem
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* NEW SEO Content Section */}
        <div className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Your Ultimate JEE & NEET Resource Hub
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Access comprehensive, topic-wise, and sub-topic wise formula
                sheets and cheatsheets. Everything you need for JEE (Main &
                Advanced) and NEET, right at your fingertips.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="relative bg-card p-6 pt-6 pb-10 rounded-lg border">
                <div className="flex items-center gap-4 mb-4">
                  <Calculator className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold">Mathematics</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete JEE formula sheets for every chapter.
                </p>
                <ul className="space-y-2 text-sm">
                  <li>Calculus & Integration</li>
                  <li>Algebra & Quadratic Equations</li>
                  <li>Trigonometry & Inverse Functions</li>
                  <li>Coordinate Geometry & Conic Sections</li>
                  <li>Vectors & 3D Geometry</li>
                  <li>Probability & Statistics</li>
                </ul>
                <p className="absolute bottom-3 right-4 text-xs text-muted-foreground">
                  and many more
                </p>
              </div>

              {/* Physics Card */}
              <div className="relative bg-card p-6 rounded-lg border">
                <div className="flex items-center gap-4 mb-4">
                  <Atom className="h-8 w-8 text-accent" />
                  <h3 className="text-xl font-bold">Physics</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  NEET & JEE cheatsheets for quick revision.
                </p>
                <ul className="space-y-2 text-sm">
                  <li>Mechanics & Laws of Motion</li>
                  <li>Thermodynamics & Kinetic Theory</li>
                  <li>Electrostatics & Magnetism</li>
                  <li>Ray & Wave Optics</li>
                  <li>Modern Physics & Semiconductors</li>
                  <li>Rotational Motion Formulas</li>
                </ul>
                <p className="absolute bottom-3 right-4 text-xs text-muted-foreground">
                  and many more
                </p>
              </div>
              {/* Chemistry Card */}
              <div className="relative bg-card p-6 rounded-lg border">
                <div className="flex items-center gap-4 mb-4">
                  <FlaskConical className="h-8 w-8 text-secondary-foreground" />
                  <h3 className="text-xl font-bold">Chemistry</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Organic, Inorganic, and Physical formula lists.
                </p>
                <ul className="space-y-2 text-sm">
                  <li>Mole Concept & Stoichiometry</li>
                  <li>Chemical Bonding & Structure</li>
                  <li>Equilibrium (Chemical & Ionic)</li>
                  <li>General Organic Chemistry (GOC)</li>
                  <li>p-Block & d-Block Elements</li>
                  <li>Biomolecules & Polymers</li>
                </ul>
                <p className="absolute bottom-3 right-4 text-xs text-muted-foreground">
                  and many more
                </p>
              </div>
              {/* Biology Card */}
              <div className="relative bg-card p-6 rounded-lg border">
                <div className="flex items-center gap-4 mb-4">
                  <Dna className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold">Biology</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  NEET-focused cheatsheets and important diagrams.
                </p>
                <ul className="space-y-2 text-sm">
                  <li>Human & Plant Physiology</li>
                  <li>Genetics & Evolution</li>
                  <li>Cell Biology & Division</li>
                  <li>Ecology & Environment</li>
                  <li>Diversity in Living World</li>
                  <li>Biotechnology Principles</li>
                </ul>
                <p className="absolute bottom-3 right-4 text-xs text-muted-foreground">
                  and many more
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* NEW FREE RESOURCES SECTION */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Practice, Revise, and Conquer - All For Free
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Supercharge your JEE & NEET preparation with our suite of free
                tools. No hidden costs, just pure learning.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Free Quizzes Card */}
              <div className="group bg-card p-6 rounded-lg border border-transparent hover:border-accent transition-colors duration-300 hover:shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-accent/10 p-3 rounded-full">
                    <Zap className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold">Unlimited Free Quizzes</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Test your knowledge with endless chapter-wise and topic-wise
                  quizzes for JEE and NEET. Our AI generates questions that
                  mirror the real exam pattern, helping you build speed and
                  accuracy.
                </p>
                <Button variant="outline" className="w-full">
                  Take a Free Quiz Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Free Cheatsheets Card */}
              <div className="group bg-card p-6 rounded-lg border border-transparent hover:border-primary transition-colors duration-300 hover:shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">
                    Cheatsheets and Formulasheets
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Get instant access to our expertly curated formula sheets for
                  Physics, Chemistry, and Maths. Perfect for quick revisions and
                  reinforcing key concepts before your exam.
                </p>
                <Button variant="outline" className="w-full">
                  Get Your Free Cheatsheets
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Free Analysis Card */}
              <div className="group bg-card p-6 rounded-lg border border-transparent hover:border-secondary transition-colors duration-300 hover:shadow-lg md:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-secondary/10 p-3 rounded-full">
                    <BarChart3 className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold">
                    Free Performance Insights
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Don't just practice; practice smart. After every quiz, get a
                  free, detailed analysis of your performance. Identify your
                  weak spots and track your progress over time.
                </p>
                <Button variant="outline" className="w-full">
                  Analyze Your Skills for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="bg-gradient-to-r from-primary via-accent to-secondary py-16">
          <div className="container mx-auto px-4 text-center">
            <Crown className="h-16 w-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Rule Your Exams?
            </h2>
            <p className="text-xl text-white/50 mb-8 max-w-2xl mx-auto">
              Join thousands of students who've transformed their potential into
              performance
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Trophy className="mr-2 h-5 w-5" />
              Begin Your Transformation
              <ArrowUpRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
