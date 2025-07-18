"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

export function FooterWithGrid() {
  return (
    <div className="bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="border-b border-[var(--border)] pb-8">
          <div className="mb-10 max-w-xl">
            <Logo className="justify-start" />
            <p className="mb-4 text-sm text-[var(--muted-foreground)]">
              Revolutionizing education with AI-powered learning tools. Create
              personalized study plans, take adaptive quizzes, and track your
              progress with our comprehensive learning platform.
            </p>
            <div className="text-sm text-[var(--muted-foreground)]">
              Building the future of education with{" "}
              <Link
                href="#"
                className="font-medium text-[#ff6b35] hover:underline"
              >
                StudyAI
              </Link>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="max-w-md">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">
              Stay Updated
            </h3>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Get study tips and updates"
                className="flex-1 px-3 py-2 text-sm bg-[var(--card)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent text-[var(--foreground)]"
              />
              <button className="px-4 py-2 bg-[#ff6b35] text-[var(--primary-foreground)] text-sm font-medium rounded-md hover:bg-[#ff6b35]/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 border-b border-[var(--border)] pb-10 pt-10 md:grid-cols-4">
          <ul className="text-base font-medium text-[var(--foreground)]">
            <li className="mb-4 text-sm font-bold text-[var(--foreground)]">
              Features
            </li>
            {FEATURES.map((item, idx) => (
              <li key={"features" + idx} className="mb-4 text-sm font-normal">
                <Link
                  href={item.href}
                  className="text-[var(--muted-foreground)] hover:text-[#ff6b35] transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="text-base font-medium text-[var(--foreground)]">
            <li className="mb-4 text-sm font-bold text-[var(--foreground)]">
              Resources
            </li>
            {RESOURCES.map((item, idx) => (
              <li key={"resources" + idx} className="mb-4 text-sm font-normal">
                <Link
                  href={item.href}
                  className="text-[var(--muted-foreground)] hover:text-[#ff6b35] transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="text-base font-medium text-[var(--foreground)]">
            <li className="mb-4 text-sm font-bold text-[var(--foreground)]">
              Support
            </li>
            {SUPPORT.map((item, idx) => (
              <li key={"support" + idx} className="mb-4 text-sm font-normal">
                <Link
                  href={item.href}
                  className="text-[var(--muted-foreground)] hover:text-[#ff6b35] transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="text-base font-medium text-[var(--foreground)]">
            <li className="mb-4 text-sm font-bold text-[var(--foreground)]">
              Company
            </li>
            {COMPANY.map((item, idx) => (
              <li key={"company" + idx} className="mb-4 text-sm font-normal">
                <Link
                  href={item.href}
                  className="text-[var(--muted-foreground)] hover:text-[#ff6b35] transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Information and Social Media */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 pb-8">
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
                <Mail className="w-4 h-4 text-[#ff6b35]" />
                <span>support@studyai.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
                <Phone className="w-4 h-4 text-[#ff6b35]" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
                <MapPin className="w-4 h-4 text-[#ff6b35]" />
                <span>123 Education Street, Learning City, LC 12345</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">
              Follow Us
            </h3>
            <div className="flex gap-4">
              <Link
                href="#"
                className="w-8 h-8 bg-[var(--card)] border border-[var(--border)] rounded-md flex items-center justify-center hover:bg-[#ff6b35] hover:text-[var(--primary-foreground)] transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 bg-[var(--card)] border border-[var(--border)] rounded-md flex items-center justify-center hover:bg-[#ff6b35] hover:text-[var(--primary-foreground)] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 bg-[var(--card)] border border-[var(--border)] rounded-md flex items-center justify-center hover:bg-[#ff6b35] hover:text-[var(--primary-foreground)] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 bg-[var(--card)] border border-[var(--border)] rounded-md flex items-center justify-center hover:bg-[#ff6b35] hover:text-[var(--primary-foreground)] transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <p className="mb-4 pt-4 text-sm text-[var(--muted-foreground)] border-t border-[var(--border)]">
          &copy; {new Date().getFullYear()} StudyAI. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}

const FEATURES = [
  { title: "AI Quizzes", href: "/features/ai-quizzes" },
  { title: "Mock Tests", href: "/features/mock-tests" },
  { title: "Analytics", href: "/features/analytics" },
  { title: "Timetables", href: "/features/timetables" },
];

const RESOURCES = [
  { title: "Formula Sheets", href: "/resources/formula-sheets" },
  { title: "Previous Papers", href: "/resources/previous-papers" },
  { title: "Study Tips", href: "/resources/study-tips" },
  { title: "Blog", href: "/resources/blog" },
];

const SUPPORT = [
  { title: "Help Center", href: "/support/help-center" },
  { title: "Contact", href: "/support/contact" },
  { title: "FAQ", href: "/support/faq" },
  { title: "Community", href: "/support/community" },
];

const COMPANY = [
  { title: "About", href: "/company/about" },
  { title: "Privacy", href: "/company/privacy" },
  { title: "Terms", href: "/company/terms" },
  { title: "Careers", href: "/company/careers" },
];

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link
      href="/"
      className={cn(
        "flex flex-shrink-0 items-center justify-center space-x-2 py-6 text-center text-2xl font-bold text-[var(--foreground)] selection:bg-[#ff6b35]",
        className
      )}
    >
      <div className="relative flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] bg-[#ff6b35] text-sm text-[var(--primary-foreground)] antialiased md:h-6 md:w-6">
        <div className="absolute inset-x-0 -top-10 h-10 w-full rounded-full bg-[#ff6b35]/20 blur-xl" />
        <div className="relative z-20 text-sm text-[var(--primary-foreground)]">
          <img
            src="/logo.png"
            height="50"
            width="50"
            alt="StudyAI Logo"
            className="block"
          />
        </div>
      </div>
      <div
        className={cn(
          "flex items-center gap-2 font-sans text-xl text-[var(--foreground)]"
        )}
      >
        StudyAI{" "}
        <div className="relative rounded-sm border border-[var(--border)] bg-[var(--card)] px-2 py-0.5 text-xs font-bold text-[var(--foreground)] shadow-sm">
          pro
        </div>
      </div>
    </Link>
  );
};
