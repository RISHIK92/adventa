"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  Plus,
  Users,
  Globe,
  Lock,
  Star,
  TrendingUp,
  User,
  Settings,
  Mail,
  Check,
  X,
  Filter,
  Award,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import { apiService } from "@/services/weaknessApi";
import { CreateGroupPayload } from "@/services/weaknessApi";
import { ConfirmationModal } from "@/components/study-group/LeaveConfirmPopUp";
import { useRouter } from "next/navigation";

// --- INTERFACES & TYPES ---

interface Group {
  id: string;
  name: string;
  description?: string | null;
  privacy: "PUBLIC" | "PRIVATE" | "INVITE_ONLY";
  memberCount: number;
  subjects: string[];
  isOwner?: boolean;
  isMember?: boolean;
  activity: "high" | "medium" | "low";
  lastActivityAt?: string | null;
}

interface Invitation {
  id: string;
  studyRoom: {
    id: string;
    name: string;
  };
  inviter: {
    id: string;
    fullName: string;
  };
  createdAt: string;
}

interface Stat {
  groupsJoined: number;
  groupsOwned: number;
  totalMemberReach: number;
  reviewsCount: number;
}

interface Exam {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  name: string;
}

type MyGroupsPanelProps = {
  myGroups: Group[];
  loading: boolean;
  error: string | null;
  onUpdate: () => void;
};

type SettingsMenuProps = {
  onDelete: () => void;
};

type CreateGroupFormProps = {
  onGroupCreated: () => void;
};

type GroupInvitationsProps = {
  onUpdate: () => void;
};

type PublicGroupsBrowserProps = {
  myGroupIds: Set<string>;
  onUpdate: () => void;
};

type GroupQuickStatsProps = {
  stats: Stat | null;
  loading: boolean;
};

type RecommendedGroupsProps = {
  myGroupIds: Set<string>;
  onUpdate: () => void;
};

// --- COMPONENTS ---

