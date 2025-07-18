"use client";

import { subjects } from "@/lib/data";
import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { BrainCircuit, Atom, Calculator, Beaker } from "lucide-react";
import GoogleAd from "@/app/ads/HeroToFeatures";

export default function LearningPage() {
  const iconMap = {
    Atom,
    Calculator,
    Beaker,
  };
  return (
    <main>
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center my-4">
        <BrainCircuit className="mb-4 h-12 w-12 text-primary md:h-16 md:w-16" />
        <h1 className="font-headline text-4xl font-bold md:text-5xl">
          Vertical Ascent
        </h1>
        <p className="mb-2 mt-2 max-w-2xl text-md text-muted-foreground md:mb-12 md:text-lg">
          An interactive learning journey. Select a subject to begin your
          ascent.
        </p>

        <div className="w-full">
          <GoogleAd slot="4270752574" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => {
            const Icon = iconMap[subject.iconName];
            return (
              <Link key={subject.id} href={`/learning/${subject.id}`}>
                <Card className="group cursor-pointer bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
                  <CardHeader className="items-center">
                    <div className="rounded-full bg-primary/10 p-3 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                      {Icon && <Icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />}
                    </div>
                    <CardTitle className="font-headline text-xl">
                      {subject.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{subject.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
