import { VerticalAscentClient } from '@/components/vertical-ascent/client';
import { subjects } from '@/lib/data';

export default function LearningPage() {
  return (
    <main>
      <VerticalAscentClient subjects={subjects} />
    </main>
  );
}
