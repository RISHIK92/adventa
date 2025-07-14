
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Dices,
  Loader2,
  Shuffle,
  XCircle,
} from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import {
  generateQuiz,
  type GenerateQuizInput,
  type QuizQuestion,
} from '@/ai/flows/generate-quiz-flow';
import { saveQuizResult } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { subjects as allSubjects } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

const subjectGroups = {
  PCM: ['Physics', 'Chemistry', 'Mathematics'],
  PCMB: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
  BPC: ['Biology', 'Physics', 'Chemistry'],
};

const difficultyLevels = ['Easy', 'Medium', 'Hard', 'Expert'] as const;

const formSchema = z.object({
  subjectGroup: z.enum(['PCM', 'PCMB', 'BPC']),
  subject: z.string().min(1, 'Please select a subject.'),
  difficulty: z.enum(difficultyLevels),
});

type QuizFormValues = z.infer<typeof formSchema>;

type QuizState =
  | 'configuring'
  | 'loading'
  | 'displaying'
  | 'finished'
  | 'error';

export default function QuizPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [quizState, setQuizState] = React.useState<QuizState>('configuring');
  const [questions, setQuestions] = React.useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<
    Record<number, number>
  >({});
  const [finalScore, setFinalScore] = React.useState(0);
  const [isReviewing, setIsReviewing] = React.useState(false);
  const { toast } = useToast();
  const [quizConfig, setQuizConfig] = React.useState<GenerateQuizInput | null>(null);

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectGroup: 'PCM',
      subject: '',
      difficulty: 'Medium',
    },
  });

  const subjectGroup = form.watch('subjectGroup');
  const availableSubjects = subjectGroup ? subjectGroups[subjectGroup] : [];
  const currentQuestion = questions[currentQuestionIndex];

  React.useEffect(() => {
    form.resetField('subject', { defaultValue: '' });
  }, [subjectGroup, form]);

  const handleGenerateQuiz = async (values: GenerateQuizInput) => {
    setQuizState('loading');
    setQuizConfig(values);
    try {
      const result = await generateQuiz(values);
      if (result && result.questions?.length > 0) {
        setQuestions(result.questions);
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswers({});
        setFinalScore(0);
        setIsReviewing(false);
        setQuizState('displaying');
      } else {
        throw new Error('No questions were generated.');
      }
    } catch (error) {
      console.error('Quiz generation failed:', error);
      toast({
        variant: 'destructive',
        title: 'Quiz Generation Error',
        description:
          'Could not generate quiz questions. Please try again later.',
      });
      setQuizState('error');
    }
  };

  const onFormSubmit = (values: QuizFormValues) => {
    handleGenerateQuiz({
      subject: values.subject,
      difficulty: values.difficulty,
    });
  };

  const handleRandomQuiz = () => {
    const groups: Array<keyof typeof subjectGroups> = ['PCM', 'PCMB', 'BPC'];
    const randomGroup = groups[Math.floor(Math.random() * groups.length)];
    const randomSubjects = subjectGroups[randomGroup];
    const randomSubject =
      randomSubjects[Math.floor(Math.random() * randomSubjects.length)];
    const randomDifficulty =
      difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)];

    form.reset({
      subjectGroup: randomGroup,
      subject: randomSubject,
      difficulty: randomDifficulty,
    });

    handleGenerateQuiz({
      subject: randomSubject,
      difficulty: randomDifficulty,
    });
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answerIndex,
    }));
  };

  const handleNextQuestion = () => {
    const isCorrect =
      selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setFinalScore(newScore);
      setQuizState('finished');
      if (user && quizConfig) {
        saveQuizResult({
          userId: user.uid,
          subject: quizConfig.subject,
          difficulty: quizConfig.difficulty,
          score: newScore,
          totalQuestions: questions.length,
        });
      }
    }
  };

  const handleRestart = () => {
    setQuizState('configuring');
    form.reset();
  };
  
  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }


  const renderContent = () => {
    switch (quizState) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">
              Generating your quiz...
            </p>
          </div>
        );
      case 'displaying':
        return (
          <Form {...form}>
            <form>
              <Card>
                <CardHeader>
                  <CardTitle>
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </CardTitle>
                  <CardDescription>
                    <div className="prose prose-sm max-w-none p-4 dark:prose-invert md:prose-base md:p-6">
                      <ReactMarkdown
                        remarkPlugins={[[remarkMath, { singleDollarTextMath: true }], remarkGfm]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {currentQuestion.question}
                      </ReactMarkdown>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    key={currentQuestionIndex}
                    onValueChange={(value) => handleAnswerSelect(Number(value))}
                    value={
                      selectedAnswers[currentQuestionIndex]?.toString() ?? undefined
                    }
                    className="space-y-4"
                  >
                    {currentQuestion.options.map((option, index) => (
                      <FormItem
                        key={index}
                        className="flex items-center space-x-3 space-y-0 rounded-md border p-4 transition-colors has-[:checked]:bg-secondary"
                      >
                        <FormControl>
                          <RadioGroupItem value={index.toString()} />
                        </FormControl>
                        <FormLabel className="w-full cursor-pointer font-normal">
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown
                              remarkPlugins={[[remarkMath, { singleDollarTextMath: true }], remarkGfm]}
                              rehypePlugins={[rehypeKatex]}
                            >
                              {option}
                            </ReactMarkdown>
                          </div>
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswers[currentQuestionIndex] === undefined}
                    className="w-full"
                    type="button"
                  >
                    {currentQuestionIndex < questions.length - 1
                      ? 'Next Question'
                      : 'Finish Quiz'}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        );
      case 'finished':
        if (isReviewing) {
          return (
            <Card className="w-full max-w-4xl">
              <CardHeader>
                <CardTitle className="font-headline text-3xl">
                  Review Your Answers
                </CardTitle>
                <CardDescription>
                  Your final score was {finalScore} / {questions.length}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {questions.map((q, index) => {
                    const selected = selectedAnswers[index];
                    const correct = q.correctAnswer;
                    const isCorrect = selected === correct;
                    return (
                      <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>
                          <div className="flex items-center gap-4">
                            {isCorrect ? (
                              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                            )}
                            <span className="text-left">
                              Question {index + 1}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-6 p-2">
                            <div className="prose prose-sm max-w-none dark:prose-invert md:prose-base">
                              <ReactMarkdown
                                remarkPlugins={[[remarkMath, { singleDollarTextMath: true }], remarkGfm]}
                                rehypePlugins={[rehypeKatex]}
                              >
                                {q.question}
                              </ReactMarkdown>
                            </div>
                            <div className="space-y-2">
                              {q.options.map((option, i) => {
                                const isSelected = i === selected;
                                const isCorrectAnswer = i === correct;
                                return (
                                  <div
                                    key={i}
                                    className={cn(
                                      'flex items-start gap-3 rounded-md border p-3 text-sm',
                                      isCorrectAnswer &&
                                        'border-green-500 bg-green-500/10',
                                      isSelected &&
                                        !isCorrectAnswer &&
                                        'border-red-500 bg-red-500/10'
                                    )}
                                  >
                                    {isCorrectAnswer ? (
                                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                                    ) : isSelected ? (
                                      <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                                    ) : (
                                      <div className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                    )}
                                    <div className="prose prose-sm max-w-none dark:prose-invert">
                                      <ReactMarkdown
                                        remarkPlugins={[[remarkMath, { singleDollarTextMath: true }], remarkGfm]}
                                        rehypePlugins={[rehypeKatex]}
                                      >
                                        {option}
                                      </ReactMarkdown>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div>
                              <Badge>Explanation</Badge>
                              <div className="prose prose-sm mt-2 max-w-none rounded-md border bg-secondary/50 p-4 dark:prose-invert md:prose-base">
                                <ReactMarkdown
                                  remarkPlugins={[[remarkMath, { singleDollarTextMath: true }], remarkGfm]}
                                  rehypePlugins={[rehypeKatex]}
                                >
                                  {q.explanation}
                                </ReactMarkdown>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Button onClick={() => setIsReviewing(false)} className="w-full">
                  Back to Score
                </Button>
                <Button
                  onClick={handleRestart}
                  variant="secondary"
                  className="w-full"
                >
                  Take Another Quiz
                </Button>
              </CardFooter>
            </Card>
          );
        }

        return (
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">
                Quiz Complete!
              </CardTitle>
              <CardDescription>Here's how you did.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold">
                {finalScore} / {questions.length}
              </p>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button onClick={() => setIsReviewing(true)} className="w-full">
                <BookOpen className="mr-2" /> Review Answers
              </Button>
              <Button
                onClick={handleRestart}
                variant="secondary"
                className="w-full"
              >
                Take Another Quiz
              </Button>
            </CardFooter>
          </Card>
        );
      case 'error':
        return (
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-destructive">
                Something Went Wrong
              </CardTitle>
              <CardDescription>
                We couldn't generate the quiz. Please try again.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleRestart} className="w-full">
                Try Again
              </Button>
            </CardContent>
          </Card>
        );
      case 'configuring':
      default:
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">
                Create Your Quiz
              </CardTitle>
              <CardDescription>
                Select your subject and difficulty, or generate a random quiz.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onFormSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="subjectGroup"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Subject Group</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-wrap gap-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="PCM" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                PCM
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="PCMB" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                PCMB
                              </FormLabel>
                            </FormItem>
                             <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="BPC" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                BPC
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!subjectGroup}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableSubjects.map((subject) => (
                              <SelectItem key={subject} value={subject}>
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a difficulty" />
                            </Trigger>
                          </FormControl>
                          <SelectContent>
                            {difficultyLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex flex-col gap-4 md:flex-row">
                  <Button type="submit" className="w-full">
                    <BrainCircuit className="mr-2" /> Generate Quiz
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleRandomQuiz}
                    className="w-full"
                  >
                    <Dices className="mr-2" /> Random Quiz
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-accent/10 via-background to-background p-4 md:p-8">
      <div className="container mx-auto">
        <div className="absolute top-4 left-4 md:top-8 md:left-8">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="mr-2" /> Back to Home
            </Link>
          </Button>
        </div>
        <div className="flex min-h-[80vh] items-center justify-center">
          {renderContent()}
        </div>
      </div>
    </main>
  );
}
