import { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface TestTimerProps {
  duration?: number; // in seconds
  onTimeUp?: () => void;
  className?: string;
}

export default function TestTimer({
  duration = 3600, // 1 hour default
  onTimeUp = () => console.log("Time's up!"),
  className,
}: TestTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isWarning, setIsWarning] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;

        if (newTime <= 300 && !isUrgent) {
          setIsUrgent(true);
          setIsPulsing(true);
        } else if (newTime <= 900 && !isWarning) {
          setIsWarning(true);
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, onTimeUp, isWarning, isUrgent]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((duration - timeRemaining) / duration) * 100;
  const remainingProgress = 100 - progress;

  const getContainerStyles = () => {
    if (isUrgent) {
      return "bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-700";
    }
    if (isWarning) {
      return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700";
    }
    return "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 text-orange-700";
  };

  const getProgressColor = () => {
    if (isUrgent) return "#ef4444"; // red
    if (isWarning) return "#eab308"; // yellow
    return "#ff6b35"; // orange
  };

  const getIconColor = () => {
    if (isUrgent) return "text-red-500";
    if (isWarning) return "text-yellow-500";
    return "text-orange-500";
  };

  return (
    <div
      className={`inline-flex items-center gap-3 px-4 ml-14 py-2.5 rounded-xl border shadow-sm transition-all duration-300 ${getContainerStyles()} ${
        isPulsing && isUrgent ? "animate-pulse" : ""
      } ${className}`}
    >
      <div className="flex-shrink-0">
        {isUrgent ? (
          <AlertTriangle className={`w-5 h-5 ${getIconColor()}`} />
        ) : (
          <Clock className={`w-5 h-5 ${getIconColor()}`} />
        )}
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg font-bold tabular-nums leading-none">
            {formatTime(timeRemaining)}
          </span>
          {isUrgent && (
            <span className="text-xs font-medium text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full">
              URGENT
            </span>
          )}
        </div>
        <span className="text-xs font-medium opacity-75 leading-none mt-0.5">
          {isUrgent
            ? "Time running out!"
            : isWarning
            ? "Time warning"
            : "Time remaining"}
        </span>
      </div>

      <div className="flex-shrink-0 w-16 h-2 bg-white/60 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-1000 ease-out rounded-full"
          style={{
            width: `${remainingProgress}%`,
            backgroundColor: getProgressColor(),
            boxShadow: isUrgent ? "0 0 8px rgba(239, 68, 68, 0.4)" : "none",
          }}
        />
      </div>
    </div>
  );
}
