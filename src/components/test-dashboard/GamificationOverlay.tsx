"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Coins,
  Badge,
  Medal,
  Crown,
  Gem,
  Gauge,
  CirclePercent,
  Sparkle,
  Goal,
  BadgePlus,
  BadgeX,
  Grid3x3,
  Dot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge as UIBadge } from "@/components/ui/badge";

interface GamificationData {
  xp: number;
  level: number;
  xpToNext: number;
  coins: number;
  streakDays: number;
  achievements: Achievement[];
  badges: GameBadge[];
  dailyBonusAvailable: boolean;
  animationsEnabled: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface GameBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface CoinTransaction {
  id: string;
  amount: number;
  type: "earned" | "spent";
  description: string;
  timestamp: Date;
}

export default function GamificationOverlay() {
  const [data, setData] = useState<GamificationData>({
    xp: 2340,
    level: 12,
    xpToNext: 660,
    coins: 1250,
    streakDays: 7,
    achievements: [
      {
        id: "first-test",
        title: "First Steps",
        description: "Complete your first practice test",
        icon: "Goal",
        unlocked: true,
        unlockedAt: new Date(Date.now() - 86400000),
      },
      {
        id: "streak-7",
        title: "Week Warrior",
        description: "Maintain a 7-day study streak",
        icon: "Crown",
        unlocked: true,
        unlockedAt: new Date(),
      },
      {
        id: "perfectionist",
        title: "Perfect Score",
        description: "Score 100% on any practice test",
        icon: "Medal",
        unlocked: false,
      },
    ],
    badges: [
      {
        id: "early-bird",
        name: "Early Bird",
        description: "Study before 8 AM",
        icon: "Crown",
        earned: true,
        earnedAt: new Date(Date.now() - 172800000),
        rarity: "common",
      },
      {
        id: "night-owl",
        name: "Night Owl",
        description: "Study after 10 PM",
        icon: "Medal",
        earned: false,
        rarity: "rare",
      },
      {
        id: "master-streak",
        name: "Streak Master",
        description: "Achieve a 30-day streak",
        icon: "Gem",
        earned: false,
        rarity: "legendary",
      },
    ],
    dailyBonusAvailable: true,
    animationsEnabled: true,
  });

  const [coinHistory, setCoinHistory] = useState<CoinTransaction[]>([
    {
      id: "1",
      amount: 50,
      type: "earned",
      description: "Daily login bonus",
      timestamp: new Date(),
    },
    {
      id: "2",
      amount: -25,
      type: "spent",
      description: "Hint purchased",
      timestamp: new Date(Date.now() - 3600000),
    },
  ]);

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showBadgeGallery, setShowBadgeGallery] = useState(false);
  const [showDailyBonus, setShowDailyBonus] = useState(false);
  const [badgeFilter, setBadgeFilter] = useState<"all" | "earned" | "locked">(
    "all"
  );
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<{
    type: "coins" | "xp";
    amount: number;
  } | null>(null);
  const [doNotDisturb, setDoNotDisturb] = useState(false);

  // XP Progress calculation
  const xpProgress = (data.xp / (data.xp + data.xpToNext)) * 100;
  const nextLevelPerks = [
    "New badge slot",
    "Bonus multiplier +10%",
    "Advanced analytics",
  ];

  // Streak flame intensity
  const getStreakIntensity = (days: number) => {
    if (days >= 30) return { scale: 1.3, color: "text-yellow-400" };
    if (days >= 14) return { scale: 1.2, color: "text-orange-400" };
    if (days >= 7) return { scale: 1.1, color: "text-red-400" };
    return { scale: 1, color: "text-gray-400" };
  };

  const streakIntensity = getStreakIntensity(data.streakDays);

  // Achievement notifications
  useEffect(() => {
    const newAchievements = data.achievements.filter(
      (achievement) =>
        achievement.unlocked &&
        achievement.unlockedAt &&
        Date.now() - achievement.unlockedAt.getTime() < 5000
    );

    newAchievements.forEach((achievement) => {
      if (!doNotDisturb) {
        toast.success(`Achievement Unlocked: ${achievement.title}`, {
          description: achievement.description,
          duration: 5000,
          action: {
            label: "View",
            onClick: () => setShowBadgeGallery(true),
          },
        });
      }
    });
  }, [data.achievements, doNotDisturb]);

