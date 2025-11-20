"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageCircle,
  ThumbsUp,
  Pin,
  Flag,
  Eye,
  EyeOff,
  Check,
  X,
  Plus,
  Search,
  Filter,
  Clock,
  TrendingUp,
  MessageSquare,
  Paperclip,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  apiService,
  ThreadDetail,
  ThreadSummary,
} from "@/services/weaknessApi";

interface DiscussionBoardProps {
  className?: string;
  studyRoomId: string;
}

export default function DiscussionBoard({
  className,
  studyRoomId,
}: DiscussionBoardProps) {
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [selectedThread, setSelectedThread] = useState<ThreadDetail | null>(
    null
  );

  const [isLoadingThreads, setIsLoadingThreads] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [newThreadQuestionId, setNewThreadQuestionId] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [isCreateThreadOpen, setIsCreateThreadOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchThreads = useCallback(async () => {
    if (!studyRoomId) return;
    setIsLoadingThreads(true);
    try {
      const fetchedThreads = await apiService.getThreads(studyRoomId);
      setThreads(fetchedThreads);
    } catch (error: any) {
      toast.error(error.message || "Failed to load threads.");
    } finally {
      setIsLoadingThreads(false);
    }
  }, [studyRoomId]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const handleSelectThread = async (threadId: string) => {
    setIsLoadingDetails(true);
    setSelectedThread(null);
    try {
      const details = await apiService.getThreadDetails(threadId);
      setSelectedThread(details);
    } catch (error: any) {
      toast.error(error.message || "Failed to load thread details.");
      setSelectedThread(null);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleCreateThread = async () => {
    if (!newThreadTitle.trim() || !newThreadContent.trim()) {
      return toast.error("Please fill in a title and content.");
    }
    try {
      await apiService.createThread(studyRoomId, {
        title: newThreadTitle,
        content: newThreadContent,
        questionId: newThreadQuestionId
          ? Number(newThreadQuestionId)
          : undefined,
      });
      toast.success("Thread created successfully!");
      setIsCreateThreadOpen(false);
      setNewThreadTitle("");
      setNewThreadContent("");
      setNewThreadQuestionId("");
      fetchThreads();
    } catch (error: any) {
      toast.error(error.message || "Failed to create thread.");
    }
  };

  const handleAddReply = async (threadId: string) => {
    if (!replyContent.trim()) return;
    try {
      await apiService.addReply(threadId, { content: replyContent });
      setReplyContent("");
      toast.success("Reply posted!");
      handleSelectThread(threadId); // Refresh details to show new reply
    } catch (error: any) {
      toast.error(error.message || "Failed to post reply.");
    }
  };

  const handleUpvoteThread = async (
    threadId: string,
    event?: React.MouseEvent
  ) => {
    event?.stopPropagation();
    try {
      await apiService.toggleThreadLike(threadId);

      const updateSummary = (t: ThreadSummary): ThreadSummary => ({
        ...t,
        upvotes: t.isUpvoted ? t.upvotes - 1 : t.upvotes + 1,
        isUpvoted: !t.isUpvoted,
      });

      const updateDetail = (t: ThreadDetail): ThreadDetail => ({
        ...t,
        upvotes: t.isUpvoted ? t.upvotes - 1 : t.upvotes + 1,
        isUpvoted: !t.isUpvoted,
      });

      setThreads(
        threads.map((t) => (t.id === threadId ? updateSummary(t) : t))
      );

      if (selectedThread && selectedThread.id === threadId) {
        setSelectedThread(updateDetail(selectedThread));
      }
    } catch (error: any) {
      toast.error(error.message || "Could not update vote.");
    }
  };

  const handleUpvoteReply = async (replyId: string) => {
    if (!selectedThread) return;
    try {
      await apiService.toggleReplyLike(replyId);
      // Optimistic UI update for the detail view
      setSelectedThread({
        ...selectedThread,
        replies: selectedThread.replies.map((r) =>
          r.id === replyId
            ? {
                ...r,
                upvotes: r.isUpvoted ? r.upvotes - 1 : r.upvotes + 1,
                isUpvoted: !r.isUpvoted,
              }
            : r
        ),
      });
    } catch (error: any) {
      toast.error(error.message || "Could not update vote.");
    }
  };

  const handlePinReply = async (threadId: string, replyId: string | null) => {
    try {
      await apiService.pinReply(threadId, { replyId });
      toast.success("Best answer updated!");
      handleSelectThread(threadId); // Refresh to see changes
    } catch (error: any) {
      toast.error(error.message || "Could not pin reply.");
    }
  };

  const filteredThreads = threads.filter((thread) => {
    const matchesSearch =
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchQuery.toLowerCase());

    switch (activeTab) {
      // FIX 3: Use `repliesCount` for summary view
      case "unanswered":
        return matchesSearch && thread.repliesCount === 0;
      case "resolved":
        return matchesSearch && thread.status === "resolved";
      case "top":
        return matchesSearch && thread.upvotes > 5;
      default:
        return matchesSearch;
    }
  });

  // const handleResolveThread = (threadId: string) => {
  //   setThreads(
  //     threads.map((thread) => {
  //       if (thread.id === threadId) {
  //         const newStatus = thread.status === "resolved" ? "open" : "resolved";
  //         toast.success(`Thread marked as ${newStatus}`);
  //         return { ...thread, status: newStatus };
  //       }
  //       return thread;
  //     })
  //   );
  // };

  const handleResolveThread = async (threadId: string) => {
    try {
      await apiService.resolveThread(threadId);
      toast.success("Thread status updated!");
      fetchThreads();
      if (selectedThread && selectedThread.id === threadId) {
        handleSelectThread(threadId);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update status.");
    }
  };

  const handleReportContent = (type: "thread" | "reply", id: string) => {
    toast.success("Content reported for review");
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (selectedThread) {
    return (
      <div className={`bg-white ${className}`}>
        <div className="border-b border-[#e0e0e0] p-4">
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedThread(null)}
            >
              ← Back to Threads
            </Button>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-[#1c1f24] mb-2">
                {selectedThread.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-[#7d7e80]">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={selectedThread.author.avatar} />
                    <AvatarFallback>
                      {selectedThread.author.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span>{selectedThread.author.name}</span>
                </div>
                <span>{formatTimestamp(selectedThread.timestamp)}</span>
                <Badge
                  variant={
                    selectedThread.status === "resolved"
                      ? "default"
                      : "secondary"
                  }
                >
                  {selectedThread.status}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleUpvoteThread(selectedThread.id, e)}
                className={selectedThread.isUpvoted ? "text-[#fe7244]" : ""}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                {selectedThread.upvotes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleResolveThread(selectedThread.id)}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReportContent("thread", selectedThread.id)}
              >
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="prose prose-sm max-w-none mb-6">
            <p className="text-[#1c1f24] whitespace-pre-wrap text-md font-medium ml-2">
              {selectedThread.content}
            </p>
          </div>

          <div className="space-y-4">
            {selectedThread.replies
              .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
              .map((reply) => (
                <Card
                  key={reply.id}
                  className={
                    reply.isPinned ? "border-[#fe7244]/20 bg-[#fe7244]/5" : ""
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={reply.author.avatar} />
                          <AvatarFallback>
                            {reply.author.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">
                          {reply.author.name}
                        </span>
                        {/* {reply.author.badges.map((badge) => (
                          <Badge
                            key={badge}
                            variant="outline"
                            className="text-xs"
                          >
                            {badge}
                          </Badge>
                        ))} */}
                        {reply.isPinned && (
                          <Badge className="text-xs bg-[#fe7244]">
                            <Pin className="h-3 w-3 mr-1" />
                            Best Answer
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-[#7d7e80]">
                        {formatTimestamp(reply.timestamp)}
                      </span>
                    </div>

                    <div className="prose prose-sm max-w-none mb-3">
                      <p className="text-[#1c1f24] whitespace-pre-wrap font-medium ml-2">
                        {reply.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpvoteReply(reply.id)}
                        className={reply.isUpvoted ? "text-[#fe7244]" : ""}
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {reply.upvotes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handlePinReply(selectedThread.id, reply.id)
                        }
                      >
                        <Pin className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReportContent("reply", reply.id)}
                      >
                        <Flag className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="space-y-3">
                <Textarea
                  placeholder="Write your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      multiple
                    />
                  </div>
                  <Button
                    onClick={() => handleAddReply(selectedThread.id)}
                    disabled={!replyContent.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white ${className}`}>
      <div className="border-b border-[#e0e0e0] p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-[#1c1f24]">
            Discussion Board
          </h1>
          <Dialog
            open={isCreateThreadOpen}
            onOpenChange={setIsCreateThreadOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Thread
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Thread</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Thread title"
                    value={newThreadTitle}
                    onChange={(e) => setNewThreadTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Question # (optional)"
                    value={newThreadQuestionId}
                    onChange={(e) => setNewThreadQuestionId(e.target.value)}
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Describe your question or topic..."
                    value={newThreadContent}
                    onChange={(e) => setNewThreadContent(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateThreadOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateThread}>Create Thread</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#7d7e80]" />
              <Input
                placeholder="Search threads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="top">Top</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {filteredThreads.map((thread) => (
            <Card
              key={thread.id}
              className="cursor-pointer hover:bg-white/50 transition-colors"
              onClick={() => handleSelectThread(thread.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[#1c1f24] mb-2 truncate">
                      {thread.title}
                    </h3>
                    <p className="text-sm text-[#7d7e80] mb-3 line-clamp-2 font-medium">
                      {thread.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-[#7d7e80]">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={thread.author.avatar} />
                          <AvatarFallback>
                            {thread.author.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>{thread.author.name}</span>
                      </div>
                      <span>{formatTimestamp(thread.timestamp)}</span>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{thread.repliesCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      variant={
                        thread.status === "resolved" ? "default" : "secondary"
                      }
                    >
                      {thread.status}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpvoteThread(thread.id, e);
                        }}
                        className={thread.isUpvoted ? "text-[#fe7244]" : ""}
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {thread.upvotes}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredThreads.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto text-[#7d7e80] mb-4" />
            <h3 className="text-lg font-medium text-[#1c1f24] mb-2">
              No threads found
            </h3>
            <p className="text-[#7d7e80] mb-4">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Be the first to start a discussion"}
            </p>
            <Button onClick={() => setIsCreateThreadOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Thread
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
