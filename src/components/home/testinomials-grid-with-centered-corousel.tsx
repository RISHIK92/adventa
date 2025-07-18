"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { Transition } from "@headlessui/react";
import { Trophy, Medal, Award } from "lucide-react";

export function TestimonialsGridWithCenteredCarousel() {
  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 md:px-8 pt-20 overflow-hidden h-full bg-background">
      <div className="pb-20">
        <h1 className="pt-4 font-bold text-neutral-text text-lg md:text-2xl">
          Success Stories from JEE & NEET Champions
        </h1>
        <p className="text-base text-muted-foreground">
          PrepAI has helped thousands of students achieve their dreams of
          getting into top medical and engineering colleges.
        </p>
      </div>

      <div className="relative">
        <TestimonialsSlider />
        <div className="h-full max-h-screen md:max-h-none overflow-hidden w-full bg-muted opacity-30 [mask-image:radial-gradient(circle_at_center,transparent_10%,white_99%)]">
          <TestimonialsGrid />
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-40 w-full bg-gradient-to-t from-background to-transparent"></div>
    </div>
  );
}

export const TestimonialsGrid = () => {
  const first = testimonials.slice(0, 3);
  const second = testimonials.slice(3, 6);
  const third = testimonials.slice(6, 9);
  const fourth = testimonials.slice(9, 12);

  const grid = [first, second, third, fourth];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
      {grid.map((testimonialsCol, index) => (
        <div key={`testimonials-col-${index}`} className="grid gap-4">
          {testimonialsCol.map((testimonial) => (
            <Card key={`testimonial-${testimonial.src}-${index}`}>
              <Quote>{testimonial.quote}</Quote>
              <div className="flex gap-2 items-center mt-8">
                <img
                  src={testimonial.src}
                  alt={testimonial.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex flex-col">
                  <QuoteDescription className="font-semibold text-neutral-text">
                    {testimonial.name}
                  </QuoteDescription>
                  <QuoteDescription className="text-[10px] text-muted-foreground">
                    {testimonial.designation}
                  </QuoteDescription>
                  {testimonial.achievement && (
                    <div className="flex items-center gap-1 mt-1">
                      <Award className="h-3 w-3 text-primary" />
                      <QuoteDescription className="text-[10px] text-primary font-medium">
                        {testimonial.achievement}
                      </QuoteDescription>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "p-8 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-200",
        className
      )}
    >
      {children}
    </div>
  );
};

export const Quote = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        "text-xs font-semibold text-neutral-text py-2 leading-relaxed",
        className
      )}
    >
      {children}
    </h3>
  );
};

export const QuoteDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        "text-xs font-normal text-muted-foreground max-w-sm",
        className
      )}
    >
      {children}
    </p>
  );
};

interface Testimonial {
  src: string;
  quote: string;
  name: string;
  designation?: string;
  achievement?: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Priya Sharma",
    quote:
      "PrepAI helped me identify my weak areas and improve systematically. The AI-powered analysis was incredibly accurate and helped me focus on what mattered most.",
    src: "https://i.pravatar.cc/150?img=1",
    designation: "IIT Delhi, Computer Science",
    achievement: "AIR 245 in JEE Advanced",
  },
  {
    name: "Rahul Kumar",
    quote:
      "The mock tests were exactly like the real NEET exam. PrepAI's adaptive learning system helped me improve my speed and accuracy significantly.",
    src: "https://i.pravatar.cc/150?img=2",
    designation: "AIIMS Delhi, MBBS",
    achievement: "NEET Score: 650+, AIR 1,200",
  },
  {
    name: "Arjun Patel",
    quote:
      "PrepAI's personalized study plan was a game-changer. It helped me balance JEE prep with board exams perfectly and guided me to my dream college.",
    src: "https://i.pravatar.cc/150?img=3",
    designation: "IIT Bombay, Electrical Engineering",
    achievement: "AIR 156 in JEE Advanced",
  },
  {
    name: "Sneha Gupta",
    quote:
      "The detailed performance analytics helped me understand my strengths and weaknesses. PrepAI's doubt resolution was incredibly helpful during my preparation.",
    src: "https://i.pravatar.cc/150?img=4",
    designation: "JIPMER Puducherry, MBBS",
    achievement: "NEET Score: 680+, AIR 890",
  },
  {
    name: "Karan Singh",
    quote:
      "PrepAI's adaptive testing helped me improve my JEE Mains score from 85 percentile to 99.2 percentile. The AI recommendations were spot-on.",
    src: "https://i.pravatar.cc/150?img=5",
    designation: "IIT Kanpur, Mechanical Engineering",
    achievement: "99.2 percentile in JEE Mains",
  },
  {
    name: "Ananya Reddy",
    quote:
      "The comprehensive question bank and previous year analysis helped me crack NEET with confidence. PrepAI made my preparation structured and efficient.",
    src: "https://i.pravatar.cc/150?img=6",
    designation: "MAMC Delhi, MBBS",
    achievement: "NEET Score: 645+, AIR 1,450",
  },
  {
    name: "Vikram Joshi",
    quote:
      "PrepAI's time management strategies and mock tests were exactly what I needed. The platform helped me achieve my goal of getting into IIT.",
    src: "https://i.pravatar.cc/150?img=7",
    designation: "IIT Madras, Chemical Engineering",
    achievement: "AIR 189 in JEE Advanced",
  },
  {
    name: "Meera Agarwal",
    quote:
      "The AI-powered study recommendations saved me months of preparation time. PrepAI helped me focus on high-yield topics for NEET.",
    src: "https://i.pravatar.cc/150?img=8",
    designation: "KGMU Lucknow, MBBS",
    achievement: "NEET Score: 620+, AIR 2,100",
  },
  {
    name: "Rohan Mehta",
    quote:
      "PrepAI's comprehensive analysis of my performance helped me improve consistently. The platform's guidance was crucial for my JEE success.",
    src: "https://i.pravatar.cc/150?img=9",
    designation: "IIT Kharagpur, Civil Engineering",
    achievement: "AIR 298 in JEE Advanced",
  },
  {
    name: "Divya Nair",
    quote:
      "The mock tests felt like the real NEET exam. PrepAI's adaptive learning helped me improve my Biology and Chemistry scores significantly.",
    src: "https://i.pravatar.cc/150?img=10",
    designation: "CMC Vellore, MBBS",
    achievement: "NEET Score: 665+, AIR 1,050",
  },
  {
    name: "Aditya Sharma",
    quote:
      "PrepAI's personalized approach made all the difference. The platform helped me overcome my weaknesses in Physics and secure a top rank.",
    src: "https://i.pravatar.cc/150?img=11",
    designation: "IIT Roorkee, Electronics Engineering",
    achievement: "AIR 167 in JEE Advanced",
  },
  {
    name: "Kavya Iyer",
    quote:
      "The detailed explanations and adaptive practice sessions helped me master NEET concepts. PrepAI made my dream of becoming a doctor come true.",
    src: "https://i.pravatar.cc/150?img=12",
    designation: "AFMC Pune, MBBS",
    achievement: "NEET Score: 635+, AIR 1,680",
  },
];

