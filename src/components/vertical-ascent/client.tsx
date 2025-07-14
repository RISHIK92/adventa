
'use client';

import * as React from 'react';
import {
  ArrowLeft,
  Atom,
  Beaker,
  BrainCircuit,
  Calculator,
  FileText,
  Lightbulb,
  Loader2,
  Sigma,
} from 'lucide-react';

import type { Lesson, Subject } from '@/lib/types';
import { getSuggestions } from '@/app/actions';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type ViewState = 'subjects' | 'lessons' | 'lesson_detail';

interface VerticalAscentClientProps {
  subjects: Omit<Subject, 'iconName'>[];
}

const iconMap = {
  Atom: Atom,
  Calculator: Calculator,
  Beaker: Beaker,
};

function SubjectIcon({
  name,
  className,
}: {
  name: Subject['iconName'];
  className?: string;
}) {
  const Icon = iconMap[name];
  return Icon ? <Icon className={className} /> : null;
}

export function VerticalAscentClient({ subjects: initialSubjects }: VerticalAscentClientProps) {
  const subjects = React.useMemo(() => initialSubjects.map(s => ({...s, iconName: s.iconName || 'Atom' })), [initialSubjects]);

  const [viewState, setViewState] = React.useState<ViewState>('subjects');
  const [selectedSubject, setSelectedSubject] = React.useState<Subject | null>(
    null
  );
  const [selectedLesson, setSelectedLesson] = React.useState<Lesson | null>(
    null
  );
  const { toast } = useToast();

  const handleSelectSubject = (subject: Subject) => {
    React.startTransition(() => {
      setSelectedSubject(subject);
      setViewState('lessons');
    });
  };

  const handleSelectLesson = (lesson: Lesson) => {
    React.startTransition(() => {
      setSelectedLesson(lesson);
      setViewState('lesson_detail');
    });
  };

  const handleBack = () => {
    React.startTransition(() => {
      if (viewState === 'lesson_detail') {
        setSelectedLesson(null);
        setViewState('lessons');
      } else if (viewState === 'lessons') {
        setSelectedSubject(null);
        setViewState('subjects');
      }
    });
  };

  const backButtonText = React.useMemo(() => {
    if (viewState === 'lesson_detail') return `Back to ${selectedSubject?.title}`;
    if (viewState === 'lessons') return 'Back to Subjects';
    return '';
  }, [viewState, selectedSubject]);

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden p-4 md:p-8"
      data-view-state={viewState}
    >
      <div className="absolute inset-0 -z-10 bg-background" />
      <div className="absolute inset-0 -z-10 bg-primary/10 [mask-image:radial-gradient(100%_100%_at_50%_0,white,transparent)]" />
      
      <div className="container mx-auto relative">
        <div
          className={cn(
            'absolute top-8 left-1/2 -translate-x-1/2 transition-all duration-700 ease-in-out',
            viewState !== 'subjects'
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-90 pointer-events-none'
          )}
        >
          {selectedSubject && <SubjectHeader subject={selectedSubject} />}
        </div>
        
        <div
          className={cn(
            'transition-all duration-500 ease-in-out',
            viewState !== 'subjects' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          )}
        >
          <SubjectsView subjects={subjects} onSelectSubject={handleSelectSubject} />
        </div>

        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className={cn(
              'absolute -top-4 left-0 transition-opacity duration-300 flex items-center gap-2',
              viewState === 'subjects' ? 'opacity-0 pointer-events-none' : 'opacity-100'
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            {backButtonText}
          </Button>

          <div
            className={cn(
              'transition-all duration-700 ease-in-out delay-200',
              viewState === 'lessons'
                ? 'opacity-100'
                : 'opacity-0 pointer-events-none'
            )}
          >
            {selectedSubject && (
              <LessonsView
                subject={selectedSubject}
                onSelectLesson={handleSelectLesson}
              />
            )}
          </div>

          <div
            className={cn(
              'transition-all duration-700 ease-in-out',
              viewState === 'lesson_detail'
                ? 'opacity-100'
                : 'opacity-0 pointer-events-none -translate-y-4'
            )}
          >
            {selectedSubject && selectedLesson && (
              <LessonDetailView subject={selectedSubject} lesson={selectedLesson} toast={toast}/>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SubjectsView({ subjects, onSelectSubject }: { subjects: Subject[], onSelectSubject: (subject: Subject) => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <BrainCircuit className="h-16 w-16 mb-4 text-primary" />
      <h1 className="text-4xl md:text-5xl font-bold font-headline">Vertical Ascent</h1>
      <p className="mt-2 mb-12 text-lg text-muted-foreground max-w-2xl">
        An interactive learning journey. Select a subject to begin your ascent.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Card
            key={subject.id}
            onClick={() => onSelectSubject(subject)}
            className="cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-300 group"
          >
            <CardHeader className="items-center">
              <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <SubjectIcon name={subject.iconName} className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <CardTitle className="font-headline">{subject.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{subject.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SubjectHeader({ subject }: { subject: Subject }) {
    return (
        <div className="flex items-center gap-4 p-2 rounded-full bg-card shadow-sm border">
            <div className="p-2 bg-primary/10 rounded-full">
              <SubjectIcon name={subject.iconName} className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold font-headline">{subject.title}</h1>
        </div>
    );
}

function LessonsView({ subject, onSelectLesson }: { subject: Subject, onSelectLesson: (lesson: Lesson) => void }) {
  return (
    <div className="pt-32 flex justify-center">
        <div className="flex flex-col items-center gap-8">
            {subject.lessons.map((lesson, index) => (
                <div key={lesson.id} className="flex flex-col items-center relative">
                    <Card
                        onClick={() => onSelectLesson(lesson)}
                        className="w-80 h-24 flex items-center justify-center text-center p-4 cursor-pointer hover:bg-accent/20 hover:border-accent transition-all duration-300 shadow-md"
                    >
                        <CardTitle className="text-lg font-medium">{lesson.title}</CardTitle>
                    </Card>
                    {index < subject.lessons.length - 1 && (
                      <div className="w-1 h-8 bg-primary/50 border-l border-dashed border-primary"/>
                    )}
                </div>
            ))}
        </div>
    </div>
  );
}

function LessonDetailView({ subject, lesson, toast }: { subject: Subject; lesson: Lesson, toast: any }) {
  return (
    <div className="pt-32 max-w-4xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">{lesson.title}</CardTitle>
          <CardDescription>From the subject: {subject.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cheatsheet" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cheatsheet"><FileText className="mr-2 h-4 w-4"/> Cheatsheet</TabsTrigger>
              <TabsTrigger value="formulasheet"><Sigma className="mr-2 h-4 w-4"/> Formulasheet</TabsTrigger>
            </TabsList>
            <TabsContent value="cheatsheet">
              <Card className="mt-4">
                <CardContent className="p-6 text-base leading-relaxed">
                  {lesson.content.cheatsheet}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="formulasheet">
              <Card className="mt-4">
                <CardContent className="p-6 font-mono whitespace-pre-wrap">
                  {lesson.content.formulasheet}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <AiSuggestions subject={subject} lesson={lesson} toast={toast} />
    </div>
  );
}

function AiSuggestions({ subject, lesson, toast }: { subject: Subject; lesson: Lesson, toast: any }) {
    const [suggestions, setSuggestions] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [hasFetched, setHasFetched] = React.useState(false);

    const handleFetchSuggestions = async () => {
        setIsLoading(true);
        setHasFetched(true);
        const result = await getSuggestions({
            currentSubject: subject.title,
            currentLesson: lesson.title,
            depth: 1
        });
        
        if (result.success && result.suggestions) {
            setSuggestions(result.suggestions);
        } else {
            toast({
              variant: 'destructive',
              title: 'Suggestion Error',
              description: result.error || 'Failed to get suggestions.',
            });
        }
        setIsLoading(false);
    };

    if (hasFetched) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Lightbulb className="text-primary"/> Related Subjects</CardTitle>
                    <CardDescription>Broaden your knowledge with these related topics.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map((suggestion, index) => (
                                <Badge key={index} variant="secondary" className="text-base px-3 py-1">{suggestion}</Badge>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="text-center">
            <Button onClick={handleFetchSuggestions} disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Thinking...</> : <><Lightbulb className="mr-2 h-4 w-4" /> Get Smart Suggestions</>}
            </Button>
        </div>
    );
}
