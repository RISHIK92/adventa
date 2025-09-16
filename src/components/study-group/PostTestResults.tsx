"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Trophy,
  Medal,
  Share2,
  Download,
  Target,
  Crown,
  Zap,
  Clock,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import {
  LeaderboardMember,
  PredictionAnalysis,
  QuestionReviewItem,
} from "@/services/weaknessApi";

// FIX 1: Define the component's specific types only once and correctly.
interface SubjectChampion {
  subject: string;
  color: string;
  champion: LeaderboardMember;
  score: number;
}

interface PostTestResultsProps {
  className?: string;
  leaderboard: LeaderboardMember[];
  predictionAnalysis: PredictionAnalysis[];
  questionReview: QuestionReviewItem[];
}

export default function PostTestResults({
  className,
  leaderboard,
  predictionAnalysis,
  questionReview,
}: PostTestResultsProps) {
  const [sharePrivacy, setSharePrivacy] = useState(true);
  const [flagReason, setFlagReason] = useState("");

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Results link copied to clipboard!");
  };

  const handleDownloadCertificate = () => {
    toast.success("Certificate downloaded successfully!");
  };

  // FIX 2: Correctly calculate Subject Champions and ensure the useMemo hook returns a value.
  const subjectChampions = useMemo((): SubjectChampion[] => {
    const scores: Record<
      string,
      Record<string, { correct: number; total: number }>
    > = {};

    questionReview.forEach((q) => {
      Object.keys(q.memberAnswers).forEach((userId) => {
        if (!scores[q.subject]) scores[q.subject] = {};
        if (!scores[q.subject][userId]) {
          scores[q.subject][userId] = { correct: 0, total: 0 };
        }

        scores[q.subject][userId].total++;
        if (q.memberAnswers[userId] === q.correctAnswer) {
          scores[q.subject][userId].correct++;
        }
      });
    });

    const champions: Record<string, { userId: string; score: number }> = {};
    Object.entries(scores).forEach(([subject, userScores]) => {
      let topScorer = { userId: "", score: -1 };
      Object.entries(userScores).forEach(([userId, data]) => {
        const score = data.total > 0 ? (data.correct / data.total) * 100 : 0;
        if (score > topScorer.score) {
          topScorer = { userId, score };
        }
      });
      if (topScorer.userId) {
        champions[subject] = topScorer;
      }
    });

    const subjectColors: Record<string, string> = {
      Mathematics: "bg-[#f5b041]",
      Physics: "bg-[#42a5f5]",
      Chemistry: "bg-[#2dd4bf]",
      Biology: "bg-[#f87171]",
      default: "bg-gray-500",
    };

    // This map/filter chain now correctly returns the final array.
    return Object.entries(champions)
      .map(([subject, champ]) => {
        const championMember = leaderboard.find((m) => m.id === champ.userId);
        if (!championMember) return null;

        return {
          subject,
          color: subjectColors[subject] || subjectColors.default,
          champion: championMember,
          score: Math.round(champ.score),
        };
      })
      .filter((c): c is SubjectChampion => c !== null);
  }, [questionReview, leaderboard]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-text-header">
            Group Results
          </h2>
          <p className="text-[#7d7e80]">
            Final leaderboard and performance analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="privacy-toggle">Share detailed mistakes</Label>
            <Switch
              id="privacy-toggle"
              checked={sharePrivacy}
              onCheckedChange={setSharePrivacy}
            />
          </div>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share Results
          </Button>
          <Button onClick={handleDownloadCertificate}>
            <Download className="h-4 w-4 mr-2" />
            Certificate
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Leaderboard */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[#f5b041]" />
                Group Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Badges</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* FIX 3: Use the `leaderboard` prop instead of `mockMembers` */}
                  {leaderboard.map((member, index) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {index === 0 ? (
                            <Crown className="h-5 w-5 text-[#f5b041]" />
                          ) : index === 1 ? (
                            <Medal className="h-5 w-5 text-gray-400" />
                          ) : index === 2 ? (
                            <Medal className="h-5 w-5 text-orange-400" />
                          ) : null}
                          <span className="font-medium">#{member.rank}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#fe7244] text-[#ffffff] flex items-center justify-center text-sm font-medium">
                            {member.avatar}
                          </div>
                          <span className="font-medium">{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">
                            {member.score}
                          </span>
                          {/* <Progress value={member.score} className="w-16 h-2" /> */}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {member.badges.map((badge) => (
                            <Badge
                              key={badge}
                              variant="secondary"
                              className="text-xs"
                            >
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-[#7d7e80]">
                          <Clock className="h-3 w-3" />
                          {member.timeCompleted}m
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Subject Champions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[#fe7244]" />
                Subject Champions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subjectChampions.map((champion) => (
                <div key={champion.subject} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className={`${champion.color} text-white`}>
                      {champion.subject}
                    </Badge>
                    <span className="text-sm font-medium">
                      {champion.score}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-[#fe7244] text-[#ffffff] flex items-center justify-center text-sm font-medium">
                      {champion.champion.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {champion.champion.name}
                      </p>
                      <p className="text-xs text-[#7d7e80]">
                        Strongest performer
                      </p>
                    </div>
                    <Zap className="h-4 w-4 text-[#f5b041] ml-auto" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Prediction Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-warning" />
            Prediction vs Actual Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* FIX 4: Use `predictionAnalysis` prop and simplify the UI */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {predictionAnalysis.map((member) => (
              <div key={member.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#fe7244] text-[#ffffff] flex items-center justify-center text-xs font-medium">
                    {member.avatar}
                  </div>
                  <span className="font-medium text-sm">{member.name}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#7d7e80]">Prediction Accuracy</span>
                    <span className="font-medium">
                      {member.predictionAccuracy}%
                    </span>
                  </div>
                  <Progress value={member.predictionAccuracy} className="h-2" />
                  <div className="space-y-1 text-xs text-center border p-2 rounded-md">
                    Predicted{" "}
                    <span className="font-semibold">{member.predicted}</span>{" "}
                    vs. Actual{" "}
                    <span className="font-semibold">{member.actual}</span>{" "}
                    correct
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Flag Question Dialog (self-contained, no changes needed) */}
      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag Question for Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="flag-reason">Reason for flagging</Label>
              <Textarea
                id="flag-reason"
                placeholder="Describe the issue with this question..."
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                toast.success("Question flagged for review");
                setFlagReason("");
              }}
              className="w-full"
            >
              Submit Flag
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
