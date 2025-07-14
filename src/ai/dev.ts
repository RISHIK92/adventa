import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-adjacent-subjects.ts';
import '@/ai/flows/generate-quiz-flow.ts';
import '@/ai/flows/generate-test-flow.ts';
