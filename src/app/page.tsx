"use client";

import type React from "react";

import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  ClipboardCheck,
  Zap,
  Target,
  TrendingUp,
  Sparkles,
  Award,
  Clock,
  BarChart3,
  Eye,
  Lightbulb,
  Rocket,
  Shield,
  CheckCircle,
  ArrowUpRight,
  Play,
  Crown,
  Timer,
  Gauge,
  Trophy,
  Atom,
  Calculator,
  Dna,
  FlaskConical,
  CloudLightningIcon as Lightning,
  Download,
  PlayCircle,
  Volume2,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import GoogleAd from "./ads/HeroToFeatures";

function useCounter(end: number, duration = 2) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isVisible]);

  return { count, setIsVisible };
}

// Animated mathematical formula component
const AnimatedFormula = ({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className: string;
  delay?: number;
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
    animate={{
      opacity: [0.3, 0.7, 0.3],
      scale: [0.8, 1, 0.8],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.div>
);

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const videoRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const featuresInView = useInView(featuresRef, { once: true });
  const videoInView = useInView(videoRef, { once: true });

  // Parallax effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], ["0%", "25%"]);

  // Counter hooks
  const successRate = useCounter(99, 2);
  const learningSpeed = useCounter(3, 2);
  const support = useCounter(24, 1.5);

  useEffect(() => {
    if (heroInView) {
      successRate.setIsVisible(true);
      learningSpeed.setIsVisible(true);
      support.setIsVisible(true);
    }
  }, [heroInView]);

  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      {/* Animated Background Formulas */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ y: backgroundY }}
      >
        <AnimatedFormula
          className="absolute top-20 left-10 text-6xl font-serif text-primary/100 transform sm:block hidden -rotate-12 select-none"
          delay={0}
        >
          ∫f(x)dx
        </AnimatedFormula>

        <AnimatedFormula
          className="absolute top-20 right-20 text-4xl font-serif text-accent/50 transform sm:block hidden rotate-6 select-none"
          delay={0.5}
        >
          x = (-b ± √(b² - 4ac)) / 2a
        </AnimatedFormula>

        <AnimatedFormula
          className="absolute bottom-40 left-20 text-5xl font-serif text-secondary/50 transform sm:block hidden rotate-12 select-none"
          delay={1}
        >
          e^(iπ) + 1 = 0
        </AnimatedFormula>

        <AnimatedFormula
          className="absolute top-1/3 left-1/4 text-3xl font-serif text-accent/50 transform sm:block hidden -rotate-6 select-none"
          delay={1.5}
        >
          lim(x→0) sin(x)/x = 1
        </AnimatedFormula>

        <AnimatedFormula
          className="absolute bottom-20 right-10 text-4xl font-serif text-primary/50 transform sm:block hidden rotate-8 select-none"
          delay={2}
        >
          a² + b² = c²
        </AnimatedFormula>

        <AnimatedFormula
          className="absolute top-40 left-1/3 text-3xl font-serif text-accent/50 transform sm:block hidden -rotate-3 select-none"
          delay={2.5}
        >
          ∂f/∂x = dy/dx
        </AnimatedFormula>

        <AnimatedFormula
          className="absolute top-96 right-24 text-5xl font-serif text-primary/50 transform sm:block hidden rotate-15 select-none"
          delay={3}
        >
          E = mc²
        </AnimatedFormula>

        <AnimatedFormula className="absolute top-[550px] left-1/3 text-3xl font-serif text-primary/100 transform sm:block hidden -rotate-12 select-none">
          {" "}
          C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O
        </AnimatedFormula>

        <AnimatedFormula
          className="absolute top-[450px] left-24 text-4xl font-serif text-primary/100 transform sm:block hidden -rotate-8 select-none"
          delay={3.5}
        >
          F = ma
        </AnimatedFormula>

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/50 to-background/85"></div>
      </motion.div>

      <main className="flex-grow relative z-10">
        {/* Hero Section */}
        <motion.div
          ref={heroRef}
          className="container mx-auto px-4 pt-16 pb-8"
          style={{ y: heroY }}
        >
          <div className="text-center max-w-5xl mx-auto">
            {/* Animated Badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <Sparkles className="h-4 w-4 text-primary" />
              </motion.div>
              <span className="text-sm font-medium text-primary">
                AI-Powered Learning Revolution
              </span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                <Lightning className="h-4 w-4 text-primary" />
              </motion.div>
            </motion.div>

            {/* Main Heading with enhanced styling */}
            <motion.h1
              className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Vertical Ascent
            </motion.h1>

            {/* Subheading */}
            <motion.p
              className="text-xl md:text-2xl text-muted-foreground mb-4 font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Where Intelligence Meets{" "}
              <span className="text-primary font-semibold">Ambition</span>
            </motion.p>

            {/* Description */}
            <motion.p
              className="text-lg md:text-xl text-muted-foreground/50 mb-8 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Your AI-powered companion for JEE & NEET domination. We don't just
              teach - we transform your thinking, predict your potential, and
              accelerate your journey to the top.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Your AI Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-transparent"
                >
                  <Play className="mr-2 h-5 w-5" />
                  See How It Works
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                <motion.div
                  className="text-3xl font-bold text-primary mb-2"
                  key={successRate.count}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {successRate.count}%
                </motion.div>
                <div className="text-sm text-muted-foreground">
                  Success Rate
                </div>
              </motion.div>

              <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                <motion.div
                  className="text-3xl font-bold text-accent mb-2"
                  key={learningSpeed.count}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {learningSpeed.count}x
                </motion.div>
                <div className="text-sm text-muted-foreground">
                  Faster Learning
                </div>
              </motion.div>

              <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                <motion.div
                  className="text-3xl font-bold text-primary mb-2"
                  key={support.count}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {support.count}/7
                </motion.div>
                <div className="text-sm text-muted-foreground">AI Support</div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <div className="w-full max-w-3xl">
          <GoogleAd slot="8219899582" />
        </div>

        {/* Demo Video Section */}
        <motion.div
          ref={videoRef}
          className="container mx-auto px-4 py-16"
          initial={{ opacity: 0 }}
          animate={videoInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={videoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              See Vertical Ascent in Action
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch how our AI transforms learning into an engaging,
              personalized experience
            </p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={videoInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative group">
              {/* Video Container */}
              <motion.div
                className="relative bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-2xl p-8 backdrop-blur-sm border border-primary/20 overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated background elements */}
                <motion.div
                  className="absolute top-4 right-4 w-20 h-20 bg-primary/10 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />

                <motion.div
                  className="absolute bottom-4 left-4 w-16 h-16 bg-accent/10 rounded-full"
                  animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [360, 180, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />

                {/* Autoplay Video */}
                <div className="relative aspect-video bg-gradient-to-br from-card to-muted rounded-xl overflow-hidden border border-border/50">
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    src="/demo-video.mp4"
                  >
                    {/* Fallback for browsers that don't support video */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white/80">
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                        >
                          <Volume2 className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm">Video not supported</p>
                        </motion.div>
                      </div>
                    </div>
                  </video>

                  {/* Subtle overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </div>

                {/* Video Info */}
                <motion.div
                  className="mt-6 flex items-center justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  animate={videoInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      AI-Powered Learning Experience
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      See how our platform adapts to your learning style
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          ref={featuresRef}
          className="container mx-auto px-4 py-16"
          initial={{ opacity: 0 }}
          animate={featuresInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Learning Arsenal
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose your weapon of mass instruction. Each path is designed to
              unlock your potential.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Vertical Ascent Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -10 }}
            >
              <Card className="group transform transition-all duration-500 hover:shadow-2xl bg-gradient-to-br from-card/95 to-primary/5 backdrop-blur-sm border-2 hover:border-primary/30 overflow-hidden relative h-full">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />
                <CardHeader className="relative z-10">
                  <div className="mb-6 flex justify-center">
                    <motion.div
                      className="rounded-full bg-primary/20 p-6 group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <BookOpen className="h-12 w-12 text-primary" />
                    </motion.div>
                  </div>
                  <CardTitle className="font-headline text-2xl mb-2 text-center">
                    Vertical Ascent
                  </CardTitle>
                  <CardDescription className="text-center text-base leading-relaxed">
                    Embark on a structured learning odyssey. From fundamentals
                    to mastery, our AI guides you through every concept with
                    precision.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 0 }}
                    animate={featuresInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Adaptive Learning Paths</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Interactive Concepts</span>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Progress Tracking</span>
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      asChild
                      size="lg"
                      className="w-full group-hover:bg-primary/50 transition-colors"
                    >
                      <Link href="/learning">
                        Begin Your Ascent
                        <motion.div
                          className="ml-2"
                          animate={{ x: [0, 5, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </motion.div>
                      </Link>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quiz Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ y: -10 }}
            >
              <Card className="group transform transition-all duration-500 hover:shadow-2xl bg-gradient-to-br from-card/95 to-accent/5 backdrop-blur-sm border-2 hover:border-accent/30 overflow-hidden relative h-full">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />
                <CardHeader className="relative z-10">
                  <div className="mb-6 flex justify-center">
                    <motion.div
                      className="rounded-full bg-accent/20 p-6 group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <BrainCircuit className="h-12 w-12 text-accent" />
                    </motion.div>
                  </div>
                  <CardTitle className="font-headline text-2xl mb-2 text-center">
                    AI Quiz Arena
                  </CardTitle>
                  <CardDescription className="text-center text-base leading-relaxed">
                    Challenge your mind with AI-generated questions that adapt
                    to your skill level. Every question is a step toward
                    excellence.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 0 }}
                    animate={featuresInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 1 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Lightning className="h-4 w-4 text-accent" />
                      <span className="text-sm">Instant AI Feedback</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-accent" />
                      <span className="text-sm">Personalized Difficulty</span>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="h-4 w-4 text-accent" />
                      <span className="text-sm">Performance Analytics</span>
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      asChild
                      size="lg"
                      variant="secondary"
                      className="w-full group-hover:bg-accent/50 group-hover:text-accent-foreground transition-colors"
                    >
                      <Link href="/quiz">
                        Enter the Arena
                        <motion.div
                          className="ml-2"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                        >
                          <Zap className="h-4 w-4" />
                        </motion.div>
                      </Link>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mock Test Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ y: -10 }}
              className="md:col-span-2 lg:col-span-1"
            >
              <Card className="group transform transition-all duration-500 hover:shadow-2xl bg-gradient-to-br from-card/95 to-secondary/5 backdrop-blur-sm border-2 hover:border-secondary/30 overflow-hidden relative h-full">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />
                <CardHeader className="relative z-10">
                  <div className="mb-6 flex justify-center">
                    <motion.div
                      className="rounded-full bg-secondary/20 p-6 group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <ClipboardCheck className="h-12 w-12 text-secondary-foreground" />
                    </motion.div>
                  </div>
                  <CardTitle className="font-headline text-2xl mb-2 text-center">
                    Mock Test Simulator
                  </CardTitle>
                  <CardDescription className="text-center text-base leading-relaxed">
                    Experience the real deal with our advanced exam simulator.
                    Time pressure, real questions, instant analysis.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 0 }}
                    animate={featuresInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 1.2 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-secondary-foreground" />
                      <span className="text-sm">Timed Exam Environment</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-secondary-foreground" />
                      <span className="text-sm">Detailed Analysis</span>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="h-4 w-4 text-secondary-foreground" />
                      <span className="text-sm">Performance Ranking</span>
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      asChild
                      size="lg"
                      variant="secondary"
                      className="w-full group-hover:bg-secondary/50 transition-colors"
                    >
                      <Link href="/test">
                        Start Simulation
                        <motion.div
                          className="ml-2"
                          animate={{ rotate: [0, 360] }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        >
                          <Timer className="h-4 w-4" />
                        </motion.div>
                      </Link>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* AI Features Highlight */}
        <motion.div
          className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                The AI Advantage
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience learning like never before with our intelligent
                companion
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Eye,
                  title: "Predictive Analysis",
                  desc: "Foresee your performance before you even take the test",
                  color: "primary",
                },
                {
                  icon: Lightbulb,
                  title: "Smart Insights",
                  desc: "Uncover hidden patterns in your learning journey",
                  color: "accent",
                },
                {
                  icon: Shield,
                  title: "Adaptive Learning",
                  desc: "Content that evolves with your understanding",
                  color: "secondary",
                },
                {
                  icon: Gauge,
                  title: "Real-time Optimization",
                  desc: "Continuously improving your study efficiency",
                  color: "primary",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/20"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.5,
                    }}
                  >
                    <item.icon
                      className={`h-8 w-8 text-${item.color} mx-auto mb-4`}
                    />
                  </motion.div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="text-white text-center w-full max-w-4xl">
          <GoogleAd slot="8345728951" adFormat="autorelaxed" />
        </div>

        {/* Subject Icons Section */}
        <motion.div
          className="py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Master Every Subject
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                From atoms to algorithms, we've got you covered
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: Calculator,
                  title: "Mathematics",
                  desc: "Calculus to Complex Numbers",
                  color: "primary",
                },
                {
                  icon: Atom,
                  title: "Physics",
                  desc: "Mechanics to Quantum",
                  color: "accent",
                },
                {
                  icon: FlaskConical,
                  title: "Chemistry",
                  desc: "Organic to Inorganic",
                  color: "secondary",
                },
                {
                  icon: Dna,
                  title: "Biology",
                  desc: "Cell to Ecosystem",
                  color: "primary",
                },
              ].map((subject, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className={`w-16 h-16 mx-auto mb-4 bg-${subject.color}/10 rounded-full flex items-center justify-center group-hover:bg-${subject.color}/20 transition-colors`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <subject.icon className={`h-8 w-8 text-${subject.color}`} />
                  </motion.div>
                  <h3 className="font-semibold text-lg">{subject.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {subject.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* SEO Content Section */}
        <motion.div
          className="py-20 bg-muted/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Your Ultimate JEE & NEET Resource Hub
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Access comprehensive, topic-wise, and sub-topic wise formula
                sheets and cheatsheets. Everything you need for JEE (Main &
                Advanced) and NEET, right at your fingertips.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Calculator,
                  title: "Mathematics",
                  desc: "Complete JEE formula sheets for every chapter.",
                  topics: [
                    "Calculus & Integration",
                    "Algebra & Quadratic Equations",
                    "Trigonometry & Inverse Functions",
                    "Coordinate Geometry & Conic Sections",
                    "Vectors & 3D Geometry",
                    "Probability & Statistics",
                  ],
                },
                {
                  icon: Atom,
                  title: "Physics",
                  desc: "NEET & JEE cheatsheets for quick revision.",
                  topics: [
                    "Mechanics & Laws of Motion",
                    "Thermodynamics & Kinetic Theory",
                    "Electrostatics & Magnetism",
                    "Ray & Wave Optics",
                    "Modern Physics & Semiconductors",
                    "Rotational Motion Formulas",
                  ],
                },
                {
                  icon: FlaskConical,
                  title: "Chemistry",
                  desc: "Organic, Inorganic, and Physical formula lists.",
                  topics: [
                    "Mole Concept & Stoichiometry",
                    "Chemical Bonding & Structure",
                    "Equilibrium (Chemical & Ionic)",
                    "General Organic Chemistry (GOC)",
                    "p-Block & d-Block Elements",
                    "Biomolecules & Polymers",
                  ],
                },
                {
                  icon: Dna,
                  title: "Biology",
                  desc: "NEET-focused cheatsheets and important diagrams.",
                  topics: [
                    "Human & Plant Physiology",
                    "Genetics & Evolution",
                    "Cell Biology & Division",
                    "Ecology & Environment",
                    "Diversity in Living World",
                    "Biotechnology Principles",
                  ],
                },
              ].map((subject, index) => (
                <motion.div
                  key={index}
                  className="relative bg-card p-6 pt-6 pb-10 rounded-lg border"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <subject.icon className="h-8 w-8 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-bold">{subject.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {subject.desc}
                  </p>
                  <ul className="space-y-2 text-sm">
                    {subject.topics.map((topic, topicIndex) => (
                      <motion.li
                        key={topicIndex}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.1 + topicIndex * 0.05,
                        }}
                        viewport={{ once: true }}
                      >
                        {topic}
                      </motion.li>
                    ))}
                  </ul>
                  <p className="absolute bottom-3 right-4 text-xs text-muted-foreground">
                    and many more
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <GoogleAd slot="7058366314" />

        <motion.div
          className="py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Practice, Revise, and Conquer - All For Free
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Supercharge your JEE & NEET preparation with our suite of free
                tools. No hidden costs, just pure learning.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Unlimited Free Quizzes",
                  desc: "Test your knowledge with endless chapter-wise and topic-wise quizzes for JEE and NEET. Our AI generates questions that mirror the real exam pattern, helping you build speed and accuracy.",
                  color: "accent",
                },
                {
                  icon: Download,
                  title: "Cheatsheets and Formulasheets",
                  desc: "Get instant access to our expertly curated formula sheets for Physics, Chemistry, and Maths. Perfect for quick revisions and reinforcing key concepts before your exam.",
                  color: "primary",
                },
                {
                  icon: BarChart3,
                  title: "Free Performance Insights",
                  desc: "Don't just practice; practice smart. After every quiz, get a free, detailed analysis of your performance. Identify your weak spots and track your progress over time.",
                  color: "secondary",
                },
              ].map((resource, index) => (
                <motion.div
                  key={index}
                  className={`group bg-card p-6 rounded-lg border border-transparent hover:border-${
                    resource.color
                  } transition-colors duration-300 hover:shadow-lg ${
                    index === 2 ? "md:col-span-2 lg:col-span-1" : ""
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div
                      className={`bg-${resource.color}/10 p-3 rounded-full`}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <resource.icon
                        className={`h-6 w-6 text-${resource.color}`}
                      />
                    </motion.div>
                    <h3 className="text-xl font-bold">{resource.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    {resource.desc}
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button variant="outline" className="w-full bg-transparent">
                      {index === 0
                        ? "Take a Free Quiz Now"
                        : index === 1
                        ? "Get Your Free Cheatsheets"
                        : "Analyze Your Skills for Free"}
                      <motion.div
                        className="ml-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </Button>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Final CTA Section */}
        <motion.div
          className="bg-gradient-to-r from-primary via-accent to-secondary py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              animate={{ rotate: [0, 10, -10, 0] }}
              style={{ transition: "4s infinite" }}
            >
              <Crown className="h-16 w-16 text-white mx-auto mb-6" />
            </motion.div>

            <motion.h2
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Ready to Rule Your Exams?
            </motion.h2>

            <motion.p
              className="text-xl text-white/50 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Join thousands of students who've transformed their potential into
              performance
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              viewport={{ once: true }}
            >
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Trophy className="mr-2 h-5 w-5" />
                Begin Your Transformation
                <motion.div
                  className="ml-2"
                  animate={{ rotate: [0, 45, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <ArrowUpRight className="h-5 w-5" />
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
