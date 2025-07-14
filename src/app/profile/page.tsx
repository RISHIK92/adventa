
'use client';

import * as React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Loader2, BookCheck, ClipboardCheck, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getQuizResults, getTestResults, type QuizResult, type TestResult } from '@/app/actions';
import { Header } from '@/components/header';
import { formatDistanceToNow } from 'date-fns';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

type EnrichedQuizResult = Omit<QuizResult, 'timestamp'> & { id: string; timestamp: string };
type EnrichedTestResult = Omit<TestResult, 'timestamp'> & { id: string; timestamp: string };

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [quizResults, setQuizResults] = React.useState<EnrichedQuizResult[]>([]);
  const [testResults, setTestResults] = React.useState<EnrichedTestResult[]>([]);
  const [loadingResults, setLoadingResults] = React.useState(true);

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  React.useEffect(() => {
    if (user) {
      const fetchResults = async () => {
        setLoadingResults(true);
        const [quizRes, testRes] = await Promise.all([
          getQuizResults(user.uid),
          getTestResults(user.uid),
        ]);
        if (quizRes.success && quizRes.data) {
          setQuizResults(quizRes.data as EnrichedQuizResult[]);
        }
        if (testRes.success && testRes.data) {
          setTestResults(testRes.data as EnrichedTestResult[]);
        }
        setLoadingResults(false);
      };
      fetchResults();
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const renderTimestamp = (timestamp: string) => {
    try {
      if (timestamp && !isNaN(new Date(timestamp).getTime())) {
        return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
      }
    } catch (e) {
      // In case of any other parsing error
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="font-headline text-4xl font-bold">Welcome, {user.displayName || 'User'}!</h1>
          <p className="text-muted-foreground">Here's a summary of your performance.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookCheck className="h-6 w-6 text-accent" />
                Quiz History
              </CardTitle>
              <CardDescription>A log of all the quizzes you've taken.</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingResults ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : quizResults.length > 0 ? (
                <ul className="space-y-4">
                  {quizResults.map((result) => (
                    <li key={result.id} className="rounded-lg border p-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold">{result.subject}</p>
                          <p className="text-sm text-muted-foreground">{result.difficulty}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            {result.score}/{result.totalQuestions}
                          </p>
                          <p className="text-xs text-muted-foreground">
                             {renderTimestamp(result.timestamp)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted-foreground">No quiz results yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-6 w-6 text-primary" />
                Mock Test History
              </CardTitle>
              <CardDescription>A log of all the mock tests you've completed.</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingResults ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : testResults.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {testResults.map((result, index) => (
                    <AccordionItem value={`item-${index}`} key={result.id}>
                      <AccordionTrigger>
                        <div className="flex w-full items-center justify-between pr-4">
                          <div className="text-left">
                            <p className="font-semibold">
                              {result.subjects.map(s => s.subject).join(', ')} Test
                            </p>
                            <p className="text-sm text-muted-foreground">{result.difficulty}</p>
                          </div>
                           <div className="text-right">
                            <p className="text-lg font-bold">
                              {result.score}/{result.totalQuestions}
                            </p>
                             <p className="text-xs text-muted-foreground">
                               {renderTimestamp(result.timestamp)}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 p-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Time Limit: {result.timeLimit} minutes</span>
                          </div>
                           <h4 className="font-semibold pt-2">Subject-wise Performance:</h4>
                           {Object.entries(result.subjectWiseScores).map(([subject, scores]) => (
                             <div key={subject} className="flex justify-between text-sm">
                               <p>{subject}</p>
                               <p className="font-medium">{scores.correct}/{scores.total}</p>
                             </div>
                           ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-center text-muted-foreground">No mock test results yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
