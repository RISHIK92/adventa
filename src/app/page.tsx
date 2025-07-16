import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  ClipboardCheck,
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
      {/* Background Formulas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Mathematics Formulas */}
        <div className="absolute top-20 left-10 text-6xl font-serif text-primary/20 transform sm:block hidden -rotate-12 select-none">
          ∫f(x)dx
        </div>
        <div className="absolute top-20 right-20 text-4xl font-serif text-primary/20  transform sm:block hidden rotate-6 select-none">
          x = (-b ± √(b² - 4ac)) / 2a
        </div>
        <div className="absolute bottom-40 left-20 text-5xl font-serif text-secondary/20 transform sm:block hidden rotate-12 select-none">
          e^(iπ) + 1 = 0
        </div>
        <div className="absolute top-1/3 left-1/4 text-3xl font-serif text-muted-foreground/20 transform sm:block hidden -rotate-6 select-none">
          lim(x→0) sin(x)/x = 1
        </div>
        <div className="absolute bottom-20 right-10 text-4xl font-serif text-primary/20 transform sm:block hidden rotate-8 select-none">
          a² + b² = c²
        </div>
        <div className="absolute top-40 left-1/3 text-3xl font-serif text-accent/20 transform sm:block hidden -rotate-3 select-none">
          ∂f/∂x = dy/dx
        </div>

        {/* Physics Formulas */}
        <div className="absolute bottom-32 left-1/4 text-5xl font-serif text-primary/20 transform sm:block hidden rotate-15 select-none">
          E = mc²
        </div>
        <div className="absolute bottom-60 left-1/3 text-4xl font-serif text-accent/20 transform sm:block hidden -rotate-8 select-none">
          F = ma
        </div>
        <div className="absolute top-1/2 right-16 text-3xl font-serif text-secondary/20 transform sm:block hidden rotate-10 select-none">
          v = u + at
        </div>
        <div className="absolute bottom-32 left-1/2 text-4xl font-serif text-primary/20 transform sm:block hidden -rotate-5 select-none">
          PV = nRT
        </div>
        <div className="absolute top-80 left-16 text-3xl font-serif text-muted-foreground/20 transform sm:block hidden rotate-20 select-none">
          λ = h/p
        </div>
        <div className="absolute bottom-80 right-1/3 text-4xl font-serif text-accent/20 transform sm:block hidden -rotate-10 select-none">
          ω = 2πf
        </div>

        {/* Chemistry Formulas */}
        <div className="absolute top-48 left-1/2 text-4xl font-serif text-primary/20 transform sm:block hidden rotate-5 select-none">
          CH₄ + 2O₂ → CO₂ + 2H₂O
        </div>
        <div className="absolute bottom-48 right-20 text-3xl font-serif text-secondary/20 transform sm:block hidden -rotate-12 select-none">
          C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O
        </div>
        <div className="absolute top-80 right-10 text-3xl font-serif text-accent/20 transform sm:block hidden rotate-8 select-none">
          pH = -log[H⁺]
        </div>
        <div className="absolute bottom-1/4 left-10 text-4xl font-serif text-primary/20 transform sm:block hidden -rotate-15 select-none">
          NaCl → Na⁺ + Cl⁻
        </div>
        <div className="absolute top-72 right-1/2 text-3xl font-serif text-muted-foreground/20 transform sm:block hidden rotate-12 select-none">
          ΔG = ΔH - TΔS
        </div>
        <div className="absolute bottom-72 left-1/4 text-4xl font-serif text-secondary/20 transform sm:block hidden -rotate-8 select-none">
          C₂H₅OH
        </div>

        {/* Additional scattered formulas */}
        <div className="absolute top-96 left-3/4 text-3xl font-serif text-primary/20 transform sm:block hidden rotate-18 select-none">
          ∇²φ = 0
        </div>
        <div className="absolute bottom-96 right-1/4 text-3xl font-serif text-accent/20 transform sm:block hidden -rotate-20 select-none">
          Σ(x - μ)²/n
        </div>
        <div className="absolute top-1/2 left-8 text-2xl font-serif text-muted-foreground/20 transform sm:block hidden rotate-25 select-none">
          sin²θ + cos²θ = 1
        </div>
        <div className="absolute bottom-1/2 right-8 text-2xl font-serif text-secondary/20 transform sm:block hidden -rotate-25 select-none">
          d/dx[xⁿ] = nxⁿ⁻¹
        </div>
      </div>

      <main className="flex-grow relative z-10">
        <div className="container mx-auto flex min-h-full flex-col items-center justify-center p-4 text-center">
          <BrainCircuit className="mb-4 h-16 w-16 text-primary" />
          <h1 className="font-headline text-4xl font-bold md:text-6xl">
            Welcome to Your Learning Hub
          </h1>
          <p className="mb-12 mt-4 max-w-4xl text-lg text-muted-foreground">
            Choose your path. Dive deep into complex subjects with Vertical
            Ascent, test your knowledge with a dynamically generated quiz, or
            challenge yourself with a mock test.
          </p>

          <div className="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="transform sm:block hidden-gpu transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-primary/20 p-4">
                    <BookOpen className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <CardTitle className="font-headline text-3xl">
                  Vertical Ascent
                </CardTitle>
                <CardDescription className="text-md">
                  An interactive, structured learning journey. Explore subjects
                  from their fundamentals to advanced topics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild size="lg" className="w-full">
                  <Link href="/learning">
                    Start Learning <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="transform sm:block hidden-gpu transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-accent/20 p-4">
                    <BrainCircuit className="h-10 w-10 text-accent" />
                  </div>
                </div>
                <CardTitle className="font-headline text-3xl">
                  Take a Quiz
                </CardTitle>
                <CardDescription className="text-md">
                  Challenge yourself with AI-generated quizzes on a variety of
                  subjects and difficulty levels.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="w-full"
                >
                  <Link href="/quiz">
                    Take a Quiz <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="transform sm:block hidden-gpu transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl md:col-span-2 lg:col-span-1 bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-secondary/80 p-4">
                    <ClipboardCheck className="h-10 w-10 text-secondary-foreground" />
                  </div>
                </div>
                <CardTitle className="font-headline text-3xl">
                  Mock Test
                </CardTitle>
                <CardDescription className="text-md">
                  Simulate an exam with a timed test covering multiple subjects
                  and track your performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="w-full"
                >
                  <Link href="/test">
                    Start a Test <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
