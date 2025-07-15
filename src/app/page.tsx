
import { ArrowRight, BookOpen, BrainCircuit, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <div className="container mx-auto flex min-h-full flex-col items-center justify-center p-4 text-center">
          <BrainCircuit className="mb-4 h-16 w-16 text-primary" />
          <h1 className="font-headline text-4xl font-bold md:text-6xl">
            Welcome to Your Learning Hub
          </h1>
          <p className="mb-12 mt-4 max-w-4xl text-lg text-muted-foreground">
            Choose your path. Dive deep into complex subjects with Vertical Ascent, test your knowledge with a dynamically generated quiz, or challenge yourself with a mock test.
          </p>

          <div className="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="transform-gpu transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <CardHeader>
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <BookOpen className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <CardTitle className="font-headline text-3xl">
                  Vertical Ascent
                </CardTitle>
                <CardDescription className="text-md">
                  An interactive, structured learning journey. Explore subjects from their fundamentals to advanced topics.
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

            <Card className="transform-gpu transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <CardHeader>
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-accent/20 p-4">
                    <BrainCircuit className="h-10 w-10 text-accent" />
                  </div>
                </div>
                <CardTitle className="font-headline text-3xl">Take a Quiz</CardTitle>
                <CardDescription className="text-md">
                  Challenge yourself with AI-generated quizzes on a variety of subjects and difficulty levels.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild size="lg" variant="secondary" className="w-full">
                  <Link href="/quiz">
                    Take a Quiz <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="transform-gpu transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl md:col-span-2 lg:col-span-1">
              <CardHeader>
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-secondary/80 p-4">
                    <ClipboardCheck className="h-10 w-10 text-secondary-foreground" />
                  </div>
                </div>
                <CardTitle className="font-headline text-3xl">Mock Test</CardTitle>
                <CardDescription className="text-md">
                  Simulate an exam with a timed test covering multiple subjects and track your performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild size="lg" variant="secondary" className="w-full">
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
