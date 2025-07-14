
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
      className="relative min-h-screen w-full overflow-x-hidden p-4 md:p-8"
      data-view-state={viewState}
    >
      <div className="absolute inset-0 -z-10 bg-background" />
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-primary/10 via-background to-background" />
      
      <div className="container mx-auto">
        <div className="flex flex-col items-center">
            <div
              className={cn(
                'transition-all duration-700 ease-in-out',
                viewState !== 'subjects'
                  ? 'opacity-100 scale-100 mb-4'
                  : 'opacity-0 scale-90 pointer-events-none'
              )}
            >
              {selectedSubject && <SubjectHeader subject={selectedSubject} />}
            </div>
            
            <div
              className={cn(
                'transition-all duration-500 ease-in-out w-full',
                viewState !== 'subjects' ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'
              )}
            >
              <SubjectsView subjects={subjects} onSelectSubject={handleSelectSubject} />
            </div>

            <div className={cn("w-full max-w-5xl relative", viewState === 'subjects' ? 'hidden' : 'block' )}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className={cn(
                  'absolute -top-14 left-0 transition-opacity duration-300 flex items-center gap-2',
                   viewState === 'subjects' ? 'opacity-0 pointer-events-none' : 'opacity-100'
                )}
              >
                <ArrowLeft className="h-4 w-4" />
                {backButtonText}
              </Button>

              <div
                className={cn(
                  'transition-all duration-700 ease-in-out w-full',
                  viewState === 'lessons'
                    ? 'opacity-100'
                    : 'opacity-0 pointer-events-none absolute'
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
            className="cursor-pointer hover:shadow-xl hover:border-primary/50 transition-all duration-300 group bg-card/80 backdrop-blur-sm"
          >
            <CardHeader className="items-center">
              <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <SubjectIcon name={subject.iconName} className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <CardTitle className="font-headline text-xl">{subject.title}</CardTitle>
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
        <div className="flex items-center gap-4 p-2 pr-4 rounded-full bg-card/80 backdrop-blur-sm shadow-sm border">
            <div className="p-2 bg-primary/10 rounded-full">
              <SubjectIcon name={subject.iconName} className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold font-headline">{subject.title}</h1>
        </div>
    );
}

function LessonsView({ subject, onSelectLesson }: { subject: Subject, onSelectLesson: (lesson: Lesson) => void }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [svgDimensions, setSvgDimensions] = React.useState({ width: 0, height: 0 });

  const PADDING_X = 50;
  const PADDING_Y = 20;
  const NODE_WIDTH = 180;
  const NODE_HEIGHT = 60;
  const H_SPACING = 40;
  const V_SPACING = 40;
  const ITEMS_PER_ROW = 4;
  
  const nodes = React.useMemo(() => {
    return subject.lessons.map((lesson, i) => {
      const rowIndex = Math.floor(i / ITEMS_PER_ROW);
      const colIndex = i % ITEMS_PER_ROW;
      
      const effectiveColIndex = rowIndex % 2 === 0 ? colIndex : (ITEMS_PER_ROW - 1 - colIndex);
      
      const x = effectiveColIndex * (NODE_WIDTH + H_SPACING) + PADDING_X;
      const y = rowIndex * (NODE_HEIGHT + V_SPACING) + PADDING_Y;
      
      return { ...lesson, x, y, rowIndex };
    });
  }, [subject.lessons]);
  
  React.useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        const numRows = Math.ceil(subject.lessons.length / ITEMS_PER_ROW);
        const totalHeight = numRows * (NODE_HEIGHT + V_SPACING) + PADDING_Y;
        const totalWidth = ITEMS_PER_ROW * (NODE_WIDTH + H_SPACING) + PADDING_X;
        setSvgDimensions({ width: totalWidth, height: totalHeight });
      }
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [subject.lessons, nodes]);

  const { width, height } = svgDimensions;

  return (
    <div ref={containerRef} className="relative w-full flex justify-center items-center" style={{ height: `${height}px` }}>
      {width > 0 && (
        <>
          <svg width={width} height={height} className="absolute inset-0">
             <defs>
              <linearGradient id="branchGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(var(--primary) / 0.1)" />
                <stop offset="50%" stopColor="hsl(var(--primary) / 0.8)" />
                <stop offset="100%" stopColor="hsl(var(--primary) / 0.1)" />
              </linearGradient>
            </defs>
            <g>
              {nodes.map((node, i) => {
                const nextNode = nodes[i + 1];
                if (!nextNode) return null;

                const startX = node.x + NODE_WIDTH / 2;
                const startY = node.y + NODE_HEIGHT / 2;
                const endX = nextNode.x + NODE_WIDTH / 2;
                const endY = nextNode.y + NODE_HEIGHT / 2;

                let pathData;
                if (node.rowIndex === nextNode.rowIndex) {
                  // Horizontal connection
                  pathData = `M ${startX} ${startY} L ${endX} ${endY}`;
                } else {
                  // Vertical/Turning connection
                  const controlY = startY + V_SPACING * 0.7;
                  pathData = `M ${startX} ${startY} C ${startX} ${controlY}, ${endX} ${startY}, ${endX} ${endY}`;
                }

                return (
                  <path
                    key={`branch-${node.id}`}
                    d={pathData}
                    stroke="url(#branchGradient)"
                    strokeWidth="2.5"
                    fill="none"
                    className="animate-stroke-draw"
                    strokeDasharray="500"
                    strokeDashoffset="500"
                    style={{ animationDelay: `${0.1 + i * 0.05}s` }}
                  />
                );
              })}
            </g>
          </svg>

          {nodes.map((node, i) => (
            <div
              key={node.id}
              className="absolute transition-transform duration-300 ease-in-out animate-fade-in-up"
              style={{
                top: `${node.y}px`,
                left: `${node.x}px`,
                width: `${NODE_WIDTH}px`,
                height: `${NODE_HEIGHT}px`,
                animationDelay: `${0.2 + i * 0.05}s`
              }}
            >
              <Card
                onClick={() => onSelectLesson(node)}
                className="w-full h-full flex items-center justify-center text-center p-2 cursor-pointer bg-card/60 backdrop-blur-sm border-2 border-transparent hover:border-primary/80 transition-all duration-300 shadow-lg hover:shadow-primary/20"
              >
                <CardTitle className="text-sm font-medium">{node.title}</CardTitle>
              </Card>
            </div>
          ))}
        </>
      )}
    </div>
  );
}


function LessonDetailView({ subject, lesson, toast }: { subject: Subject; lesson: Lesson, toast: any }) {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-8 bg-card/80 backdrop-blur-sm">
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
                <CardContent className="p-6 text-base leading-relaxed prose dark:prose-invert">
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
            <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><Lightbulb className="text-primary"/> Related Subjects</CardTitle>
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
                                <Badge key={index} variant="secondary" className="text-base px-3 py-1 cursor-default">{suggestion}</Badge>
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
