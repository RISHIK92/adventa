"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  BookOpen,
  Brain,
  BarChart,
  Calendar,
  User,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  className?: string;
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

const navigationItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: BookOpen, label: "Study Material", path: "/study-material" },
  { icon: Brain, label: "Practice Tests", path: "/practice-tests" },
  { icon: BarChart, label: "Performance", path: "/performance" },
  { icon: Calendar, label: "Timetable", path: "/timetable" },
  { icon: User, label: "Profile", path: "/profile" },
];

function SidebarContent({
  collapsed = false,
  onNavigate,
  currentPath = "/dashboard",
  onToggleCollapse,
}: {
  collapsed?: boolean;
  onNavigate?: (path: string) => void;
  currentPath?: string;
  onToggleCollapse?: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-white border-r border-slate-200">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200">
        {!collapsed && (
          <h2 className="text-display font-semibold text-slate-900">
            StudyDash
          </h2>
        )}
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="ml-auto hover:bg-slate-100 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <Button
              key={item.path}
              variant="ghost"
              size={collapsed ? "icon" : "default"}
              className={cn(
                "w-full transition-all duration-200 ease-in-out",
                collapsed ? "h-10 w-10 px-0" : "justify-start h-10 px-3",
                isActive
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
              onClick={() => onNavigate?.(item.path)}
            >
              <Icon className={cn("h-4 w-4", collapsed ? "" : "mr-3")} />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-4">
        <div
          className={cn(
            "flex items-center gap-3 p-2 rounded-lg bg-slate-50",
            collapsed && "justify-center"
          )}
        >
          <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
            <span className="text-sm font-medium text-white">U</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                User Name
              </p>
              <p className="text-xs text-slate-500 truncate">
                user@example.com
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardSidebar({
  className,
  onNavigate,
  currentPath,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 left-4 z-40 bg-white shadow-lg hover:bg-slate-50 border-slate-200"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            <SidebarContent onNavigate={onNavigate} currentPath={currentPath} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 z-30 transition-all duration-300 ease-in-out",
          collapsed ? "lg:w-16" : "lg:w-64",
          className
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          onNavigate={onNavigate}
          currentPath={currentPath}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </div>
    </>
  );
}