  // Daily bonus spin logic
  const handleSpin = () => {
    if (isSpinning || !data.dailyBonusAvailable) return;

    setIsSpinning(true);

    // Simple deterministic reward based on current day
    const seed = new Date().getDay();
    const rewards = [
      { type: "coins" as const, amount: 50 },
      { type: "coins" as const, amount: 75 },
      { type: "xp" as const, amount: 100 },
      { type: "coins" as const, amount: 100 },
      { type: "xp" as const, amount: 150 },
      { type: "coins" as const, amount: 25 },
      { type: "xp" as const, amount: 200 },
    ];

    const result = rewards[seed];

    setTimeout(() => {
      setSpinResult(result);
      setIsSpinning(false);

      // Update data
      setData((prev) => ({
        ...prev,
        coins:
          result.type === "coins" ? prev.coins + result.amount : prev.coins,
        xp: result.type === "xp" ? prev.xp + result.amount : prev.xp,
        dailyBonusAvailable: false,
      }));

      // Add transaction
      if (result.type === "coins") {
        setCoinHistory((prev) => [
          {
            id: Date.now().toString(),
            amount: result.amount,
            type: "earned",
            description: "Daily bonus spin",
            timestamp: new Date(),
          },
          ...prev,
        ]);
      }

      toast.success(
        `Daily Bonus: +${result.amount} ${result.type.toUpperCase()}!`,
        {
          duration: 3000,
        }
      );
    }, 2000);
  };

  // Level up detection
  useEffect(() => {
    if (data.xp >= data.xp + data.xpToNext && !showLevelUp) {
      setShowLevelUp(true);
      if (!doNotDisturb) {
        toast.success(`Level Up! You're now level ${data.level + 1}`, {
          description: "New perks unlocked!",
          duration: 5000,
        });
      }
    }
  }, [data.xp, data.xpToNext, showLevelUp, doNotDisturb, data.level]);

  const filteredBadges = data.badges.filter((badge) => {
    if (badgeFilter === "earned") return badge.earned;
    if (badgeFilter === "locked") return !badge.earned;
    return true;
  });

