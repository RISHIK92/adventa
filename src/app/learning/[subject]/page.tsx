"use client"

import { subjects } from "@/lib/data";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GoogleAd from "@/app/ads/HeroToFeatures";
import { Atom, Calculator, Beaker, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

export default function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: subjectId } = React.use(params);
  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) return notFound();

  const iconMap = {
    Atom,
    Calculator,
    Beaker,
  };
  const Icon = iconMap[subject.iconName];
  const router = useRouter();

  return (
    <main>
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center relative">
        {/* Back to Subjects Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/learning')}
          className="absolute left-4 top-4 z-10 flex items-center gap-2 transition-opacity duration-300"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden md:inline">Back to Subjects</span>
        </Button>
        <div className="flex items-center gap-4 mb-6 mt-4">
          <div className="rounded-full bg-primary/10 p-4 flex items-center justify-center shadow-md">
            {Icon && <Icon className="h-10 w-10 text-primary" />}
          </div>
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary drop-shadow-sm">
            {subject.title}
          </h1>
        </div>
        <p className="mb-8 mt-2 max-w-2xl text-md text-muted-foreground md:mb-12 md:text-lg">{subject.description}</p>
        <div className="w-full">
          <GoogleAd slot="4270752574" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subject.lessons.map((lesson) => (
            <Link key={lesson.id} href={`/learning/${subject.id}/${lesson.id}`}>
              <Card className="group cursor-pointer bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
                <CardHeader className="items-center">
                  <CardTitle className="font-headline text-xl">{lesson.title}</CardTitle>
                </CardHeader>
                <CardContent />
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
} 