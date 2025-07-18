"use client";
import Image from "next/image";
import React from "react";
import { Users, TrendingUp, FileText } from "lucide-react";

export function SpotlightLogoCloud() {
  const logos = [
    {
      name: "Allen",
      src: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&crop=center",
    },
    {
      name: "Aakash",
      src: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200&h=100&fit=crop&crop=center",
    },
    {
      name: "FIITJEE",
      src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=100&fit=crop&crop=center",
    },
    {
      name: "Resonance",
      src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=100&fit=crop&crop=center",
    },
    {
      name: "Vedantu",
      src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=100&fit=crop&crop=center",
    },
    {
      name: "Unacademy",
      src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=100&fit=crop&crop=center",
    },
    {
      name: "Byju's",
      src: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=100&fit=crop&crop=center",
    },
    {
      name: "Narayana",
      src: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=200&h=100&fit=crop&crop=center",
    },
  ];

  const metrics = [
    {
      value: "50,000+",
      label: "Students Enrolled",
      icon: Users,
    },
    {
      value: "95%",
      label: "Success Rate",
      icon: TrendingUp,
    },
    {
      value: "10,000+",
      label: "Mock Tests Taken",
      icon: FileText,
    },
  ];

  return (
    <div className="relative w-full overflow-hidden py-40 bg-[var(--background)]">
      <AmbientColor />
      <h2 className="bg-gradient-to-b from-[var(--foreground)] to-[var(--muted-foreground)] bg-clip-text pb-4 text-center font-inter text-2xl font-bold text-transparent md:text-5xl">
        Trusted by Leading Coaching Institutes
      </h2>
      <p className="text-[var(--muted-foreground)] mb-10 mt-4 text-center font-inter text-base">
        Top coaching institutes across India trust our platform to deliver
        exceptional results for their students.
      </p>
      <div className="relative mx-auto grid w-full max-w-3xl grid-cols-4 gap-10">
        {logos.map((logo, idx) => (
          <div
            key={logo.src + idx + "logo-spotlight"}
            className="flex items-center justify-center"
          >
            <img
              src={logo.src}
              alt={logo.name}
              width={100}
              height={100}
              className="w-full select-none object-contain rounded-lg"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Success Metrics Section */}
      <div className="mt-20 mx-auto max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-[var(--primary)]/10 rounded-full">
                  <metric.icon className="w-6 h-6 text-[var(--primary)]" />
                </div>
              </div>
              <div className="text-3xl font-bold text-[var(--primary)] mb-2 font-inter">
                {metric.value}
              </div>
              <div className="text-[var(--muted-foreground)] font-inter">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const AmbientColor = () => {
  return (
    <div className="pointer-events-none absolute left-40 top-0 z-40 h-screen w-screen">
      <div
        style={{
          transform: "translateY(-350px) rotate(-45deg)",
          width: "560px",
          height: "1380px",
          background:
            "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(25, 100%, 85%, .2) 0, hsla(25, 100%, 55%, .1) 50%, hsla(25, 100%, 45%, .05) 80%)",
          filter: "blur(20px)",
          borderRadius: "50%",
        }}
        className="absolute left-0 top-0"
      />

      <div
        style={{
          transform: "rotate(-45deg) translate(5%, -50%)",
          transformOrigin: "top left",
          width: "240px",
          height: "1380px",
          background:
            "radial-gradient(50% 50% at 50% 50%, hsla(25, 100%, 85%, .15) 0, hsla(25, 100%, 45%, .1) 80%, transparent 100%)",
          filter: "blur(20px)",
          borderRadius: "50%",
        }}
        className="absolute left-0 top-0"
      />

      <div
        style={{
          position: "absolute",
          borderRadius: "50%",
          transform: "rotate(-45deg) translate(-180%, -70%)",
          transformOrigin: "top left",
          top: 0,
          left: 0,
          width: "240px",
          height: "1380px",
          background:
            "radial-gradient(50% 50% at 50% 50%, hsla(25, 100%, 85%, .1) 0, hsla(25, 100%, 45%, .05) 80%, transparent 100%)",
          filter: "blur(20px)",
        }}
        className="absolute left-0 top-0"
      />
    </div>
  );
};