  const getRarityColor = (rarity: GameBadge["rarity"]) => {
    switch (rarity) {
      case "legendary":
        return "border-yellow-400 bg-yellow-50";
      case "epic":
        return "border-purple-400 bg-purple-50";
      case "rare":
        return "border-blue-400 bg-blue-50";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  return (
    <>
      {/* XP Bar - Top on desktop, bottom on mobile */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff]/95 backdrop-blur-sm border-b border-border md:relative md:top-auto md:border-none">
        <div className="container max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between gap-4">
            {/* Level & XP Progress */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <UIBadge variant="[#fef4ec]" className="text-xs font-mono">
                  LVL {data.level}
                </UIBadge>

                {/* Streak Flame */}
                <Popover>
                  <PopoverTrigger asChild>
                    <motion.button
                      className={`flex items-center gap-1 ${streakIntensity.color} hover:opacity-80 transition-opacity`}
                      animate={{ scale: streakIntensity.scale }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sparkle className="h-4 w-4" />
                      <span className="text-xs font-medium">
                        {data.streakDays}
                      </span>
                    </motion.button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-3">
                    <div className="text-center">
                      <p className="font-medium text-sm">Study Streak</p>
                      <p className="text-xs text-[#667085] mt-1">
                        Keep it up! Next milestone:{" "}
                        {Math.ceil(data.streakDays / 7) * 7 + 7} days
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* XP Progress Bar */}
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex-1 max-w-xs cursor-pointer">
                    <div className="flex items-center gap-2 text-xs text-[#667085] mb-1">
                      <span className="font-mono">
                        {data.xp.toLocaleString()} XP
                      </span>
                      <span>•</span>
                      <span className="font-mono">{data.xpToNext} to next</span>
                    </div>
                    <div className="h-2 bg-[#f0f2f5] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#ff5c00] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${xpProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      Level {data.level + 1} Perks
                    </h4>
                    <ul className="text-xs text-[#667085] space-y-1">
                      {nextLevelPerks.map((perk, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Dot className="h-3 w-3" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Coins & Actions */}
            <div className="flex items-center gap-2">
              {/* Coin Balance */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 text-xs">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span className="font-mono">
                      {data.coins.toLocaleString()}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-4">
                  <div>
                    <h4 className="font-medium text-sm mb-3">Coin History</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {coinHistory.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-[#667085]">
                            {transaction.description}
                          </span>
                          <span
                            className={
                              transaction.type === "earned"
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {transaction.type === "earned" ? "+" : "-"}
                            {transaction.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t mt-3 pt-3">
                      <p className="text-xs text-[#667085]">
                        Use coins for hints, practice tests, and cosmetic
                        upgrades.
                      </p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Badges Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBadgeGallery(true)}
                className="gap-2"
              >
                <Badge className="h-4 w-4" />
                <span className="text-xs">Badges</span>
              </Button>

              {/* Daily Bonus */}
              {data.dailyBonusAvailable && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowDailyBonus(true)}
                  className="gap-2 animate-pulse"
                >
                  <Gem className="h-4 w-4" />
                  <span className="text-xs">Bonus</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Level Up Modal */}
      <Dialog open={showLevelUp} onOpenChange={setShowLevelUp}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              Level Up!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            {data.animationsEnabled && (
              <motion.div
                className="text-6xl mb-4"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 1, repeat: 2 }}
              >
                🎉
              </motion.div>
            )}

            <h3 className="text-xl font-semibold mb-2">
              You're now Level {data.level + 1}!
            </h3>

            <div className="space-y-2 text-sm text-[#667085]">
              <p>New perks unlocked:</p>
              <ul className="text-left space-y-1">
                {nextLevelPerks.map((perk, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <BadgePlus className="h-4 w-4 text-green-500" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>

            <Button onClick={() => setShowLevelUp(false)} className="mt-6">
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Badge Gallery Modal */}
      <Dialog open={showBadgeGallery} onOpenChange={setShowBadgeGallery}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Badge Gallery</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Filter Buttons */}
            <div className="flex gap-2">
              {(["all", "earned", "locked"] as const).map((filter) => (
                <Button
                  key={filter}
                  variant={badgeFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBadgeFilter(filter)}
                  className="capitalize"
                >
                  {filter}
                </Button>
              ))}
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {filteredBadges.length > 0 ? (
                filteredBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      badge.earned
                        ? getRarityColor(badge.rarity)
                        : "border-gray-200 bg-gray-50 opacity-60"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">
                        {badge.earned ? (
                          <Crown className="h-8 w-8 mx-auto" />
                        ) : (
                          <BadgeX className="h-8 w-8 mx-auto text-gray-400" />
                        )}
                      </div>
                      <h4 className="font-medium text-sm">{badge.name}</h4>
                      <p className="text-xs text-[#667085] mt-1">
                        {badge.description}
                      </p>
                      <UIBadge
                        variant="secondary"
                        className="mt-2 text-xs capitalize"
                      >
                        {badge.rarity}
                      </UIBadge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-[#667085]">
                  {badgeFilter === "earned"
                    ? "No badges earned yet. Complete achievements to unlock badges!"
                    : badgeFilter === "locked"
                    ? "All badges have been earned! Congratulations!"
                    : "No badges available."}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Daily Bonus Spinner Modal */}
      <Dialog open={showDailyBonus} onOpenChange={setShowDailyBonus}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Daily Login Bonus</DialogTitle>
          </DialogHeader>

          <div className="text-center py-6">
            <motion.div
              className="w-32 h-32 mx-auto mb-6 border-4 border-[#ff5c00] rounded-full flex items-center justify-center relative overflow-hidden"
              animate={isSpinning ? { rotate: 360 } : {}}
              transition={isSpinning ? { duration: 2, ease: "easeOut" } : {}}
            >
              {/* Spinner segments */}
              <div className="absolute inset-0">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-full h-full ${
                      i % 2 === 0 ? "bg-[#ff5c00]/10" : "bg-[#fef4ec]/50"
                    }`}
                    style={{
                      transform: `rotate(${i * 51.4}deg)`,
                      clipPath: "polygon(50% 50%, 50% 0%, 100% 0%)",
                    }}
                  />
                ))}
              </div>

              {/* Center content */}
              <div className="relative z-10">
                {isSpinning ? (
                  <Gauge className="h-8 w-8" />
                ) : spinResult ? (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#ff5c00]">
                      +{spinResult.amount}
                    </div>
                    <div className="text-xs uppercase font-medium">
                      {spinResult.type}
                    </div>
                  </div>
                ) : (
                  <Gem className="h-8 w-8 text-[#ff5c00]" />
                )}
              </div>
            </motion.div>

            {!spinResult && (
              <Button
                onClick={handleSpin}
                disabled={isSpinning || !data.dailyBonusAvailable}
                className="w-full"
              >
                {isSpinning ? "Spinning..." : "Spin for Reward!"}
              </Button>
            )}

            {spinResult && (
              <Button
                onClick={() => {
                  setShowDailyBonus(false);
                  setSpinResult(null);
                }}
                className="w-full"
              >
                Claim Reward
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Toggle for Animations */}
      <div className="fixed bottom-4 right-4 z-40">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <CirclePercent className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Animations</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setData((prev) => ({
                      ...prev,
                      animationsEnabled: !prev.animationsEnabled,
                    }))
                  }
                >
                  {data.animationsEnabled ? "On" : "Off"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Do Not Disturb</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDoNotDisturb(!doNotDisturb)}
                >
                  {doNotDisturb ? "On" : "Off"}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
