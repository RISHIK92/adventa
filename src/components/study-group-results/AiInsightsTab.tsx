// src/components/AiInsightsTab.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Target,
  BookOpen,
  Clock,
  Users,
  Share2,
  Download,
  Medal,
} from "lucide-react";

// Define props
interface AiInsightsTabProps {
  aiInsights: any[]; // Replace 'any' with your actual insight type
}

export const AiInsightsTab = ({ aiInsights }: AiInsightsTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" /> AI-Powered Insights
          </CardTitle>
          <p className="text-sm text-gray-600">
            Personalized recommendations based on your performance.
          </p>
        </CardHeader>
        <CardContent>
          {aiInsights && aiInsights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Map over aiInsights here when data is available */}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="font-semibold">
                No AI insights are available for this test yet.
              </p>
              <p className="text-sm">
                Complete more tests to get personalized feedback.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" /> Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex-col items-start"
            >
              <BookOpen className="h-5 w-5 mb-2 text-primary" />
              <div className="font-semibold">Add to Practice Bank</div>
              <div className="text-xs text-gray-500 text-left">
                Save incorrect questions for review
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex-col items-start"
            >
              <Clock className="h-5 w-5 mb-2 text-primary" />
              <div className="font-semibold">Schedule Revision</div>
              <div className="text-xs text-gray-500 text-left">
                Plan focused study sessions
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex-col items-start"
            >
              <Users className="h-5 w-5 mb-2 text-primary" />
              <div className="font-semibold">Challenge Members</div>
              <div className="text-xs text-gray-500 text-left">
                Compete in specific topics
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
