"use client";

import { useRef } from "react";
import { toast } from "sonner";

// Define a placeholder type for the session data
interface StudySession {
  title: string;
  subject: string;
  [key: string]: any; // Allow for other properties
}

const handleExplainConcept = (
  session: StudySession,
  bgVideoJob: any,
  timersRef: React.MutableRefObject<NodeJS.Timeout[]>,
  setBgVideoJob: (arg0: any) => void,
  setGenTopic: (arg0: string) => void,
  setGenContext: (arg0: string) => void,
  setShowVideoGen: (arg0: boolean) => void
) => {
  const topic = session.title || session.subject || "Concept";
  const context = session.subject || "";

  timersRef.current.forEach(clearTimeout);
  timersRef.current = [];

  setBgVideoJob({ status: "preparing", videoUrl: null, topic, context });
  setGenTopic(topic);
  setGenContext(context);
  setShowVideoGen(true);

  const checkpoints: Array<{
    at: number;
    status: string;
  }> = [
    { at: 600, status: "script" },
    { at: 1800, status: "voice" },
    { at: 3200, status: "render" },
    { at: 5200, status: "complete" },
  ];
  checkpoints.forEach((c) => {
    const t = setTimeout(() => {
      setBgVideoJob((prev: any) => {
        if (!prev) return prev;
        const next = { ...prev, status: c.status };
        if (c.status === "complete") {
          next.videoUrl =
            "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
          // Only update toast if user chose to run in background (toast exists)
          if (prev.toastId !== undefined) {
            toast.success("Video ready!", {
              id: prev.toastId,
              description: "Click View to watch your explanation.",
              action: {
                label: "View video",
                onClick: () => setShowVideoGen(true),
              },
              duration: Infinity,
            });
          }
        }
        return next;
      });
    }, c.at);
    timersRef.current.push(t);
  });
};

const continueInBackground = (
  setShowVideoGen: (arg0: boolean) => void,
  setBgVideoJob: (arg0: (prev: any) => any) => void
) => {
  setBgVideoJob((prev: any) => {
    if (!prev) return prev;
    if (prev.toastId === undefined) {
      const id = toast.info("Generating AI video…", {
        description: "Explore other concepts while we craft this for you.",
        duration: Infinity,
        action: {
          label: "View video",
          onClick: () => setShowVideoGen(true),
        },
      });
      return { ...prev, toastId: id };
    }
    return prev;
  });
  setShowVideoGen(false);
};

export { handleExplainConcept, continueInBackground };
