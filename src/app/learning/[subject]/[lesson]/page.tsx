import { subjects } from "@/lib/data";
import { notFound } from "next/navigation";
import { LessonDetailView } from "@/components/vertical-ascent/client";

export default function LessonPage({ params }: { params: { subject: string; lesson: string } }) {
  const subject = subjects.find((s) => s.id === params.subject);
  if (!subject) return notFound();
  const lesson = subject.lessons.find((l) => l.id === params.lesson);
  if (!lesson) return notFound();

  return (
    <main>
      <LessonDetailView subject={subject} lesson={lesson} />
    </main>
  );
} 