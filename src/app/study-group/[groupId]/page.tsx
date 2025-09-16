"use client";

import { GroupHero } from "@/components/study-group/GroupHero";
import { GroupMembersPanel } from "@/components/study-group/GroupMembersPanel";
import { GroupMockScheduler } from "@/components/study-group/GroupMockScheduler";
import { LiveTestRoom } from "@/components/study-group/LiveTestRoom";
import { LiveLeaderboard } from "@/components/study-group/LiveLeaderboard";
import PostTestResults from "@/components/study-group/PostTestResults";
import MistakeBankAndRevision from "@/components/study-group/MistakeBankAndRevision";
import ChallengesAndPrediction from "@/components/study-group/ChallengesAndPrediction";
import DiscussionBoard from "@/components/study-group/DiscussionBoard";
import AIInsightsAndBadges from "@/components/study-group/AIInsightsAndBadges";
import { useParams } from "next/navigation";
import { getAuth } from "firebase/auth";
import { apiService, GroupDetails } from "@/services/weaknessApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function StudyGroup() {
  const params = useParams();
  const groupId = params.groupId as string;

  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  const [groupDetails, setGroupDetails] = useState<GroupDetails>({
    name: "",
    privacy: "PUBLIC",
    memberCount: 0,
    sampleMembers: [],
    yourRole: "MEMBER",
    inviteLink: "",
    inviteLinkExpiry: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) {
      setError("Group ID is missing from the URL.");
      setLoading(false);
      return;
    }

    const fetchGroupData = async () => {
      try {
        setLoading(true);
        // Call the apiService to get details for this specific group
        const data = await apiService.getGroupDetails(groupId);
        setGroupDetails(data);
        setError(null); // Clear any previous errors on success
      } catch (err: any) {
        console.error("Failed to fetch group details:", err);
        setError(
          err.message || "Could not load group data. You may not be a member."
        );
        toast.error("Failed to load group", { description: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky top action bar */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <GroupHero
            className="bg-transparent border-0 p-0"
            // The `group` prop is now built from our fetched state
            group={{
              id: groupId,
              name: groupDetails.name,
              privacy: groupDetails.privacy as "PUBLIC" | "PRIVATE",
              memberCount: groupDetails.memberCount,
              members: groupDetails.sampleMembers.map((name, index) => ({
                id: `${index}`,
                name: name || "A member",
              })),
              isAdmin: groupDetails.yourRole === "ADMIN",
              inviteLink: groupDetails.inviteLink,
            }}
            isAdmin={groupDetails.yourRole === "ADMIN"}
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Two-column responsive layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column - Group controls and activity */}
          <div className="lg:col-span-2 space-y-6">
            <GroupMembersPanel
              className="bg-white rounded-lg border"
              studyLink={groupDetails.inviteLink}
              studyRoomId={groupId}
              currentUserId={uid}
            />
            <GroupMockScheduler studyRoomId={groupId} />
            <ChallengesAndPrediction studyRoomId={groupId} />
            <DiscussionBoard
              className="bg-white rounded-lg border"
              studyRoomId={groupId}
            />
          </div>

          {/* Right column - Live and test-driven features */}
          <div className="space-y-6">
            <LiveLeaderboard
              variant="compact"
              className="bg-white rounded-lg border"
              studyRoomId={groupId}
              currentUserId={uid}
            />
            <AIInsightsAndBadges />
          </div>
        </div>
      </div>
    </div>
  );
}
