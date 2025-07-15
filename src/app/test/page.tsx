"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Clock,
  EyeOff,
  Loader2,
  XCircle,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import {
  generateTest,
  type GenerateTestInput,
  type TestQuestion,
} from "@/ai/flows/generate-test-flow";
import { saveTestResult } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

const subjectGroups = {
  MPC: ["Mathematics", "Physics", "Chemistry"],
  BPC: ["Biology", "Physics", "Chemistry"],
  PCMB: ["Physics", "Chemistry", "Mathematics", "Biology"],
};

const difficultyLevels = ["Easy", "Medium", "Hard", "Expert"] as const;
const timeLimits = ["15", "30", "45", "60", "90", "120", "180"] as const;

const questionCountOptions: Record<keyof typeof subjectGroups, string[]> = {
  MPC: ["30", "60", "90"],
  BPC: ["60", "90", "180"],
  PCMB: ["40", "80", "120"],
};

const formSchema = z
  .object({
    subjectGroup: z.enum(["MPC", "BPC", "PCMB"]),
    questionCount: z.string(),
    timeLimit: z.enum(timeLimits),
    difficulty: z.enum(difficultyLevels),
  })
  .refine(
    (data) => {
      const subjectsInGroup = subjectGroups[data.subjectGroup].length;
      return Number(data.questionCount) % subjectsInGroup === 0;
    },
    {
      message:
        "Question count must be divisible by the number of subjects in the group.",
      path: ["questionCount"],
    }
  );

type TestFormValues = z.infer<typeof formSchema>;

type TestState = "configuring" | "loading" | "testing" | "finished" | "error";

type AnsweredQuestion = TestQuestion & {
  userAnswer?: number;
  isCorrect?: boolean;
  isUnattempted?: boolean;
};

