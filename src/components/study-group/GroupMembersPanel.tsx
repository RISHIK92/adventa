"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  UserPlus,
  Users2,
  Crown,
  Shield,
  MessageCircle,
  Trash2,
  VolumeX,
  Award,
  Zap,
  Target,
  Brain,
  Copy,
  Heart,
  X,
  QrCode as Qrcode,
  Check,
  TrendingUp,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import QrCode from "react-qr-code";
import { toast } from "sonner";
import {
  apiService,
  ApiMember,
  InviteMemberPayload,
} from "@/services/weaknessApi";

interface Member extends ApiMember {}

interface StudyMatch {
  id: string;
  member1: Member;
  member2: Member;
  sharedSubject: string;
  compatibility: number;
  status: "pending" | "accepted" | "declined";
}

interface GroupMembersPanelProps {
  className?: string;
  studyRoomId: string;
  currentUserId?: string;
  studyLink?: string;
}

const badgeConfig = {
  "fastest-in-group": {
    icon: Zap,
    label: "Fastest in Group",
    color: "bg-yellow-100 text-yellow-800",
  },
  "consistency-king": {
    icon: Target,
    label: "Consistency King",
    color: "bg-blue-100 text-blue-800",
  },
  "problem-solver": {
    icon: Brain,
    label: "Problem Solver",
    color: "bg-green-100 text-green-800",
  },
};

