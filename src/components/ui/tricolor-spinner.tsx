import type React from "react"

interface KnowledgeOrbitalSpinnerProps {
  size?: number // px
  className?: string
}

export const TricolorSpinner: React.FC<KnowledgeOrbitalSpinnerProps> = ({ size = 64, className }) => {
  const center = size / 2
  const coreRadius = size * 0.08
  const orbit1Radius = size * 0.25
  const orbit2Radius = size * 0.35
  const orbit3Radius = size * 0.45
  const particleRadius = size * 0.04

  return (
    <div className={`relative ${className || ""}`} style={{ width: size, height: size }}>
      <div
        className="absolute bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-pulse"
        style={{
          width: coreRadius * 2,
          height: coreRadius * 2,
          left: center - coreRadius,
          top: center - coreRadius,
          boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)",
        }}
      />

      {/* Neural Network Connections */}
      <svg width={size} height={size} className="absolute inset-0 animate-pulse" style={{ animationDuration: "2s" }}>
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Connection lines */}
        <line
          x1={center}
          y1={center}
          x2={center + orbit1Radius}
          y2={center}
          stroke="url(#connectionGradient)"
          strokeWidth="1"
        />
        <line
          x1={center}
          y1={center}
          x2={center - orbit2Radius * 0.7}
          y2={center - orbit2Radius * 0.7}
          stroke="url(#connectionGradient)"
          strokeWidth="1"
        />
        <line
          x1={center}
          y1={center}
          x2={center + orbit3Radius * 0.5}
          y2={center + orbit3Radius * 0.8}
          stroke="url(#connectionGradient)"
          strokeWidth="1"
        />
      </svg>

      {/* Orbit 1 - Physics (Red particle) */}
      <div
        className="absolute animate-spin"
        style={{
          width: orbit1Radius * 2,
          height: orbit1Radius * 2,
          left: center - orbit1Radius,
          top: center - orbit1Radius,
          animationDuration: "3s",
        }}
      >
        <div
          className="absolute bg-gradient-to-br from-red-400 to-pink-500 rounded-full"
          style={{
            width: particleRadius * 2,
            height: particleRadius * 2,
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            boxShadow: "0 0 10px rgba(248, 113, 113, 0.4)",
          }}
        />
      </div>

      {/* Orbit 2 - Chemistry (Green particle) */}
      <div
        className="absolute animate-spin"
        style={{
          width: orbit2Radius * 2,
          height: orbit2Radius * 2,
          left: center - orbit2Radius,
          top: center - orbit2Radius,
          animationDuration: "4s",
          animationDirection: "reverse",
        }}
      >
        <div
          className="absolute bg-gradient-to-br from-green-400 to-emerald-500 rounded-full"
          style={{
            width: particleRadius * 2,
            height: particleRadius * 2,
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            boxShadow: "0 0 10px rgba(74, 222, 128, 0.4)",
          }}
        />
      </div>

      {/* Orbit 3 - Mathematics (Orange particle) */}
      <div
        className="absolute animate-spin"
        style={{
          width: orbit3Radius * 2,
          height: orbit3Radius * 2,
          left: center - orbit3Radius,
          top: center - orbit3Radius,
          animationDuration: "5s",
        }}
      >
        <div
          className="absolute bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full"
          style={{
            width: particleRadius * 2,
            height: particleRadius * 2,
            right: 0,
            bottom: 0,
            boxShadow: "0 0 10px rgba(251, 146, 60, 0.4)",
          }}
        />
      </div>

      {/* Floating Knowledge Particles */}
      <div className="absolute inset-0">
        {/* Math Symbol */}
        <div
          className="absolute text-indigo-300 font-bold animate-bounce"
          style={{
            fontSize: size * 0.12,
            left: "15%",
            top: "20%",
            animationDuration: "2s",
            animationDelay: "0s",
          }}
        >
          ∑
        </div>

        {/* Chemistry Symbol */}
        <div
          className="absolute text-green-300 font-bold animate-bounce"
          style={{
            fontSize: size * 0.1,
            right: "20%",
            top: "25%",
            animationDuration: "2.5s",
            animationDelay: "0.5s",
          }}
        >
          H₂O
        </div>

        {/* Physics Symbol */}
        <div
          className="absolute text-red-300 font-bold animate-bounce"
          style={{
            fontSize: size * 0.11,
            left: "25%",
            bottom: "20%",
            animationDuration: "2.2s",
            animationDelay: "1s",
          }}
        >
          E=mc²
        </div>
      </div>

      {/* Outer Glow Ring */}
      <div
        className="absolute border border-indigo-200 rounded-full animate-ping"
        style={{
          width: size * 0.9,
          height: size * 0.9,
          left: size * 0.05,
          top: size * 0.05,
          animationDuration: "3s",
        }}
      />
    </div>
  )
}

 