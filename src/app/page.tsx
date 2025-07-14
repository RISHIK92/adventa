import { VerticalAscentClient } from '@/components/vertical-ascent/client';
import { subjects } from '@/lib/data';

export default function Home() {
  return (
    <main>
      <VerticalAscentClient subjects={subjects} />
    </main>
  );
}
