"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Timer,
  Target,
  TrendingUp,
  Download,
  Share2,
  Filter,
  ChevronDown,
  ChevronUp,
  Clock,
  BarChart3,
  Users,
  Zap,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import { apiService, LeaderboardMember } from "@/services/weaknessApi";

interface ParticipantData extends LeaderboardMember {
  isCurrentUser?: boolean;
  lastUpdate?: Date;
}

interface LiveLeaderboardProps {
  variant?: "full" | "compact";
  className?: string;
  studyRoomId?: string;
  currentUserId?: string;
}

export const LiveLeaderboard = ({
  variant = "full",
  className,
  studyRoomId,
  currentUserId,
}: LiveLeaderboardProps) => {
  const [participants, setParticipants] = useState<ParticipantData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("overall");
  const [isLive, setIsLive] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();
  const [timeWindow, setTimeWindow] = useState<"live" | "1hour" | "alltime">(
    "live"
  );
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const displayCount = variant === "compact" ? 5 : participants.length;

  const fetchLeaderboard = useCallback(async () => {
    if (!studyRoomId) return;
    try {
      setLoading(true);
      const limit = variant === "compact" ? 5 : 20;
      const data = await apiService.getLiveLeaderboard(studyRoomId);

      const formattedData = data.map((p) => ({
        ...p,
        isCurrentUser: p.id === currentUserId,
        lastUpdate: new Date(),
      }));

      setParticipants(formattedData);
    } catch (error: any) {
      toast.error("Failed to load leaderboard", { description: error.message });
    } finally {
      setLoading(false);
    }
  }, [studyRoomId, filter, variant, currentUserId]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    if (!isLive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      fetchLeaderboard();
    }, 1000 * 120);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLive, fetchLeaderboard]);

  const sortedParticipants = [...participants].slice(0, displayCount);

  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleShare = () => {
    toast.success("Leaderboard shared to group!", {
      description: "A snapshot has been sent to all participants.",
      duration: 3000,
    });
  };

  const handleExport = () => {
    toast.success("CSV export ready!", {
      description: "Your leaderboard data has been downloaded.",
      duration: 3000,
    });
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />;
      case 3:
        return <Award className="h-4 w-4 text-amber-600" />;
      default:
        return (
          <span className="text-sm font-medium text-muted-foreground">
            #{rank}
          </span>
        );
    }
  };

  const getRowClassName = (participant: ParticipantData, rank: number) => {
    if (participant.isCurrentUser) {
      return "bg-[#fe7244]/5 border-[#fe7244]/20";
    }
    if (rank <= 3) {
      return "bg-muted/30";
    }
    return "";
  };

  const shouldReduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <Card className={`bg-card ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#fe7244]" />
            <CardTitle className="text-lg font-semibold">
              {variant === "compact" ? "Top Performers" : "Live Leaderboard"}
            </CardTitle>
            {isLive && (
              <Badge
                variant="secondary"
                className="bg-[#2dd4bf]/10 text-[#2dd4bf] hover:bg-[#2dd4bf]/20"
              >
                <div className="h-2 w-2 rounded-full bg-[#2dd4bf] mr-1 animate-pulse" />
                Live
              </Badge>
            )}
          </div>

          {variant === "full" && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="hidden sm:flex"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          )}
        </div>

        {variant === "full" && (
          <div className="flex flex-col sm:flex-row gap-2 mt-3">
            <Select
              value={filter}
              onValueChange={(value: any) => setFilter(value)}
            >
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overall">Overall Rankings</SelectItem>
                <SelectItem value="physics">Subject: Physics</SelectItem>
                <SelectItem value="chemistry">Subject: Chemistry</SelectItem>
                <SelectItem value="mathematics">
                  Subject: Mathematics
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={timeWindow}
              onValueChange={(value: any) => setTimeWindow(value)}
            >
              <SelectTrigger className="w-full sm:w-40">
                <Clock className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="1hour">Last Hour</SelectItem>
                <SelectItem value="alltime">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[#e0e0e0] h-8">
                <TableHead className="w-12 pl-4 py-2 text-sm">Rank</TableHead>
                <TableHead className="py-2 text-sm min-w-[160px]">
                  Participant
                </TableHead>
                <TableHead className="text-right py-2 text-sm min-w-[80px]">
                  Score
                </TableHead>
                <TableHead className="text-right py-2 text-sm min-w-[90px] hidden sm:table-cell">
                  Accuracy
                </TableHead>
                {variant === "full" && (
                  <TableHead className="text-right py-2 text-sm min-w-[100px] hidden md:table-cell">
                    Time Penalty
                  </TableHead>
                )}
                {variant === "full" && (
                  <TableHead className="w-8 py-2"></TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {sortedParticipants.map((participant, index) => {
                  const rank = index + 1;
                  const isExpanded = expandedRows.has(participant.id);

                  return (
                    <React.Fragment key={participant.id}>
                      <motion.tr
                        layout={!shouldReduceMotion}
                        initial={
                          shouldReduceMotion ? false : { opacity: 0, y: 20 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                        className={`border-[#e0e0e0] transition-colors h-10 ${getRowClassName(
                          participant,
                          rank
                        )}`}
                      >
                        <TableCell className="pl-4 py-1">
                          <div className="flex items-center justify-center">
                            {getRankIcon(rank)}
                          </div>
                        </TableCell>

                        <TableCell className="py-1">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 flex-shrink-0">
                              <AvatarImage
                                src={participant.avatar}
                                alt={participant.name}
                              />
                              <AvatarFallback className="text-sm">
                                {participant.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-sm truncate">
                                {participant.name}
                                {participant.isCurrentUser && (
                                  <Badge
                                    variant="secondary"
                                    className="ml-1 text-[10px] px-1 py-0 h-4"
                                  >
                                    You
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-right py-1">
                          <div className="font-semibold text-sm">
                            {participant.score.toLocaleString()}
                          </div>
                        </TableCell>

                        <TableCell className="text-right py-1 hidden sm:table-cell">
                          <div className="flex items-center justify-end gap-1">
                            <CheckCircle className="h-3 w-3 text-[#2dd4bf] flex-shrink-0" />
                            <span className="text-sm">
                              {participant.correctness.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>

                        {variant === "full" && (
                          <TableCell className="py-1">
                            <Collapsible>
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-0 h-5 w-5"
                                  onClick={() =>
                                    toggleRowExpansion(participant.id)
                                  }
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="h-3 w-3" />
                                  ) : (
                                    <ChevronDown className="h-3 w-3" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                            </Collapsible>
                          </TableCell>
                        )}
                      </motion.tr>

                      {variant === "full" && isExpanded && (
                        <TableRow className="border-[#e0e0e0]">
                          <TableCell colSpan={6} className="p-0">
                            <Collapsible open={isExpanded}>
                              <CollapsibleContent>
                                <motion.div
                                  initial={
                                    shouldReduceMotion
                                      ? false
                                      : { opacity: 0, height: 0 }
                                  }
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{
                                    duration: shouldReduceMotion ? 0 : 0.2,
                                  }}
                                  className="px-4 py-3 bg-muted/20"
                                >
                                  <div className="space-y-3">
                                    <h4 className="text-sm font-medium flex items-center gap-2">
                                      <BarChart3 className="h-4 w-4" />
                                      Subject Breakdown
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                      {Object.entries(participant.subjects).map(
                                        ([subject, data]) => (
                                          <div
                                            key={subject}
                                            className="bg-card rounded-lg p-3 border"
                                          >
                                            <div className="flex items-center justify-between mb-2">
                                              <span className="text-sm font-medium capitalize">
                                                {subject}
                                              </span>
                                              {data.strongest && (
                                                <Badge
                                                  variant="secondary"
                                                  className="text-sm bg-[#fe7244]/10 text-[#fe7244]"
                                                >
                                                  <Zap className="h-3 w-3 mr-1" />
                                                  Strongest
                                                </Badge>
                                              )}
                                            </div>
                                            <div className="space-y-1">
                                              <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                  Score
                                                </span>
                                                <span className="font-medium">
                                                  {data.score}
                                                </span>
                                              </div>
                                              <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                  Best Time
                                                </span>
                                                <span className="font-medium">
                                                  {data.time}s
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              </CollapsibleContent>
                            </Collapsible>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>

        {variant === "compact" && participants.length > displayCount && (
          <div className="p-3 border-t border-[#e0e0e0]">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                +{participants.length - displayCount} more participants
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