const SettingsMenu: React.FC<SettingsMenuProps> = ({ onDelete }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Settings className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10">
          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

const MyGroupsPanel: React.FC<MyGroupsPanelProps> = ({
  myGroups,
  loading,
  error,
  onUpdate,
}) => {
  const [isLeaving, setIsLeaving] = useState(false);
  const [leavingGroupId, setLeavingGroupId] = useState<string | null>(null);
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [groupToLeave, setGroupToLeave] = useState<Group | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);

  const router = useRouter();

  const openLeaveModal = (group: Group) => {
    setGroupToLeave(group);
    setIsLeaveModalOpen(true);
  };

  const closeLeaveModal = () => {
    setGroupToLeave(null);
    setIsLeaveModalOpen(false);
  };

  const openDeleteModal = (group: Group) => {
    setGroupToDelete(group);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setGroupToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteGroup = async () => {
    if (!groupToDelete) return;

    setDeletingGroupId(groupToDelete.id);
    try {
      await apiService.deleteGroup(groupToDelete.id);
      onUpdate();
      closeDeleteModal();
    } catch (err: any) {
      console.error("Failed to delete group:", err);
      alert(`Error: ${err.message || "Unknown error"}`);
    } finally {
      setDeletingGroupId(null);
    }
  };

  const handleLeaveGroup = async () => {
    if (!groupToLeave) {
      return;
    }

    setLeavingGroupId(groupToLeave.id);
    try {
      setIsLeaving(true);
      await apiService.leaveGroup(groupToLeave.id);
      onUpdate();
      closeLeaveModal();
    } catch (err: any) {
      console.error("Failed to leave group:", err);
      setIsLeaving(false);
      alert(`Error: ${err.message || "Unknown error"}`);
    } finally {
      // Always reset the loading state
      setLeavingGroupId(null);
      setIsLeaving(false);
    }
  };

  const getSubjectColor = (subject: string): string => {
    const colors: Record<string, string> = {
      Mathematics: "bg-blue-100 text-blue-700 border-blue-200",
      Physics: "bg-purple-100 text-purple-700 border-purple-200",
      Chemistry: "bg-green-100 text-green-700 border-green-200",
      Biology: "bg-teal-100 text-teal-700 border-teal-200",
    };
    return colors[subject] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getActivityIndicator = (activity: Group["activity"]): string => {
    const indicators: Record<Group["activity"], string> = {
      high: "bg-green-500",
      medium: "bg-yellow-500",
      low: "bg-gray-400",
    };
    return indicators[activity];
  };

  const getPrivacyIcon = (privacy: Group["privacy"]): React.ReactNode => {
    switch (privacy) {
      case "PUBLIC":
        return <Globe className="w-4 h-4" />;
      case "PRIVATE":
        return <Lock className="w-4 h-4" />;
      case "INVITE_ONLY":
        return <Mail className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 bg-red-50 p-4 rounded-lg">
        <AlertCircle className="inline w-4 h-4 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">My Groups</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>{myGroups.length} groups</span>
          </div>
        </div>
        <div className="space-y-4">
          {myGroups.length === 0 && !loading && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                You haven't joined any groups yet.
              </p>
            </div>
          )}
          {myGroups.map((group) => (
            <div
              key={group.id}
              className="group border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-orange-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                      {group.name}
                    </h3>
                    <div
                      className="flex items-center gap-1 text-gray-400"
                      title={group.privacy}
                    >
                      {getPrivacyIcon(group.privacy)}
                    </div>
                    {group.isOwner && (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                        Owner
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {group.description}
                  </p>
                  <div className="flex items-center flex-wrap gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{group.memberCount} members</span>
                    </div>
                    {group.subjects.slice(0, 2).map((subject) => (
                      <span
                        key={subject}
                        className={`px-2 py-0.5 rounded-full border text-xs ${getSubjectColor(
                          subject
                        )}`}
                      >
                        {subject}
                      </span>
                    ))}
                    {group.subjects.length > 2 && (
                      <span className="text-xs text-gray-400">
                        +{group.subjects.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${getActivityIndicator(
                        group.activity
                      )}`}
                      title={`${
                        group.activity.charAt(0).toUpperCase() +
                        group.activity.slice(1)
                      } activity`}
                    ></div>
                    {deletingGroupId === group.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    ) : (
                      group.isOwner && (
                        <SettingsMenu onDelete={() => openDeleteModal(group)} />
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-3">
                <span className="text-xs text-gray-500">
                  Last activity:{" "}
                  {group.lastActivityAt
                    ? new Date(group.lastActivityAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1.5 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors font-medium"
                    onClick={() => router.push(`/study-group/${group.id}`)}
                  >
                    View
                  </button>
                  {!group.isOwner && (
                    <button
                      onClick={() => openLeaveModal(group)} // FIX: Call openLeaveModal with the group
                      className="px-3 py-1.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Leave
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ConfirmationModal
        isOpen={isLeaveModalOpen}
        onClose={closeLeaveModal}
        onConfirm={handleLeaveGroup}
        title="Confirm Leave Group"
        confirmText="Leave"
        confirmButtonClass="bg-red-600 hover:bg-red-700 focus:ring-red-500"
        isConfirming={isLeaving}
      >
        Are you sure you want to leave the group "{groupToLeave?.name}"? You
        will lose access to its content and members.
      </ConfirmationModal>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteGroup}
        title="Permanently Delete Group"
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700 focus:ring-red-500"
        isConfirming={deletingGroupId !== null}
      >
        Are you sure you want to permanently delete the group "
        {groupToDelete?.name}"? This action is irreversible and all group data
        will be lost.
      </ConfirmationModal>
      ;
    </>
  );
};

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({
  onGroupCreated,
}) => {
  const initialFormData: CreateGroupPayload = {
    name: "",
    description: "",
    privacy: "PUBLIC",
    subjectIds: [],
    examIds: [],
  };
  const [formData, setFormData] = useState<CreateGroupPayload>(initialFormData);
  const [isExpanded, setIsExpanded] = useState(false);
  const [allExams, setAllExams] = useState<Exam[]>([]);
  const [subjectsForSelectedExam, setSubjectsForSelectedExam] = useState<
    Subject[]
  >([]);
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isExpanded) {
      const staticExams: Exam[] = [
        { id: 1, name: "JEE Main & Engineering Exams" },
        { id: 2, name: "NEET & Medical Exams" },
        { id: 3, name: "Others" },
      ];
      setAllExams(staticExams);
    }
  }, [isExpanded]);

  useEffect(() => {
    if (!selectedExamId) {
      setSubjectsForSelectedExam([]);
      setSelectedSubjectIds([]);
      return;
    }
    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      try {
        const subjects = await apiService.getSubjectsWithTopicsByExam(
          Number(selectedExamId)
        );
        setSubjectsForSelectedExam(subjects);
        setSelectedSubjectIds([]);
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
        setSubjectsForSelectedExam([]);
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, [selectedExamId]);

  const handleSubjectSelection = (subjectId: number) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      privacy: e.target.value as "PUBLIC" | "PRIVATE" | "INVITE_ONLY",
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedExamId("");
    setSelectedSubjectIds([]);
    setError(null);
    setSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedSubjectIds.length === 0) {
      setError("Please select at least one subject.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload: CreateGroupPayload = {
        ...formData,
        examIds: selectedExamId ? [Number(selectedExamId)] : [],
        subjectIds: selectedSubjectIds,
      };
      await apiService.createGroup(payload);
      setIsExpanded(false);
      resetForm();
      onGroupCreated();
    } catch (err: any) {
      setError(err.message || "Failed to create group.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Create New Group
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Plus
            className={`w-5 h-5 transition-transform ${
              isExpanded ? "rotate-45" : ""
            }`}
          />
        </button>
      </div>
      {isExpanded && (
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {error && (
            <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">
              <AlertCircle className="inline w-4 h-4 mr-2" />
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="e.g., Physics Olympiad Prep"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
              rows={3}
              placeholder="Describe your group's purpose and goals"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Exam
            </label>
            <select
              value={selectedExamId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSelectedExamId(e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              required
            >
              <option value="">-- Select an Exam --</option>
              {allExams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subjects
            </label>
            <div className="p-3 border border-gray-200 rounded-lg min-h-[60px]">
              {loadingSubjects ? (
                <div className="flex items-center text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading subjects...
                </div>
              ) : subjectsForSelectedExam.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {subjectsForSelectedExam.map((subject) => (
                    <button
                      type="button"
                      key={subject.id}
                      onClick={() => handleSubjectSelection(subject.id)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                        selectedSubjectIds.includes(subject.id)
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                      }`}
                    >
                      {subject.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  {selectedExamId
                    ? "No subjects found for this exam."
                    : "Select an exam to see its subjects."}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Privacy Settings
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                <input
                  type="radio"
                  name="privacy"
                  value="PUBLIC"
                  checked={formData.privacy === "PUBLIC"}
                  onChange={handlePrivacyChange}
                  className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                />
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900">Public</div>
                    <div className="text-xs text-gray-500">
                      Anyone can find and join
                    </div>
                  </div>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                <input
                  type="radio"
                  name="privacy"
                  value="PRIVATE"
                  checked={formData.privacy === "PRIVATE"}
                  onChange={handlePrivacyChange}
                  className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                />
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Private</div>
                    <div className="text-xs text-gray-500">
                      Only members can see content
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>
          <div className="flex items-center justify-end pt-4 border-t border-gray-200 gap-3">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Create Group"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const GroupInvitations: React.FC<GroupInvitationsProps> = ({ onUpdate }) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchInvitations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getGroupInvitations();
      setInvitations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const handleInvitation = async (
    invitationId: string,
    action: "accept" | "decline"
  ) => {
    setProcessingId(invitationId);
    try {
      await apiService.respondToInvitation(invitationId, action);
      if (action === "accept") {
        onUpdate();
      }
      setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
    } catch (err) {
      console.error("Failed to respond to invitation:", err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-center items-center h-20">
          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Group Invitations
        </h2>
        {invitations.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">
              {invitations.length} pending
            </span>
          </div>
        )}
      </div>

      {invitations.length === 0 ? (
        <div className="text-center py-8">
          <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No pending invitations</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    {invitation.studyRoom.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Invited by{" "}
                    <span className="font-medium">
                      {invitation.inviter.fullName}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(invitation.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleInvitation(invitation.id, "accept")}
                  disabled={!!processingId}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors disabled:bg-green-300"
                >
                  {processingId === invitation.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Accept
                </button>
                <button
                  onClick={() => handleInvitation(invitation.id, "decline")}
                  disabled={!!processingId}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-lg transition-colors disabled:bg-gray-100"
                >
                  {processingId === invitation.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PublicGroupsBrowser: React.FC<PublicGroupsBrowserProps> = ({
  myGroupIds,
  onUpdate,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [allPublicGroups, setAllPublicGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjectsForFilter, setSubjectsForFilter] = useState<string[]>(["All"]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [joiningGroupId, setJoiningGroupId] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const publicGroupsResponse: any[] = await apiService.getPublicGroups({
          sortBy: "score",
          limit: 20,
        });
        if (!Array.isArray(publicGroupsResponse)) {
          throw new Error("Invalid API response");
        }
        const transformedGroups: Group[] = publicGroupsResponse.map(
          (group) => ({
            ...group,
            subjects: group.subjects.map((s: any) => s.subject.name),
          })
        );
        setAllPublicGroups(transformedGroups);
        const uniqueSubjects = new Set<string>();
        transformedGroups.forEach((group) => {
          group.subjects.forEach((subject) => uniqueSubjects.add(subject));
        });
        setSubjectsForFilter(["All", ...Array.from(uniqueSubjects)]);
      } catch (err) {
        console.error(err);
        setAllPublicGroups([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleJoinGroup = async (groupId: string) => {
    setJoiningGroupId(groupId);
    try {
      await apiService.joinPublicGroup(groupId);
      onUpdate();
    } catch (err: any) {
      console.error("Failed to join group:", err);
      alert(err.message || "Unknown error");
    } finally {
      setJoiningGroupId(null);
    }
  };

  const getSubjectColor = (subject: string): string => {
    const colors: Record<string, string> = {
      Mathematics: "bg-blue-100 text-blue-700 border-blue-200",
      Physics: "bg-purple-100 text-purple-700 border-purple-200",
      Chemistry: "bg-green-100 text-green-700 border-green-200",
      Biology: "bg-teal-100 text-teal-700 border-teal-200",
    };
    return colors[subject] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getActivityIndicator = (activity: Group["activity"]): string => {
    const indicators: Record<Group["activity"], string> = {
      high: "bg-green-500",
      medium: "bg-yellow-500",
      low: "bg-gray-400",
    };
    return indicators[activity];
  };

  const filteredGroups = allPublicGroups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      selectedSubject === "All" || group.subjects.includes(selectedSubject);
    return matchesSearch && matchesSubject;
  });

  const groupsToShow = isExpanded ? filteredGroups : filteredGroups.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Browse Public Groups
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Globe className="w-4 h-4" />
          <span>
            Showing {groupsToShow.length} of {filteredGroups.length}
          </span>
        </div>
      </div>
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search by name or description..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Filter className="w-4 h-4 text-gray-500" />
            Subject:
          </label>
          <select
            value={selectedSubject}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSelectedSubject(e.target.value)
            }
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            {subjectsForFilter.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
          </div>
        ) : groupsToShow.length > 0 ? (
          groupsToShow.map((group) => (
            <div
              key={group.id}
              className="group border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-orange-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                      {group.name}
                    </h3>
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${getActivityIndicator(
                        group.activity
                      )}`}
                      title={`${group.activity} activity`}
                    ></div>
                    {group.activity === "high" && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {group.description}
                  </p>
                  <div className="flex items-center flex-wrap gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{group.memberCount.toLocaleString()} members</span>
                    </div>
                    {group.subjects.slice(0, 2).map((subject) => (
                      <span
                        key={subject}
                        className={`px-2 py-0.5 rounded-full border ${getSubjectColor(
                          subject
                        )}`}
                      >
                        {subject}
                      </span>
                    ))}
                    {group.subjects.length > 2 && (
                      <span className="text-xs text-gray-400">
                        +{group.subjects.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
                {myGroupIds.has(group.id) ? (
                  <span className="ml-4 flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                    <Check className="w-4 h-4" />
                    Joined
                  </span>
                ) : (
                  <button
                    onClick={() => handleJoinGroup(group.id)}
                    disabled={joiningGroupId === group.id}
                    className="ml-4 bg-orange-500 hover:bg-orange-600 text-white px-2 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center justify-center w-[70px] h-[34px]"
                  >
                    {joiningGroupId === group.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Join"
                    )}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="mt-2 text-sm font-semibold text-gray-800">
              No Groups Found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No public groups match your current filters.
            </p>
          </div>
        )}
      </div>
      {!isExpanded && filteredGroups.length > 5 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsExpanded(true)}
            className="px-4 py-2 bg-orange-100 text-orange-700 font-medium rounded-lg hover:bg-orange-200 transition-colors"
          >
            View All {filteredGroups.length} Groups
          </button>
        </div>
      )}
    </div>
  );
};

const GroupQuickStats: React.FC<GroupQuickStatsProps> = ({
  stats,
  loading,
}) => {
  const statItems = stats
    ? [
        {
          title: "Groups Joined",
          value: stats.groupsJoined,
          icon: Users,
          color: "text-blue-600 bg-blue-100",
        },
        {
          title: "Groups Owned",
          value: stats.groupsOwned,
          icon: User,
          color: "text-purple-600 bg-purple-100",
        },
        {
          title: "Member Reach",
          value: stats.totalMemberReach.toLocaleString(),
          icon: TrendingUp,
          color: "text-green-600 bg-green-100",
        },
        {
          title: "Reviews Given",
          value: stats.reviewsCount,
          icon: Award,
          color: "text-yellow-600 bg-yellow-100",
        },
      ]
    : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Stats</h2>
      {loading ? (
        <div className="flex justify-center items-center h-24">
          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
        </div>
      ) : (
        stats && (
          <div className="grid grid-cols-2 gap-4">
            {statItems.map((stat, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between"
              >
                <div>
                  <div className={`p-2 rounded-lg ${stat.color} w-min mb-3`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-1">{stat.title}</div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

const RecommendedGroups: React.FC<RecommendedGroupsProps> = ({
  myGroupIds,
  onUpdate,
}) => {
  const [recommendedGroups, setRecommendedGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningGroupId, setJoiningGroupId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecs = async () => {
      setLoading(true);
      try {
        const data: Group[] = await apiService.getRecommendedGroups();
        setRecommendedGroups(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  const handleJoinGroup = async (groupId: string) => {
    setJoiningGroupId(groupId);
    try {
      await apiService.joinPublicGroup(groupId);
      onUpdate();
    } catch (err: any) {
      console.error("Failed to join group:", err);
      alert(err.message || "Unknown error");
    } finally {
      setJoiningGroupId(null);
    }
  };

  const getSubjectColor = (subject: string): string => {
    const colors: Record<string, string> = {
      Mathematics: "bg-blue-100 text-blue-700 border-blue-200",
      Physics: "bg-purple-100 text-purple-700 border-purple-200",
      Chemistry: "bg-green-100 text-green-700 border-green-200",
      Biology: "bg-teal-100 text-teal-700 border-teal-200",
    };
    return colors[subject] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Star className="w-5 h-5 text-orange-500" />
        <h2 className="text-xl font-semibold text-gray-900">
          Recommended for You
        </h2>
      </div>
      <div className="space-y-4">
        {recommendedGroups.map((group) => (
          <div
            key={group.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-orange-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h3 className="font-medium text-gray-900 mb-1">{group.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {group.description}
                </p>
                <div className="flex items-center flex-wrap gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{group.memberCount} members</span>
                  </div>
                  {group.subjects.slice(0, 2).map((subject) => (
                    <span
                      key={subject}
                      className={`px-2 py-0.5 rounded-full border ${getSubjectColor(
                        subject
                      )}`}
                    >
                      {subject}
                    </span>
                  ))}
                  {group.subjects.length > 2 && (
                    <span className="text-xs text-gray-400">
                      +{group.subjects.length - 2} more
                    </span>
                  )}
                </div>
              </div>
              {myGroupIds.has(group.id) ? (
                <span className="ml-4 flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                  <Check className="w-4 h-4" />
                  Joined
                </span>
              ) : (
                <button
                  onClick={() => handleJoinGroup(group.id)}
                  disabled={joiningGroupId === group.id}
                  className="ml-4 bg-orange-500 hover:bg-orange-600 text-white px-2 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center justify-center w-[70px] h-[34px]"
                >
                  {joiningGroupId === group.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Join"
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function GroupsPage() {
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [loadingMyGroups, setLoadingMyGroups] = useState(true);
  const [errorMyGroups, setErrorMyGroups] = useState<string | null>(null);
  const [stats, setStats] = useState<Stat | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchMyGroups = useCallback(async () => {
    setLoadingMyGroups(true);
    try {
      const data = await apiService.getMyGroups();
      setMyGroups(data);
      setErrorMyGroups(null);
    } catch (err: any) {
      setErrorMyGroups(err.message || "Failed to fetch your groups.");
    } finally {
      setLoadingMyGroups(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const data = await apiService.getQuickStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const handleDataUpdate = useCallback(() => {
    fetchMyGroups();
    fetchStats();
  }, [fetchMyGroups, fetchStats]);

  useEffect(() => {
    handleDataUpdate();
  }, [handleDataUpdate]);

  const myGroupIds = new Set(myGroups.map((g) => g.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>Collaborate and study together</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-8">
            <MyGroupsPanel
              myGroups={myGroups}
              loading={loadingMyGroups}
              error={errorMyGroups}
              onUpdate={handleDataUpdate}
            />
            <CreateGroupForm onGroupCreated={handleDataUpdate} />
            <GroupInvitations onUpdate={handleDataUpdate} />
          </div>
          <div className="space-y-8">
            <GroupQuickStats stats={stats} loading={loadingStats} />
            <RecommendedGroups
              myGroupIds={myGroupIds}
              onUpdate={handleDataUpdate}
            />
            <PublicGroupsBrowser
              myGroupIds={myGroupIds}
              onUpdate={handleDataUpdate}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
