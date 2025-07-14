
'use client';

import { VerticalAscentClient } from '@/components/vertical-ascent/client';
import { subjects } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LearningPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <main className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main>
      <VerticalAscentClient subjects={subjects} />
    </main>
  );
}