export const GroupMembersPanel: React.FC<GroupMembersPanelProps> = ({
  className,
  studyRoomId,
  currentUserId,
  studyLink,
}) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);

  const [actionLoading, setActionLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [studyMatches, setStudyMatches] = useState<StudyMatch[]>([]);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteData, setInviteData] = useState<{
    link: string | null;
    expiry: string | null;
  }>({
    link: null,
    expiry: null,
  });
  const [inviteLoading, setInviteLoading] = useState(false);

  useEffect(() => {
    if (!studyRoomId) {
      setLoading(false);
      setError("Study Room ID is missing.");
      return;
    }

    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedMembers = await apiService.getGroupMembers(studyRoomId);
        setMembers(fetchedMembers);
      } catch (err: any) {
        setError(err.message || "Failed to load group members.");
        toast.error(err.message || "Failed to load group members.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const currentUser = useMemo(
    () => members.find((m) => m.id === currentUserId),
    [members, currentUserId]
  );

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const safeSearchQuery = searchQuery.toLowerCase();

      const matchesSearch =
        (member.name || "").toLowerCase().includes(safeSearchQuery) ||
        (member.email || "").toLowerCase().includes(safeSearchQuery);

      const matchesSubject =
        filterSubject === "all" ||
        member.subjects.some((s) => s.name === filterSubject);

      return matchesSearch && matchesSubject;
    });
  }, [members, searchQuery, filterSubject]);

  const allSubjects = useMemo(() => {
    const subjects = new Set<string>();
    members.forEach((member) => {
      member.subjects.forEach((subject) => subjects.add(subject.name));
    });
    return Array.from(subjects);
  }, [members]);

  const generateStudyMatches = () => {
    const matches: StudyMatch[] = [];

    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        const member1 = members[i];
        const member2 = members[j];

        // Find complementary subjects
        for (const subject1 of member1.subjects) {
          const subject2 = member2.subjects.find(
            (s) => s.name === subject1.name
          );
          if (subject2) {
            const strengthDiff = Math.abs(
              subject1.strength - subject2.strength
            );
            const weaknessDiff = Math.abs(
              subject1.weakness - subject2.weakness
            );

            if (strengthDiff > 20 && weaknessDiff > 20) {
              matches.push({
                id: `${member1.id}-${member2.id}-${subject1.name}`,
                member1,
                member2,
                sharedSubject: subject1.name,
                compatibility: Math.min(strengthDiff, weaknessDiff),
                status: "pending",
              });
            }
          }
        }
      }
    }

    setStudyMatches(matches.slice(0, 3)); // Limit to 3 matches
    toast.success(`Found ${matches.length} potential study matches!`);
  };

  const handleSendInvites = async () => {
    if (!inviteEmail.trim()) {
      return toast.error("Please enter a valid email address.");
    }
    setActionLoading(true);
    try {
      const payload: InviteMemberPayload = { email: inviteEmail.trim() };
      await apiService.inviteMember(studyRoomId, payload);
      toast.success(`Invitation sent to ${inviteEmail}!`);
      setInviteEmail("");
      setShowInviteDialog(false);
    } catch (error: any) {
      toast.error("Failed to send invite", { description: error.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRoleChange = async (
    memberId: string,
    currentRole: "admin" | "member"
  ) => {
    const newRole = currentRole === "admin" ? "member" : "admin";
    const originalMembers = members;
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );

    try {
      if (newRole === "admin") {
        await apiService.promoteToAdmin(studyRoomId, {
          memberIdToPromote: memberId,
        });
        toast.success("Member promoted to Admin.");
      } else {
        await apiService.demoteAdmin(studyRoomId, memberId);
        toast.success("Admin has been demoted to a Member.");
      }
    } catch (error: any) {
      toast.error(`Failed to change role`, { description: error.message });
      setMembers(originalMembers);
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to remove ${memberName} from the group?`
      )
    )
      return;

    const originalMembers = members;
    setMembers((prev) => prev.filter((m) => m.id !== memberId)); // Optimistic update

    try {
      await apiService.removeMember(studyRoomId, memberId);
      toast.success(`${memberName} has been removed from the group.`);
    } catch (error: any) {
      toast.error(`Failed to remove member`, { description: error.message });
      setMembers(originalMembers); // Revert UI on error
    }
  };

  const handleBadgeToggle = (memberId: string, badge: string) => {
    setMembers((prev) =>
      prev.map((member) => {
        if (member.id === memberId) {
          const hasBadge = member.badges.includes(badge);
          return {
            ...member,
            badges: hasBadge
              ? member.badges.filter((b) => b !== badge)
              : [...member.badges, badge],
          };
        }
        return member;
      })
    );
    toast.success("Badge updated");
  };

  const handleMatchResponse = (
    matchId: string,
    status: "accepted" | "declined"
  ) => {
    setStudyMatches((prev) =>
      prev.map((match) => (match.id === matchId ? { ...match, status } : match))
    );
    toast.success(
      status === "accepted" ? "Study match accepted!" : "Study match declined"
    );
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(studyLink || "");
    toast.success("Invite link copied to clipboard");
  };

  if (loading) {
    return (
      <div className={`bg-card rounded-lg border p-6 ${className}`}>
        Loading members...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-card rounded-lg border p-6 text-red-500 ${className}`}
      >
        {error}
      </div>
    );
  }

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className={`bg-card rounded-lg border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[#1c1f24]">
            Group Members
          </h2>
          <p className="text-sm text-[#7d7e80]">
            {members.length} members total
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Invite Members</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="single" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="single">Link</TabsTrigger>
                  <TabsTrigger value="bulk">Email</TabsTrigger>
                  <TabsTrigger value="qr">QR Code</TabsTrigger>
                </TabsList>
                <TabsContent value="single" className="space-y-4">
                  <div className="flex gap-2">
                    <Input placeholder={studyLink} readOnly />
                    <Button onClick={copyInviteLink} size="sm">
                      <Copy className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="bulk" className="space-y-4">
                  <textarea
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full h-12 p-3 border rounded-md resize-none"
                  />
                  <Button onClick={handleSendInvites} className="w-full">
                    Send Invites
                  </Button>
                </TabsContent>
                <TabsContent value="qr" className="space-y-4">
                  <div className="flex flex-col items-center p-8">
                    {studyLink ? (
                      <QrCode value={studyLink} size={128} />
                    ) : (
                      <div className="w-32 h-32 bg-[#f7f7f7] rounded-lg flex items-center justify-center mb-4">
                        <Qrcode className="w-16 h-16 text-[#7d7e80]" />
                      </div>
                    )}
                    <p className="text-sm text-[#7d7e80] text-center mt-4">
                      Scan this QR code to join the group
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#7d7e80]" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 bg-white">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Subject</label>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md text-sm"
                >
                  <option value="all">All Subjects</option>
                  {allSubjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Members List */}
      <div className="space-y-3">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="border rounded-lg p-4 hover:bg-[#f7f7f7]/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>
                      {member.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {/* {member.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#fdfcff]" />
                  )} */}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-[#1c1f24]">
                      {member.name}
                    </h4>
                    {member.role === "admin" && (
                      <Badge variant="secondary" className="text-xs">
                        <Crown className="w-3 h-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-[#7d7e80] mb-2">{member.email}</p>

                  {/* Subject Strengths */}
                  <div className="space-y-1 mb-3">
                    {member.subjects.map((subject) => (
                      <div
                        key={subject.name}
                        className="flex items-center gap-2"
                      >
                        <span className="text-xs font-semibold w-20">
                          {subject.name}
                        </span>
                        <div className="flex-1 flex gap-1 mt-1">
                          <Progress
                            value={subject.strength}
                            className="h-2 flex-1"
                          />
                          <span className="text-xs text-[#7d7e80] w-8">
                            {subject.strength}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Badges */}
                  <div className="flex gap-1 flex-wrap">
                    {member.badges.map((badge) => {
                      const config =
                        badgeConfig[badge as keyof typeof badgeConfig];
                      const Icon = config.icon;
                      return (
                        <Badge
                          key={badge}
                          variant="secondary"
                          className={`text-xs ${config.color}`}
                        >
                          <Icon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMember(member)}
                >
                  <TrendingUp className="w-4 h-4" />
                </Button>

                {currentUser.role === "admin" &&
                  member.id !== currentUser.id && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 bg-white">
                        <div className="space-y-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start hover:bg-gray-200"
                            onClick={() =>
                              handleRoleChange(member.id, member.role)
                            }
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            {member.role === "admin"
                              ? "Remove Admin"
                              : "Make Admin"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-red-500 hover:bg-gray-200"
                            onClick={() =>
                              handleRemoveMember(member.id, member.name)
                            }
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Member Analytics Dialog */}
      <Dialog
        open={!!selectedMember}
        onOpenChange={() => setSelectedMember(null)}
      >
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Member Analytics</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedMember.avatar} />
                  <AvatarFallback>
                    {selectedMember.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedMember.name}
                  </h3>
                  <p className="text-[#7d7e80]">{selectedMember.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#fe7244]">
                    {selectedMember.stats.streak}
                  </div>
                  <div className="text-sm text-[#7d7e80]">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#fe7244]">
                    {selectedMember.stats.averageScore}%
                  </div>
                  <div className="text-sm text-[#7d7e80]">Avg Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#fe7244]">
                    {selectedMember.stats.totalPoints}
                  </div>
                  <div className="text-sm text-[#7d7e80]">Total Points</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Subject Performance</h4>
                {selectedMember.subjects.map((subject) => (
                  <div key={subject.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{subject.name}</span>
                      <span>{subject.strength}%</span>
                    </div>
                    <Progress value={subject.strength} className="h-2" />
                  </div>
                ))}
              </div>

              {selectedMember.id !== currentUser.id && (
                <Button className="w-full hover:cursor-pointer">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Compare with Me
                </Button>
              )}

              {currentUser.role === "admin" && (
                <div className="space-y-2">
                  <h4 className="font-medium">Manage Badges</h4>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(badgeConfig).map(([badge, config]) => {
                      const Icon = config.icon;
                      const hasBadge = selectedMember.badges.includes(badge);
                      return (
                        <Button
                          key={badge}
                          variant={hasBadge ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            handleBadgeToggle(selectedMember.id, badge)
                          }
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {config.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
