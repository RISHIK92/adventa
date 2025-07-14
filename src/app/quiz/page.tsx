
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BrainCircuit,
  Dices,
  Loader2,
  Shuffle,
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const subjectGroups = {
  PCM: ['Physics', 'Chemistry', 'Mathematics'],
  PCMB: ['Physics', 'Chemistry', 'Mathematics', 'Chemistry'],
};

const difficultyLevels = ['Easy', 'Medium', 'Hard', 'Expert'] as const;

const formSchema = z.object({
  subjectGroup: z.enum(['PCM', 'PCMB']),
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
  const [quizState, setQuizState] = React.useState<QuizState>('configuring');
  const [questions, setQuestions] = React.useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<
    Record<number, number>
  >({});
  const { toast } = useToast();

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
    try {
      const result = await generateQuiz(values);
      if (result && result.questions?.length > 0) {
        setQuestions(result.questions);
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswers({});
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
    const randomGroup = Math.random() < 0.5 ? 'PCM' : 'PCMB';
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
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizState('finished');
    }
  };

  const handleRestart = () => {
    setQuizState('configuring');
    form.reset();
  };

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
                      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {currentQuestion.question}
                      </ReactMarkdown>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
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
                           <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} className="prose prose-sm max-w-none dark:prose-invert">
                            {option}
                          </ReactMarkdown>
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
                {score} / {questions.length}
              </p>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button onClick={handleRestart} className="w-full">
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
                            className="flex space-x-4"
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
                            </SelectTrigger>
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
