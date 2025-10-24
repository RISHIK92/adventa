"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// import LandingHeroAndMarketing from "@/components/LandingHeroAndMarketing";
import OnboardingProfileFlow from "@/components/test-dashboard/OnboardingProfileFlow";
import MissionControlDashboard from "@/components/test-dashboard/MissionControllerDasboard";
// import TestEngineInterface from "@/components/TestEngineInterface";
import GamificationOverlay from "@/components/test-dashboard/GamificationOverlay";
import { useRouter } from "next/navigation";
import { apiService } from "@/services/weaknessApi";

type AppState = "marketing" | "onboarding" | "dashboard" | "test" | "social";

export interface DailyPlan {
  title: string;
  rationale: string; // This will map to 'description' in the UI
  recommendedId: string;
  status: string;
  action: {
    type: string; // e.g., "RECOMMEND_TEST", "RECOMMEND_STUDY"
    parameters: {
      testType?: string;
      details?: string;
      contentType?: string;
      contentName?: string;
      studyLink?: string;
    };
  };
}

interface UserSession {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  currentTestId?: string;
}

export default function Page() {
  const [appState, setAppState] = useState<AppState>("marketing");
  const [userSession, setUserSession] = useState<UserSession>({
    isAuthenticated: false,
    hasCompletedOnboarding: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [aiRecommendation, setAiRecommendation] = useState<DailyPlan | null>(
    null
  );
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize app state based on user session
  useEffect(() => {
    // Simulate checking authentication and onboarding status
    const checkUserSession = async () => {
      try {
        // Check localStorage for existing session
        const savedSession = localStorage.getItem("user-session");
        const savedOnboarding = localStorage.getItem("onboarding-completed");

        if (savedSession) {
          const session = JSON.parse(savedSession);
          setUserSession({
            isAuthenticated: true,
            hasCompletedOnboarding: !!savedOnboarding,
          });

          if (savedOnboarding) {
            setAppState("dashboard");
          } else {
            setAppState("onboarding");
          }
        } else {
          setAppState("marketing");
        }
      } catch (error) {
        console.error("Error checking user session:", error);
        setAppState("marketing");
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  // Handle authentication (from marketing page)
  const handleAuthentication = () => {
    const newSession = {
      isAuthenticated: true,
      hasCompletedOnboarding: false,
    };

    setUserSession(newSession);
    localStorage.setItem("user-session", JSON.stringify(newSession));
    setAppState("onboarding");

    toast.success("Welcome! Let's set up your profile.");
  };

  // Handle onboarding completion
  const handleOnboardingComplete = (onboardingData: any) => {
    const updatedSession = {
      ...userSession,
      hasCompletedOnboarding: true,
    };

    setUserSession(updatedSession);
    localStorage.setItem("onboarding-completed", "true");
    localStorage.setItem("onboarding-data", JSON.stringify(onboardingData));
    setAppState("dashboard");

    toast.success("Setup complete! Welcome to your dashboard.");
  };

  // Handle onboarding skip
  const handleOnboardingSkip = () => {
    const updatedSession = {
      ...userSession,
      hasCompletedOnboarding: true,
    };

    setUserSession(updatedSession);
    localStorage.setItem("onboarding-completed", "true");
    setAppState("dashboard");

    toast.info("You can complete your profile setup anytime from settings.");
  };

  // Handle navigation between different sections
  const handleNavigation = (route: string) => {
    switch (route) {
      case "/dashboard":
      case "dashboard":
        setAppState("dashboard");
        break;
      case "/test":
      case "/test-center":
      case "test":
        setAppState("test");
        break;
      case "/social":
      case "social":
        setAppState("social");
        break;
      case "/marketing":
      case "marketing":
        setAppState("marketing");
        break;
      default:
        setAppState("dashboard");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user-session");
    localStorage.removeItem("onboarding-completed");
    localStorage.removeItem("onboarding-data");

    setUserSession({
      isAuthenticated: false,
      hasCompletedOnboarding: false,
    });
    setAppState("marketing");

    toast.info("You've been logged out successfully.");
  };

  // Fetch AI recommendations
  useEffect(() => {
    const mainTimer = setTimeout(() => setLoading(false), 1000);

    const fetchAiRecommendation = async () => {
      setIsRecommendationLoading(true);
      try {
        const examId = 1;
        const response = await apiService.getAIDailyPlan(examId);
        if (response) {
          setAiRecommendation(response);
        } else {
          setAiRecommendation(null);
          toast.error("Could not load your AI recommendation for today.");
        }
      } catch (error) {
        console.error("Failed to fetch AI recommendation:", error);
        toast.error("Could not load your AI recommendation for today.");
        setAiRecommendation(null);
      } finally {
        setIsRecommendationLoading(false);
      }
    };

    fetchAiRecommendation();
    return () => clearTimeout(mainTimer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading StudySync...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Global Gamification Overlay - Always visible when authenticated */}
      {userSession.isAuthenticated && userSession.hasCompletedOnboarding && (
        <GamificationOverlay />
      )}

      {/* Main Content Area */}
      <main className="relative">
        <AnimatePresence mode="wait">
          {/* Marketing/Landing Page */}
          {appState === "marketing" && (
            <motion.div
              key="marketing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-4">
                {/* Call-to-action overlay for getting started */}
                <div className="fixed bottom-6 right-6 z-40">
                  <motion.button
                    className="bg-primary text-[#ffffff] px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow"
                    onClick={handleAuthentication}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started Free
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Onboarding Flow */}
          {appState === "onboarding" && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <OnboardingProfileFlow
                onComplete={handleOnboardingComplete}
                onSkip={handleOnboardingSkip}
              />
            </motion.div>
          )}

          {/* Main Dashboard */}
          {appState === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="pt-16 md:pt-0"
            >
              <div className="container mx-auto px-4 py-6">
                {/* Dashboard Header with Navigation */}
                {/* <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold">Mission Control</h1>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => router.push("/study-group")}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Social Hub
                    </button>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div> */}

                <MissionControlDashboard
                  aiRecommendation={aiRecommendation}
                  isRecommendationLoading={isRecommendationLoading}
                />
              </div>
            </motion.div>
          )}

          {/* Test Engine */}
          {appState === "test" && (
            <motion.div
              key="test"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              {/* <TestEngineInterface onNavigate={handleNavigation} /> */}
            </motion.div>
          )}

          {/* Social/Competitive Section */}
          {appState === "social" && (
            <motion.div
              key="social"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
              className="pt-16 md:pt-0"
            >
              <div className="container mx-auto px-4 py-6">
                {/* Social Header with Back Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => handleNavigation("dashboard")}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    ← Back to Dashboard
                  </button>
                </div>

                {/* <SocialCompetitive /> */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Navigation for Authenticated Users */}
      {userSession.isAuthenticated &&
        userSession.hasCompletedOnboarding &&
        appState !== "test" && (
          <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border md:hidden z-30">
            <div className="container mx-auto px-4 py-2">
              <div className="flex items-center justify-around">
                <button
                  onClick={() => handleNavigation("dashboard")}
                  className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                    appState === "dashboard"
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="w-5 h-5">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                    </svg>
                  </div>
                  <span className="text-xs">Home</span>
                </button>

                <button
                  onClick={() => handleNavigation("test")}
                  className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                    appState === "test"
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="w-5 h-5">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                      <polyline points="14,2 14,8 20,8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10,9 9,9 8,9" />
                    </svg>
                  </div>
                  <span className="text-xs">Tests</span>
                </button>

                <button
                  onClick={() => handleNavigation("social")}
                  className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                    appState === "social"
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="w-5 h-5">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="m22 21-3-3m0 0-3-3m3 3 3-3m-3 3-3 3" />
                    </svg>
                  </div>
                  <span className="text-xs">Social</span>
                </button>
              </div>
            </div>
          </nav>
        )}
    </div>
  );
}
