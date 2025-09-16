"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Users,
  Settings,
  Trash2,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  Link2,
  UserPlus,
  Loader,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// Import your service and types
import {
  apiService as groupApiService,
  CreateGroupPayload,
} from "@/services/weaknessApi";

// --- TYPE DEFINITIONS ---
interface Member {
  id: string;
  name: string | null;
  avatar?: string;
}

interface Group {
  id: string;
  name: string;
  privacy: "PUBLIC" | "PRIVATE" | "INVITE_ONLY";
  memberCount: number;
  members: Member[]; // Assuming parent component maps this from sampleMembers
  isAdmin: boolean;
  inviteLink?: string | null;
}

interface GroupHeroProps {
  group?: Group;
  // Callback to notify the parent page that it needs to refetch data
  onGroupUpdate: () => void;
  className?: string;
}

// --- HELPER FUNCTION ---
const getInitials = (name: string | null = "") => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

// --- THE COMPONENT ---
export const GroupHero = ({
  group,
  onGroupUpdate,
  className = "",
}: GroupHeroProps) => {
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const [createForm, setCreateForm] = useState<
    Omit<CreateGroupPayload, "examIds" | "subjectIds">
  >({
    name: "",
    description: "",
    privacy: "PUBLIC",
  });

  const [currentPrivacy, setCurrentPrivacy] = useState(
    group?.privacy || "PUBLIC"
  );
  const [currentInviteLink, setCurrentInviteLink] = useState(group?.inviteLink);
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Update local state when the group prop changes
  useEffect(() => {
    setCurrentPrivacy(group?.privacy || "PUBLIC");
    setCurrentInviteLink(group?.inviteLink);
  }, [group]);

  const handleCreateGroup = async () => {
    if (!createForm.name.trim()) {
      return toast.error("Group name is required.");
    }
    setLoading(true);
    try {
      // In a real app, these IDs would come from a multi-select component
      const payload: CreateGroupPayload = {
        ...createForm,
        examIds: [1], // Placeholder
        subjectIds: [1, 2], // Placeholder
      };
      await groupApiService.createGroup(payload);
      toast.success(`Group "${createForm.name}" created successfully!`);
      onGroupUpdate(); // Tell the parent page to refetch data
      setCreateDialogOpen(false);
      setCreateForm({ name: "", description: "", privacy: "PUBLIC" });
    } catch (error: any) {
      toast.error("Failed to create group", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!joinCode.trim()) {
      return toast.error("An invite code is required.");
    }
    setLoading(true);
    try {
      await groupApiService.joinGroupByLink(joinCode.trim());
      toast.success("Successfully joined the group!");
      onGroupUpdate(); // Tell the parent page to refetch
      setJoinDialogOpen(false);
      setJoinCode("");
    } catch (error: any) {
      toast.error("Failed to join group", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePrivacy = async () => {
    if (!group) return;
    setLoading(true);
    try {
      await groupApiService.updateGroupPrivacy(group.id, {
        privacy: currentPrivacy,
      });
      toast.success("Group privacy updated successfully.");
      onGroupUpdate();
      setSettingsDialogOpen(false);
    } catch (error: any) {
      toast.error("Failed to update privacy", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!group) return;
    setLoading(true);
    try {
      await groupApiService.deleteGroup(group.id);
      toast.success(`Group "${group.name}" has been deleted.`);
      onGroupUpdate();
      router.push("/study-groups");
    } catch (error: any) {
      toast.error("Failed to delete group", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateInvite = async () => {
    if (!group) return;
    setLoading(true);
    try {
      const response = await groupApiService.generateInviteLink(group.id);
      setCurrentInviteLink(response.inviteLink); // Update the state with the new link
      toast.success("New invite link generated!");
    } catch (error: any) {
      toast.error("Failed to regenerate invite link", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // --- UTILITY HANDLERS ---
  const handleCopyInvite = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // --- SUB-COMPONENTS ---
  const MemberAvatars = ({ members }: { members: Member[] }) => (
    <div className="flex -space-x-2">
      {members.slice(0, 6).map((member) => (
        <Avatar key={member.id} className="w-8 h-8 border-2 border-white">
          <AvatarImage src={member.avatar} alt={member.name || "Member"} />
          <AvatarFallback className="text-xs font-medium">
            {getInitials(member.name)}
          </AvatarFallback>
        </Avatar>
      ))}
      {members.length > 6 && (
        <Avatar className="w-8 h-8 border-2 border-white">
          <AvatarFallback className="text-xs font-medium bg-gray-200">
            +{members.length - 6}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );

  if (!group) {
    return (
      <div className={`bg-gray-100 rounded-lg border p-6 ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Welcome to Study Groups</h1>
            <p className="text-muted-foreground">
              Create or join a group to collaborate with your peers.
            </p>
          </div>
          <div className="flex gap-3">
            {/* Create Group Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Study Group</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="group-name">Group Name</Label>
                    <Input
                      id="group-name"
                      value={createForm.name}
                      onChange={(e) =>
                        setCreateForm((p) => ({ ...p, name: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="privacy">Privacy</Label>
                    <Select
                      value={createForm.privacy}
                      onValueChange={(
                        v: "PUBLIC" | "PRIVATE" | "INVITE_ONLY"
                      ) => setCreateForm((p) => ({ ...p, privacy: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PUBLIC">
                          Public - Anyone can join
                        </SelectItem>
                        <SelectItem value="PRIVATE">
                          Private - Join by invite only
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateGroup} disabled={loading}>
                    {loading ? <Loader className="animate-spin" /> : "Create"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Join Group Dialog */}
            <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join a Study Group</DialogTitle>
                </DialogHeader>
                <div>
                  <Label htmlFor="join-code">Invite Code</Label>
                  <Input
                    id="join-code"
                    placeholder="Paste invite code here..."
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setJoinDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleJoinGroup} disabled={loading}>
                    {loading ? <Loader className="animate-spin" /> : "Join"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: Main view when group data is loaded
  return (
    <TooltipProvider>
      <div className={`bg-white rounded-lg border p-6 ${className}`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold">{group.name}</h1>
              <Badge
                variant={group.privacy === "PUBLIC" ? "secondary" : "default"}
              >
                {group.privacy === "PUBLIC" ? (
                  <Eye className="w-3 h-3 mr-1" />
                ) : (
                  <EyeOff className="w-3 h-3 mr-1" />
                )}
                {group.privacy}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-sm">{group.memberCount} members</span>
              </div>
              <MemberAvatars members={group.members} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Invite Dialog - Only show for admins */}
            {group.isAdmin && (
              <Dialog
                open={inviteDialogOpen}
                onOpenChange={setInviteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Members</DialogTitle>
                  </DialogHeader>
                  {currentInviteLink ? (
                    <div className="space-y-4">
                      <Label>Shareable Invite Link</Label>
                      <div className="flex items-center gap-2">
                        <Input value={currentInviteLink} readOnly />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopyInvite(currentInviteLink)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRegenerateInvite}
                        disabled={loading}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Regenerate Link
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={handleRegenerateInvite} disabled={loading}>
                      Generate Invite Link
                    </Button>
                  )}
                  <DialogFooter>
                    <Button onClick={() => setInviteDialogOpen(false)}>
                      Done
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {/* Admin-only buttons */}
            {group.isAdmin && (
              <>
                {/* Settings Dialog */}
                <Dialog
                  open={settingsDialogOpen}
                  onOpenChange={setSettingsDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Group Settings</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <Label>Privacy</Label>
                      <Select
                        value={currentPrivacy}
                        onValueChange={(
                          v: "PUBLIC" | "PRIVATE" | "INVITE_ONLY"
                        ) => setCurrentPrivacy(v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PUBLIC">Public</SelectItem>
                          <SelectItem value="PRIVATE">Private</SelectItem>
                          <SelectItem value="INVITE_ONLY">
                            Invite Only
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setSettingsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleUpdatePrivacy} disabled={loading}>
                        {loading ? (
                          <Loader className="animate-spin" />
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Delete Dialog */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to delete this group?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. All data will be
                        permanently lost.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={handleDeleteGroup}
                      >
                        Delete Group
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
