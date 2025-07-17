import React from "react";

interface TricolorSpinnerProps {
  size?: number; // px
  className?: string;
}

export const TricolorSpinner: React.FC<TricolorSpinnerProps> = ({ size = 48, className }) => {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  // Each color covers 1/3 of the circle
  const arc = circumference / 3;

  return (
    <svg
      width={size}
      height={size}
      className={"animate-spin " + (className || "")}
      style={{ display: "block" }}
      viewBox={`0 0 ${size} ${size}`}
    >
      {/* Orange arc */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#ff9800"
        strokeWidth={strokeWidth}
        strokeDasharray={`${arc} ${circumference - arc}`}
        strokeDashoffset={0}
        strokeLinecap="round"
      />
      {/* White arc */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#fff"
        strokeWidth={strokeWidth}
        strokeDasharray={`${arc} ${circumference - arc}`}
        strokeDashoffset={-arc}
        strokeLinecap="round"
      />
      {/* Green arc */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#4caf50"
        strokeWidth={strokeWidth}
        strokeDasharray={`${arc} ${circumference - arc}`}
        strokeDashoffset={-2 * arc}
        strokeLinecap="round"
      />
    </svg>
  );
}; 