export const TestimonialsSlider = () => {
  const [active, setActive] = useState<number>(0);
  const [autorotate, setAutorotate] = useState<boolean>(true);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  const slicedTestimonials = testimonials.slice(0, 3);

  useEffect(() => {
    if (!autorotate) return;
    const interval = setInterval(() => {
      setActive(
        active + 1 === slicedTestimonials.length ? 0 : (active) => active + 1
      );
    }, 7000);
    return () => clearInterval(interval);
  }, [active, autorotate, slicedTestimonials.length]);

  const heightFix = () => {
    if (testimonialsRef.current && testimonialsRef.current.parentElement)
      testimonialsRef.current.parentElement.style.height = `${testimonialsRef.current.clientHeight}px`;
  };

  useEffect(() => {
    heightFix();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        heightFix();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <section className="absolute inset-0 mt-20 md:mt-60">
      <div className="max-w-3xl mx-auto relative z-40 h-80">
        <div className="relative pb-12 md:pb-20">
          {/* Carousel */}
          <div className="text-center">
            {/* Testimonial image */}
            <div className="relative h-40 [mask-image:_linear-gradient(0deg,transparent,#FFFFFF_30%,#FFFFFF)] md:[mask-image:_linear-gradient(0deg,transparent,#FFFFFF_40%,#FFFFFF)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-[480px] -z-10 pointer-events-none before:rounded-full rounded-full before:absolute before:inset-0 before:bg-gradient-to-b before:from-primary/20 before:to-transparent before:to-20% after:rounded-full after:absolute after:inset-0 after:bg-card after:m-px before:-z-20 after:-z-20">
                {slicedTestimonials.map((item, index) => (
                  <Transition
                    key={index}
                    show={active === index}
                    enter="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-700 order-first"
                    enterFrom="opacity-0 -translate-x-10"
                    enterTo="opacity-100 translate-x-0"
                    leave="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-700"
                    leaveFrom="opacity-100 translate-x-0"
                    leaveTo="opacity-0 translate-x-10"
                    beforeEnter={() => heightFix()}
                    as="div"
                  >
                    <div className="absolute inset-0 h-full -z-10">
                      <div className="relative top-11 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <img
                          className="rounded-full"
                          src={item.src}
                          width={56}
                          height={56}
                          alt={item.name}
                        />
                      </div>
                    </div>
                  </Transition>
                ))}
              </div>
            </div>
            {/* Text */}
            <div className="mb-10 transition-all duration-150 delay-300 ease-in-out px-8 sm:px-6">
              <div className="relative flex flex-col" ref={testimonialsRef}>
                {slicedTestimonials.map((item, index) => (
                  <Transition
                    key={index}
                    show={active === index}
                    enter="transition ease-in-out duration-500 delay-200 order-first"
                    enterFrom="opacity-0 -translate-x-4"
                    enterTo="opacity-100 translate-x-0"
                    leave="transition ease-out duration-300 delay-300 absolute"
                    leaveFrom="opacity-100 translate-x-0"
                    leaveTo="opacity-0 translate-x-4"
                    beforeEnter={() => heightFix()}
                    as="div"
                  >
                    <div className="text-base text-neutral-text md:text-xl font-bold mb-4">
                      "{item.quote}"
                    </div>
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <Trophy className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        {item.achievement}
                      </span>
                    </div>
                  </Transition>
                ))}
              </div>
            </div>
            {/* Buttons */}
            <div className="flex flex-wrap justify-center -m-1.5 px-8 sm:px-6">
              {slicedTestimonials.map((item, index) => (
                <button
                  className={cn(
                    `px-4 py-2 rounded-full m-1.5 text-xs border transition duration-150 ease-in-out ${
                      active === index
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-card text-neutral-text hover:border-primary/50"
                    }`
                  )}
                  key={index}
                  onClick={() => {
                    setActive(index);
                    setAutorotate(false);
                  }}
                >
                  <span className="font-semibold">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
