// src/components/LeaderboardTab.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Award,
  Zap,
  Target,
  Brain,
  TrendingUp,
  Star,
} from "lucide-react";
import { formatTime } from "@/utils/helpers";

// Define props
interface LeaderboardTabProps {
  leaderboard: any[];
  currentUserId?: string;
  performanceBadges: { [key: string]: string };
}

export const LeaderboardTab = ({
  leaderboard,
  currentUserId,
  performanceBadges,
}: LeaderboardTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" /> Group Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {leaderboard.map((member, index) => (
            <div
              key={member.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                member.id === currentUserId
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 text-center font-bold text-lg">
                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : `#${member.rank}`}
                </div>
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    {member.name}
                    {member.id === currentUserId && (
                      <Badge variant="outline" className="text-xs">
                        You
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {member.accuracy}% accuracy &bull;{" "}
                    {formatTime(member.timeTaken)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">{member.score}</div>
                <div className="text-sm text-gray-500">points</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" /> Performance Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="font-semibold text-yellow-800">Top Scorer</div>
              <div className="text-sm text-yellow-600">
                {performanceBadges.topScorer}
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold text-blue-800">Fastest Solver</div>
              <div className="text-sm text-blue-600">
                {performanceBadges.fastestSolver}
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-semibold text-green-800">Most Accurate</div>
              <div className="text-sm text-green-600">
                {performanceBadges.mostAccurate}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
