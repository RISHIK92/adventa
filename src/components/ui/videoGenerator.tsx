"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle2, Loader2, Sparkles, XCircle } from "lucide-react";
// Assuming weaknessApi.ts exports your API functions and types
import { apiService, VideoJobStatus } from "@/services/weaknessApi";

interface VideoGeneratorProps {
  questionId: number;
  startGeneration: boolean; // Prop to tell the component when to start the process
  topicTitle: string;
  context?: string;
}

const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;

  let videoId = null;

  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      videoId = match[1];
      break;
    }
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&disablekb=1&iv_load_policy=3`;
  }

  console.warn("Could not parse a YouTube video ID from the URL:", url);
  return url;
};

export const VideoGenerator = ({
  questionId,
  startGeneration,
  topicTitle,
  context,
}: VideoGeneratorProps) => {
  // --- INTERNAL STATE MANAGEMENT ---
  const [videoJob, setVideoJob] = useState<VideoJobStatus | null>(null);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const jobCreationStarted = useRef(false);

  const hints = useMemo(
    () => [
      "Crafting a script tailored to your question...",
      "Generating voiceover and synchronizing visuals...",
      "Adding motion graphics for tricky parts...",
      "Finalizing the render. We'll notify you when it's ready!",
    ],
    []
  );
  const [hintIndex, setHintIndex] = useState(0);

  // --- API LOGIC ---

  // Effect 1: Starts the job creation process when triggered
  useEffect(() => {
    if (!startGeneration || !questionId || jobCreationStarted.current) {
      return;
    }

    const createJob = async () => {
      // The internal isCreatingJob state is still useful for UI rendering
      setIsCreatingJob(true);
      setVideoJob(null);

      try {
        const { jobId } = await apiService.startVideoGeneration(questionId);
        console.log("Started video job with ID:", jobId);
        setVideoJob({
          id: jobId,
          status: "PENDING",
          videoUrl: null,
          errorMessage: null,
          retryCount: 0,
        });
      } catch (error) {
        console.error("Failed to start video generation job:", error);
        toast.error("Failed to start video generation.");
        setVideoJob({
          id: "error-state",
          status: "FAILED",
          errorMessage: "Could not initialize the video generation job.",
          videoUrl: null,
          retryCount: 0,
        });
      } finally {
        setIsCreatingJob(false);
      }
    };

    jobCreationStarted.current = true;
    createJob();
  }, [questionId, startGeneration]);

  // Effect 2: Polls for the job status
  useEffect(() => {
    const stopPolling = () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };

    // Start polling only if we have a job that is still in progress
    if (videoJob?.id && ["PENDING", "PROCESSING"].includes(videoJob.status)) {
      // Clear any existing interval before starting a new one
      stopPolling();

      pollingIntervalRef.current = setInterval(async () => {
        try {
          const updatedJob = await apiService.getVideoGenerationStatus(
            videoJob.id
          );
          setVideoJob(updatedJob);

          if (["COMPLETED", "FAILED"].includes(updatedJob.status)) {
            stopPolling();
            if (updatedJob.status === "COMPLETED") {
              toast.success("Your AI video is ready!");
            } else {
              toast.error("Video generation failed.", {
                description:
                  updatedJob.errorMessage || "An unknown error occurred.",
              });
            }
          }
        } catch (error) {
          console.error("Failed to poll job status:", error);
          toast.error("Could not retrieve video status.");
          stopPolling(); // Stop on error to prevent infinite loops
        }
      }, 4000); // Poll every 4 seconds
    } else {
      // Stop polling if status is not PENDING or PROCESSING
      stopPolling();
    }

    return stopPolling;
  }, [videoJob?.id, videoJob?.status]);

  // Effect 3: Manages the rotating hints for the user
  useEffect(() => {
    let hintInterval: NodeJS.Timeout | null = null;
    if (videoJob && ["PENDING", "PROCESSING"].includes(videoJob.status)) {
      hintInterval = setInterval(() => {
        setHintIndex((i) => (i + 1) % hints.length);
      }, 2500);
    }
    return () => {
      if (hintInterval) clearInterval(hintInterval);
    };
  }, [videoJob, hints.length]);

  const mapJobStatusToDisplay = (backendStatus?: VideoJobStatus["status"]) => {
    const statusMap = {
      PENDING: {
        componentStatus: "preparing" as const,
        label: "Preparing...",
        progress: 10,
      },
      PROCESSING: {
        componentStatus: "render" as const,
        label: "Generating Video...",
        progress: 60,
      },
      COMPLETED: {
        componentStatus: "complete" as const,
        label: "Completed",
        progress: 100,
      },
      FAILED: {
        componentStatus: "complete" as const, // Render logic handles the failure UI
        label: "Failed",
        progress: 100,
      },
    };
    return statusMap[backendStatus || "PENDING"];
  };

  const display = mapJobStatusToDisplay(videoJob?.status);
  const effectiveStatus = display.componentStatus;

  // --- RENDER STATES ---

  if (isCreatingJob) {
    return (
      <div className="flex flex-col items-center justify-center h-48 space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff5c00]" />
        <p className="text-lg font-medium text-gray-700">Initializing Job...</p>
      </div>
    );
  }

  // Handle a failed job explicitly
  if (videoJob?.status === "FAILED") {
    return (
      <Card className="border-red-500/50 bg-red-500/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <XCircle className="h-10 w-10 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-800">
                Video Generation Failed
              </p>
              <p className="text-xs text-red-700 mt-1">
                {videoJob.errorMessage || "An unexpected error occurred."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle a completed job that is missing a video URL (edge case)
  if (videoJob?.status === "COMPLETED" && !videoJob.videoUrl) {
    return (
      <Card className="border-amber-500/50 bg-amber-500/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <XCircle className="h-10 w-10 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-800">Processing Error</p>
              <p className="text-xs text-amber-700 mt-1">
                The job completed, but a video URL was not provided. Please try
                again.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">AI Video • {topicTitle}</h3>
          {context && (
            <p className="text-sm text-[#667085] mt-1 line-clamp-2">
              {context}
            </p>
          )}
        </div>
        <Badge
          variant={effectiveStatus === "complete" ? "default" : "secondary"}
          className={
            effectiveStatus === "complete"
              ? "bg-green-100 text-green-800 border border-green-200"
              : ""
          }
        >
          {display.label}
        </Badge>
      </div>

      {effectiveStatus !== "complete" && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <motion.div
                  className="w-10 h-10 rounded-full border-4 border-[#ff5c00]/30"
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    ease: "linear",
                  }}
                />
                <motion.div
                  className="absolute inset-0 m-auto w-10 h-10 rounded-full border-4 border-[#ff5c00] border-t-transparent"
                  animate={{ rotate: -360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.6,
                    ease: "linear",
                  }}
                />
              </div>
              <div>
                <p className="text-sm font-medium">{display.label}</p>
                <p className="text-xs text-[#667085]">{hints[hintIndex]}</p>
              </div>
            </div>
            <div className="w-full h-2 bg-[#f0f2f5] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#ff5c00]"
                initial={{ width: 0 }}
                animate={{ width: `${display.progress}%` }}
                transition={{ ease: "easeInOut", duration: 0.4 }}
              />
            </div>
            <div className="mt-2 text-right text-xs text-[#667085]">
              {display.progress}%
            </div>
          </CardContent>
        </Card>
      )}

      <AnimatePresence>
        {effectiveStatus === "complete" && videoJob?.videoUrl && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="aspect-video w-full rounded-lg overflow-hidden border bg-black">
              <iframe
                src={getYouTubeEmbedUrl(videoJob.videoUrl) || ""}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full"
              ></iframe>

              {/* <iframe
                src={getYouTubeEmbedUrl(videoJob.videoUrl) || ""}
                title={`AI Generated Video: ${topicTitle}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe> */}
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm">Generation completed</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="gap-2">
                  <Play className="h-4 w-4" /> Play Again
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Sparkles className="h-4 w-4" /> New Version
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {effectiveStatus !== "complete" && (
        <div className="flex items-center gap-2 text-xs text-[#667085]">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          This may take a minute. Feel free to continue in the background.
        </div>
      )}
    </div>
  );
};
