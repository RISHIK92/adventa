"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  TrendingUp,
  History,
  BarChart3,
  ArrowRight,
  ExternalLink,
  FileText,
  Users,
} from "lucide-react";

export const ActionPanel = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const actionCards = [
    {
      id: 1,
      icon: BookOpen,
      title: "Try Another Paper",
      description: "Take a new practice exam to continue improving your skills",
      color: "from-indigo-500 to-purple-600",
      bgColor: "from-indigo-50 to-purple-50",
      buttonText: "Start New Exam",
      isPrimary: true,
    },
    {
      id: 2,
      icon: History,
      title: "View Attempt History",
      description: "Review all your previous attempts and track your progress",
      color: "from-blue-500 to-cyan-600",
      bgColor: "from-blue-50 to-cyan-50",
      buttonText: "View History",
    },
    {
      id: 3,
      icon: FileText,
      title: "Study Resources",
      description:
        "Access comprehensive study materials and preparation guides",
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-50 to-teal-50",
      buttonText: "Browse Resources",
    },
    {
      id: 4,
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Dive deep into detailed analytics and performance insights",
      color: "from-orange-500 to-red-600",
      bgColor: "from-orange-50 to-red-50",
      buttonText: "View Analytics",
    },
  ];

  const secondaryActions = [
    { icon: Users, label: "Join Study Group", href: "#" },
    { icon: ExternalLink, label: "Download Certificate", href: "#" },
    { icon: BookOpen, label: "Course Recommendations", href: "#" },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-6 shadow-lg shadow-indigo-200">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-6 font-display">
            What's Next?
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-body">
            Continue your learning journey with these personalized
            recommendations designed to help you achieve your goals.
          </p>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {actionCards.map((card, index) => {
            const Icon = card.icon;
            const isHovered = hoveredCard === card.id;

            return (
              <Card
                key={card.id}
                className={`group relative overflow-hidden border-0 backdrop-blur-lg bg-white/70 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                  isHovered ? "scale-[1.02]" : ""
                }`}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Border */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.color} p-[2px] rounded-lg`}
                >
                  <div className="h-full w-full bg-white/90 backdrop-blur-sm rounded-md" />
                </div>

                <CardHeader className="relative z-10 pb-4">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${card.color} rounded-xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors font-display">
                    {card.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 text-lg leading-relaxed font-body">
                    {card.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10 pt-0">
                  <Button
                    className={`w-full bg-gradient-to-r ${
                      card.color
                    } hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 text-white border-0 group-hover:scale-105 ${
                      card.isPrimary ? "h-14 text-lg font-semibold" : "h-12"
                    }`}
                  >
                    {card.buttonText}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>

                {/* Hover Glow Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-lg`}
                />
              </Card>
            );
          })}
        </div>

        {/* Secondary Actions */}
        <Card className="backdrop-blur-lg bg-white/60 border-0 shadow-xl mb-12">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-slate-800 font-display">
              Additional Resources
            </CardTitle>
            <CardDescription className="text-slate-600 font-body">
              Explore more ways to enhance your learning experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-4">
              {secondaryActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="bg-white/80 hover:bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 group"
                  >
                    <Icon className="w-4 h-4 mr-2 group-hover:text-indigo-600 transition-colors" />
                    {action.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <Card className="inline-block backdrop-blur-lg bg-white/50 border-0 shadow-lg">
            <CardContent className="p-6">
              <p className="text-slate-600 mb-4 font-body">
                Need help or have questions about your results?
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  variant="ghost"
                  className="hover:bg-white/80 transition-colors"
                >
                  Contact Support
                </Button>
                <Button
                  variant="ghost"
                  className="hover:bg-white/80 transition-colors"
                >
                  FAQ
                </Button>
                <Button
                  variant="ghost"
                  className="hover:bg-white/80 transition-colors"
                >
                  Study Tips
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