export default function TestPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [testState, setTestState] = React.useState<TestState>("configuring");
  const [questions, setQuestions] = React.useState<AnsweredQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [isReviewing, setIsReviewing] = React.useState(false);
  const [isTimeUp, setIsTimeUp] = React.useState(false);
  const [testConfig, setTestConfig] = React.useState<TestFormValues | null>(
    null
  );
  const [testAttemptId, setTestAttemptId] = React.useState<string | null>(null);

  const timerIntervalRef = React.useRef<NodeJS.Timeout>();
  const hasFinished = React.useRef(false);

  const { toast } = useToast();

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const form = useForm<TestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectGroup: "MPC",
      questionCount: "30",
      timeLimit: "30",
      difficulty: "Medium",
    },
  });

  const subjectGroup = form.watch("subjectGroup");
  const availableQuestionCounts = questionCountOptions[subjectGroup];

  React.useEffect(() => {
    const defaultCount = questionCountOptions[subjectGroup][0];
    form.setValue("questionCount", defaultCount);
  }, [subjectGroup, form]);

  const currentQuestion = questions[currentQuestionIndex];

  const finishTest = React.useCallback(() => {
    if (hasFinished.current) return;
    hasFinished.current = true;

    clearInterval(timerIntervalRef.current);
    setTestState((prevState) => {
      if (prevState !== "testing") return prevState;

      const scoredQuestions = questions.map((q) => ({
        ...q,
        isCorrect: q.userAnswer === q.correctAnswer,
        isUnattempted: q.userAnswer === undefined,
      }));
      setQuestions(scoredQuestions);

      if (user && testConfig) {
        const subjectScores: Record<
          string,
          { correct: number; total: number }
        > = {};
        scoredQuestions.forEach((q) => {
          if (!subjectScores[q.subject]) {
            subjectScores[q.subject] = { correct: 0, total: 0 };
          }
          if (q.isCorrect) {
            subjectScores[q.subject].correct++;
          }
          subjectScores[q.subject].total++;
        });
        const totalCorrect = Object.values(subjectScores).reduce(
          (acc, curr) => acc + curr.correct,
          0
        );
        const subjects = subjectGroups[testConfig.subjectGroup];
        const questionsPerSubject =
          Number(testConfig.questionCount) / subjects.length;

        saveTestResult({
          userId: user.uid,
          difficulty: testConfig.difficulty,
          totalQuestions: Number(testConfig.questionCount),
          timeLimit: Number(testConfig.timeLimit),
          subjects: subjects.map((s) => ({
            subject: s,
            count: questionsPerSubject,
          })),
          score: totalCorrect,
          subjectWiseScores: subjectScores,
          testAttemptId: testAttemptId!, // pass the unique ID
        });
      }

      return "finished";
    });
  }, [questions, testConfig, user, testAttemptId]);

  React.useEffect(() => {
    if (testState === "testing" && timeLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsTimeUp(true);
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [testState, timeLeft, finishTest]);

  const handleGenerateTest = async (values: TestFormValues) => {
    setTestState("loading");
    setTestConfig(values);
    const questionCount = Number(values.questionCount);
    const timeLimit = Number(values.timeLimit);

    const subjects = subjectGroups[values.subjectGroup];
    const questionsPerSubject = questionCount / subjects.length;

    const input: GenerateTestInput = {
      subjects: subjects.map((subject) => ({
        subject,
        count: questionsPerSubject,
      })),
      difficulty: values.difficulty,
    };

    try {
      const result = await generateTest(input);
      if (
        result &&
        result.questions?.length > 0 &&
        result.questions.length === questionCount
      ) {
        setQuestions(
          result.questions.map((q) => ({
            ...q,
            userAnswer: undefined,
            isCorrect: undefined,
            isUnattempted: true,
          }))
        );
        setCurrentQuestionIndex(0);
        setTimeLeft(timeLimit * 60);
        setIsReviewing(false);
        hasFinished.current = false;
        setTestState("testing");
        setTestAttemptId(crypto.randomUUID());
      } else {
        throw new Error("Incorrect number of questions were generated.");
      }
    } catch (error) {
      console.error("Test generation failed:", error);
      toast({
        variant: "destructive",
        title: "Test Generation Error",
        description:
          "Could not generate test questions. Please try again later.",
      });
      setTestState("error");
    }
  };

  const onFormSubmit = (values: TestFormValues) => {
    handleGenerateTest(values);
  };

  const handleTimeUp = () => {
    setIsTimeUp(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === currentQuestionIndex ? { ...q, userAnswer: answerIndex } : q
      )
    );
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finishTest();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setTestState("configuring");
    form.reset({
      subjectGroup: "MPC",
      questionCount: "30",
      timeLimit: "30",
      difficulty: "Medium",
    });
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const renderContent = () => {
    switch (testState) {
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">
              Generating your test. This may take a moment...
            </p>
          </div>
        );
      case "testing":
        const timeLimitInSeconds = (Number(testConfig?.timeLimit) || 0) * 60;
        return (
          <Form {...form}>
            <form>
              <Card className="w-full max-w-4xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      <span className="font-mono text-lg">
                        {Math.floor(timeLeft / 60)}:
                        {(timeLeft % 60).toString().padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={(timeLeft / timeLimitInSeconds) * 100}
                    className="w-full"
                  />
                  <CardDescription>
                    <div className="mt-2 flex items-center justify-between">
                      <Badge variant="outline">{currentQuestion.subject}</Badge>
                    </div>
                    <div className="prose prose-sm max-w-none p-4 dark:prose-invert md:prose-base md:p-6">
                      <ReactMarkdown
                        remarkPlugins={[
                          [remarkMath, { singleDollarTextMath: true }],
                          remarkGfm,
                        ]}
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
                    value={currentQuestion.userAnswer?.toString() ?? undefined}
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
                              remarkPlugins={[
                                [remarkMath, { singleDollarTextMath: true }],
                                remarkGfm,
                              ]}
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
                <CardFooter className="justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button type="button" onClick={handleNextQuestion}>
                    {currentQuestionIndex < questions.length - 1
                      ? "Next"
                      : "Finish Test"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        );
      case "finished":
        const subjectScores: Record<
          string,
          { correct: number; total: number }
        > = {};

        questions.forEach((q) => {
          if (!subjectScores[q.subject]) {
            subjectScores[q.subject] = { correct: 0, total: 0 };
          }
          if (q.isCorrect) {
            subjectScores[q.subject].correct++;
          }
          subjectScores[q.subject].total++;
        });
        const totalCorrect = Object.values(subjectScores).reduce(
          (acc, curr) => acc + curr.correct,
          0
        );

        if (isReviewing) {
          return (
            <Card className="w-full max-w-4xl">
              <CardHeader>
                <CardTitle className="font-headline text-3xl">
                  Review Your Answers
                </CardTitle>
                <CardDescription>
                  Your final score was {totalCorrect} / {questions.length}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {questions.map((q, index) => {
                    const selected = q.userAnswer;
                    const correct = q.correctAnswer;
                    const isCorrect = q.isCorrect;
                    const isUnattempted = q.isUnattempted;

                    return (
                      <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>
                          <div className="flex items-center gap-4">
                            {isUnattempted ? (
                              <EyeOff className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                            ) : isCorrect ? (
                              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                            )}
                            <span className="text-left">
                              Question {index + 1}
                            </span>
                            <Badge variant="outline">{q.subject}</Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-6 p-2">
                            <div className="prose prose-sm max-w-none dark:prose-invert md:prose-base">
                              <ReactMarkdown
                                remarkPlugins={[
                                  [remarkMath, { singleDollarTextMath: true }],
                                  remarkGfm,
                                ]}
                                rehypePlugins={[rehypeKatex]}
                              >
                                {q.question}
                              </ReactMarkdown>
                            </div>
                            <div className="space-y-2">
                              {q.options.map((option, i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "flex items-start gap-3 rounded-md border p-3 text-sm",
                                    i === correct &&
                                      "border-green-500 bg-green-500/10",
                                    i === selected &&
                                      !isCorrect &&
                                      "border-red-500 bg-red-500/10"
                                  )}
                                >
                                  {i === correct ? (
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                                  ) : i === selected ? (
                                    <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                                  ) : (
                                    <div className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                  )}
                                  <div className="prose prose-sm max-w-none dark:prose-invert">
                                    <ReactMarkdown
                                      remarkPlugins={[
                                        [
                                          remarkMath,
                                          { singleDollarTextMath: true },
                                        ],
                                        remarkGfm,
                                      ]}
                                      rehypePlugins={[rehypeKatex]}
                                    >
                                      {option}
                                    </ReactMarkdown>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div>
                              <Badge>Explanation</Badge>
                              <div className="prose prose-sm mt-2 max-w-none rounded-md border bg-secondary/50 p-4 dark:prose-invert md:prose-base">
                                <ReactMarkdown
                                  remarkPlugins={[
                                    [
                                      remarkMath,
                                      { singleDollarTextMath: true },
                                    ],
                                    remarkGfm,
                                  ]}
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
                <Button
                  onClick={() => setIsReviewing(false)}
                  className="w-full"
                >
                  Back to Score
                </Button>
                <Button
                  onClick={handleRestart}
                  variant="secondary"
                  className="w-full"
                >
                  Take Another Test
                </Button>
              </CardFooter>
            </Card>
          );
        }

        return (
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">
                Test Complete!
              </CardTitle>
              <CardDescription>Here's how you did.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Score</p>
                <p className="text-5xl font-bold">
                  {totalCorrect} / {questions.length}
                </p>
              </div>
              <div className="space-y-2 rounded-md border p-4">
                <h3 className="font-medium">Subject-wise Score</h3>
                {Object.entries(subjectScores).map(([subject, score]) => (
                  <div key={subject} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{subject}:</span>
                    <span className="font-semibold">
                      {score.correct} / {score.total}
                    </span>
                  </div>
                ))}
              </div>
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
                Take Another Test
              </Button>
            </CardFooter>
          </Card>
        );
      case "error":
        return (
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-destructive">
                Something Went Wrong
              </CardTitle>
              <CardDescription>
                We couldn't generate the test. Please try again.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleRestart} className="w-full">
                Try Again
              </Button>
            </CardContent>
          </Card>
        );
      case "configuring":
      default:
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">
                Configure Your Test
              </CardTitle>
              <CardDescription>
                Set up your mock test parameters.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onFormSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="subjectGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject Group</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.keys(subjectGroups)
                              .filter(
                                (g) =>
                                  g !== "PCMB" ||
                                  subjectGroups[g as keyof typeof subjectGroups]
                                    .length === 4
                              )
                              .map((group) => (
                                <SelectItem key={group} value={group}>
                                  {group}
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
                    name="questionCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Questions</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableQuestionCounts.map((count) => (
                              <SelectItem key={count} value={count}>
                                {count} Questions
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Must be divisible by the number of subjects in the
                          selected group.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timeLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Limit</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeLimits.map((limit) => (
                              <SelectItem key={limit} value={limit}>
                                {limit} Minutes
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
                              <SelectValue />
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
                <CardFooter className="flex">
                  <Button type="submit" className="w-full">
                    <BrainCircuit className="mr-2" /> Start Test
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-secondary/30 via-background to-background p-4 md:p-8">
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
        <AlertDialog open={isTimeUp} onOpenChange={setIsTimeUp}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Time's Up!</AlertDialogTitle>
              <AlertDialogDescription>
                Your time for the test has expired. Your test has been
                automatically submitted. Let's see your results.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setIsTimeUp(false)}>
                View Results
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </main>
  );
}
