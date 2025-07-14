
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
import { useIsMobile } from '@/hooks/use-mobile';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
import { Skeleton } from '@/components/ui/skeleton';
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

export function VerticalAscentClient({
  subjects: initialSubjects,
}: VerticalAscentClientProps) {
  const subjects = React.useMemo(
    () =>
      initialSubjects.map((s) => ({ ...s, iconName: s.iconName || 'Atom' })),
    [initialSubjects]
  );
  const isMobile = useIsMobile();
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
      <div className="absolute top-0 left-0 -z-10 h-full w-full bg-gradient-to-br from-primary/10 via-background to-background" />

      <div className="container mx-auto">
        <div className="flex flex-col items-center">
          <div
            className={cn(
              'mb-4 transition-all duration-700 ease-in-out',
              viewState !== 'subjects'
                ? 'scale-100 opacity-100'
                : 'pointer-events-none scale-90 opacity-0'
            )}
          >
            {selectedSubject && <SubjectHeader subject={selectedSubject} />}
          </div>

          <div
            className={cn(
              'w-full transition-all duration-500 ease-in-out',
              viewState !== 'subjects'
                ? 'pointer-events-none absolute opacity-0'
                : 'opacity-100'
            )}
          >
            <SubjectsView
              subjects={subjects}
              onSelectSubject={handleSelectSubject}
            />
          </div>

          <div
            className={cn(
              'relative w-full max-w-5xl',
              viewState === 'subjects' ? 'hidden' : 'block'
            )}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className={cn(
                'absolute -top-12 left-0 z-10 flex items-center gap-2 transition-opacity duration-300',
                viewState === 'subjects'
                  ? 'pointer-events-none opacity-0'
                  : 'opacity-100'
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden md:inline">{backButtonText}</span>
            </Button>

            <div
              className={cn(
                'w-full transition-all duration-700 ease-in-out',
                viewState === 'lessons'
                  ? 'opacity-100'
                  : 'pointer-events-none absolute opacity-0'
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
                  : 'pointer-events-none -translate-y-4 opacity-0'
              )}
            >
              {selectedSubject && selectedLesson && (
                <LessonDetailView
                  subject={selectedSubject}
                  lesson={selectedLesson}
                  toast={toast}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubjectsView({
  subjects,
  onSelectSubject,
}: {
  subjects: Subject[];
  onSelectSubject: (subject: Subject) => void;
}) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <BrainCircuit className="mb-4 h-12 w-12 text-primary md:h-16 md:w-16" />
      <h1 className="font-headline text-4xl font-bold md:text-5xl">
        Vertical Ascent
      </h1>
      <p className="mb-8 mt-2 max-w-2xl text-md text-muted-foreground md:mb-12 md:text-lg">
        An interactive learning journey. Select a subject to begin your ascent.
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <Card
            key={subject.id}
            onClick={() => onSelectSubject(subject)}
            className="group cursor-pointer bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl"
          >
            <CardHeader className="items-center">
              <div className="rounded-full bg-primary/10 p-3 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <SubjectIcon
                  name={subject.iconName}
                  className="h-8 w-8 text-primary transition-colors duration-300 group-hover:text-primary-foreground"
                />
              </div>
              <CardTitle className="font-headline text-xl">
                {subject.title}
              </CardTitle>
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
    <div className="flex items-center gap-4 rounded-full border bg-card/80 p-2 pr-4 shadow-sm backdrop-blur-sm">
      <div className="rounded-full bg-primary/10 p-2">
        <SubjectIcon name={subject.iconName} className="h-6 w-6 text-primary" />
      </div>
      <h1 className="font-headline text-xl font-bold md:text-2xl">
        {subject.title}
      </h1>
    </div>
  );
}

function LessonsView({
  subject,
  onSelectLesson,
}: {
  subject: Subject;
  onSelectLesson: (lesson: Lesson) => void;
}) {
  const isMobile = useIsMobile();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [svgDimensions, setSvgDimensions] = React.useState({
    width: 0,
    height: 0,
  });

  const ITEMS_PER_ROW = isMobile ? 1 : 4;
  const PADDING_X = isMobile ? 16 : 50;
  const PADDING_Y = 20;
  const NODE_WIDTH = isMobile ? 280 : 180;
  const NODE_HEIGHT = 60;
  const H_SPACING = isMobile ? 0 : 40;
  const V_SPACING = isMobile ? 20 : 40;

  const nodes = React.useMemo(() => {
    return subject.lessons.map((lesson, i) => {
      const rowIndex = Math.floor(i / ITEMS_PER_ROW);
      const colIndex = i % ITEMS_PER_ROW;

      const effectiveColIndex =
        rowIndex % 2 === 0 ? colIndex : ITEMS_PER_ROW - 1 - colIndex;

      const x = effectiveColIndex * (NODE_WIDTH + H_SPACING) + PADDING_X;
      const y = rowIndex * (NODE_HEIGHT + V_SPACING) + PADDING_Y;

      return { ...lesson, x, y, rowIndex };
    });
  }, [subject.lessons, ITEMS_PER_ROW, NODE_WIDTH, H_SPACING, V_SPACING]);

  React.useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        const numRows = Math.ceil(subject.lessons.length / ITEMS_PER_ROW);
        const totalHeight = numRows * (NODE_HEIGHT + V_SPACING) + PADDING_Y;
        let totalWidth = ITEMS_PER_ROW * (NODE_WIDTH + H_SPACING) + PADDING_X;
        if (isMobile && containerRef.current) {
          totalWidth = containerRef.current.offsetWidth;
        }
        setSvgDimensions({ width: totalWidth, height: totalHeight });
      }
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [
    subject.lessons,
    isMobile,
    ITEMS_PER_ROW,
    NODE_WIDTH,
    NODE_HEIGHT,
    H_SPACING,
    V_SPACING,
  ]);

  const { width, height } = svgDimensions;

  if (isMobile) {
    return (
      <div className="space-y-4">
        {subject.lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            className="relative flex items-center justify-center"
          >
            {index < subject.lessons.length - 1 && (
              <div className="absolute left-1/2 top-full h-4 w-0.5 bg-primary/30" />
            )}
            <Card
              onClick={() => onSelectLesson(lesson)}
              className="w-full max-w-sm cursor-pointer border-2 border-transparent bg-card/60 p-2 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-primary/80 hover:shadow-primary/20"
              style={{ height: `${NODE_HEIGHT}px` }}
            >
              <CardTitle className="text-sm font-medium">
                {lesson.title}
              </CardTitle>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex w-full items-center justify-center"
      style={{ height: `${height}px` }}
    >
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
              className="absolute animate-fade-in-up transition-transform duration-300 ease-in-out"
              style={{
                top: `${node.y}px`,
                left: `${node.x}px`,
                width: `${NODE_WIDTH}px`,
                height: `${NODE_HEIGHT}px`,
                animationDelay: `${0.2 + i * 0.05}s`,
              }}
            >
              <Card
                onClick={() => onSelectLesson(node)}
                className="flex h-full w-full cursor-pointer items-center justify-center border-2 border-transparent bg-card/60 p-2 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-primary/80 hover:shadow-primary/20"
              >
                <CardTitle className="text-sm font-medium">
                  {node.title}
                </CardTitle>
              </Card>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function LessonDetailView({
  subject,
  lesson,
  toast,
}: {
  subject: Subject;
  lesson: Lesson;
  toast: any;
}) {
  const [cheatsheetContent, setCheatsheetContent] = React.useState<string | null>(null);
  const [formulasheetContent, setFormulasheetContent] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('cheatsheet');

  React.useEffect(() => {
    async function loadContent() {
      setIsLoading(true);
      try {
        const [csResponse, fsResponse] = await Promise.all([
          fetch(`/content/${lesson.id}.cs.md`),
          fetch(`/content/${lesson.id}.fs.md`),
        ]);

        if (csResponse.ok) {
          const text = await csResponse.text();
          setCheatsheetContent(text);
        } else {
          setCheatsheetContent('### Cheatsheet not available\n\nCould not load the cheatsheet content.');
        }

        if (fsResponse.ok) {
          const text = await fsResponse.text();
          setFormulasheetContent(text);
        } else {
          setFormulasheetContent('### Formula sheet not available\n\nCould not load the formula sheet content.');
        }

      } catch (error) {
        setCheatsheetContent('### Content not available\n\nAn error occurred while fetching content.');
        setFormulasheetContent('### Content not available\n\nAn error occurred while fetching content.');
        console.error('Failed to fetch lesson content:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadContent();
  }, [lesson.id]);
  
  const renderContent = (content: string | null) => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      );
    }
    return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || ''}</ReactMarkdown>
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="mb-8 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl font-bold md:text-3xl">
            {lesson.title}
          </CardTitle>
          <CardDescription>From the subject: {subject.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cheatsheet">Cheatsheet</TabsTrigger>
              <TabsTrigger value="formulasheet">Formula Sheet</TabsTrigger>
            </TabsList>
            <TabsContent value="cheatsheet">
               <Card className="mt-4">
                  <CardContent className="p-4 md:p-6 prose dark:prose-invert max-w-none">
                    {renderContent(cheatsheetContent)}
                  </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="formulasheet">
               <Card className="mt-4">
                  <CardContent className="p-4 md:p-6 prose dark:prose-invert max-w-none">
                    {renderContent(formulasheetContent)}
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

function AiSuggestions({
  subject,
  lesson,
  toast,
}: {
  subject: Subject;
  lesson: Lesson;
  toast: any;
}) {
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasFetched, setHasFetched] = React.useState(false);

  const handleFetchSuggestions = async () => {
    setIsLoading(true);
    setHasFetched(true);
    const result = await getSuggestions({
      currentSubject: subject.title,
      currentLesson: lesson.title,
      depth: 1,
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
          <CardTitle className="flex items-center gap-2 font-headline text-xl md:text-2xl">
            <Lightbulb className="text-primary" /> Related Subjects
          </CardTitle>
          <CardDescription>
            Broaden your knowledge with these related topics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-default px-3 py-1 text-sm md:text-base"
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="py-4 text-center">
      <Button onClick={handleFetchSuggestions} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Thinking...
          </>
        ) : (
          <>
            <Lightbulb className="mr-2 h-4 w-4" /> Get Smart Suggestions
          </>
        )}
      </Button>
    </div>
  );
}

    