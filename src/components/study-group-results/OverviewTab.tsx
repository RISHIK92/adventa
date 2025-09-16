import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Clock, Target, BarChart3 } from "lucide-react";
import { getSubjectColor, getAccuracyColor, formatTime } from "@/utils/helpers";

// Define prop types to match the data structure from the parent
interface OverviewTabProps {
  testResult: any;
  hierarchicalData: any;
  groupAverageData: any;
}

export const OverviewTab = ({
  testResult,
  hierarchicalData,
  groupAverageData,
}: OverviewTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" /> Score Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">
                  {testResult.myScore}
                </div>
                <div className="text-sm text-gray-500">Your Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-600">
                  {testResult.groupAverage}
                </div>
                <div className="text-sm text-gray-500">Group Average</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {testResult.highestScore}
                </div>
                <div className="text-sm text-gray-500">Highest Score</div>
              </div>
            </div>
            <div className="space-y-3 pt-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Your Performance</span>
                  <span>
                    {testResult.myScore} / {testResult.totalQuestions * 4}
                  </span>
                </div>
                <Progress
                  value={
                    (testResult.myScore / (testResult.totalQuestions * 4)) * 100
                  }
                  className="h-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    Time: {formatTime(testResult.timeTaken)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    Accuracy: {testResult.accuracy}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" /> Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Rank</span>
              <Badge variant="secondary">
                #{testResult.rank} of {testResult.totalParticipants}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Correct Answers</span>
              <span className="font-semibold">
                {Math.round(
                  (testResult.accuracy * testResult.totalQuestions) / 100
                )}
                /{testResult.totalQuestions}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Time Efficiency</span>
              <span className="font-semibold">
                {Math.round(
                  ((testResult.duration - testResult.timeTaken) /
                    testResult.duration) *
                    100
                )}
                %
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(hierarchicalData.subjects).map(
              ([subjectName, subjectData]: [string, any]) => (
                <div key={subjectName} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3
                      className="font-semibold"
                      style={{ color: getSubjectColor(subjectName) }}
                    >
                      {subjectName}
                    </h3>
                    <Badge
                      variant="outline"
                      className={getAccuracyColor(subjectData.accuracy)}
                    >
                      {subjectData.accuracy}%
                    </Badge>
                  </div>
                  <Progress
                    value={subjectData.accuracy}
                    className="h-2"
                    style={{
                      backgroundColor: `${getSubjectColor(subjectName)}20`,
                    }}
                  />
                  <div className="grid grid-cols-3 gap-2 text-sm text-center">
                    <div>
                      <span className="text-gray-500">Correct</span>
                      <div className="font-semibold">
                        {subjectData.correct}/{subjectData.attempted}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Time/Q</span>
                      <div className="font-semibold">
                        {formatTime(subjectData.avgTimeSec)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Group Avg</span>
                      <div className="font-semibold">
                        {groupAverageData.subjects[subjectName]?.accuracy}%
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
