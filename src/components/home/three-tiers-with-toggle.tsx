"use client";

import { Check } from "lucide-react";

const tiers = [
  {
    id: "basic",
    name: "Basic",
    price: { monthly: "₹499", annually: "₹299" },
    description: "Perfect for getting started with essential study tools.",
    features: [
      "AI Quizzes",
      "Basic Mock Tests",
      "Formula Sheets",
      "7-Day Free Trial",
    ],
    featured: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: { monthly: "₹999", annually: "₹599" },
    description: "Everything you need for comprehensive exam preparation.",
    features: [
      "Everything in Basic",
      "Advanced Analytics",
      "Dynamic Timetables",
      "Previous Year Questions",
      "Unlimited Mock Tests",
      "7-Day Free Trial",
    ],
    featured: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: { monthly: "₹1499", annually: "₹899" },
    description:
      "Ultimate preparation with personalized guidance and priority support.",
    features: [
      "Everything in Premium",
      "Personal Mentor",
      "Priority Support",
      "Exclusive Content",
      "Advanced Study Insights",
      "7-Day Free Trial",
    ],
    featured: false,
  },
];

export default function ThreeTiersWithToggle() {
  return (
    <form className="group/tiers bg-[var(--background)] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base/7 font-semibold text-[var(--primary)]">Pricing</h2>
          <p className="mt-2 text-5xl font-bold tracking-tight text-balance text-[var(--foreground)] sm:text-6xl">
            Choose Your Study Plan
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-pretty text-[var(--muted-foreground)] sm:text-xl/8">
          Select an affordable plan designed for student success. All plans
          include a 7-day free trial to help you ace your exams.
        </p>
        <div className="mt-16 flex justify-center">
          <fieldset aria-label="Payment frequency">
            <div className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs/5 font-semibold ring-1 ring-[var(--border)] ring-inset bg-[var(--card)]">
              <label className="group relative rounded-full px-2.5 py-1 has-checked:bg-[var(--primary)]">
                <input
                  defaultValue="monthly"
                  defaultChecked
                  name="frequency"
                  type="radio"
                  className="absolute inset-0 appearance-none rounded-full"
                />
                <span className="text-[var(--muted-foreground)] group-has-checked:text-[var(--primary-foreground)]">
                  Monthly
                </span>
              </label>
              <label className="group relative rounded-full px-2.5 py-1 has-checked:bg-[var(--primary)]">
                <input
                  defaultValue="annually"
                  name="frequency"
                  type="radio"
                  className="absolute inset-0 appearance-none rounded-full"
                />
                <span className="text-[var(--muted-foreground)] group-has-checked:text-[var(--primary-foreground)]">
                  Annually
                </span>
              </label>
            </div>
          </fieldset>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-[var(--secondary)]">
            💰 Save 40% with yearly billing!
          </p>
        </div>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              data-featured={tier.featured ? "true" : undefined}
              className="group/tier rounded-3xl p-8 ring-1 ring-[var(--border)] data-featured:ring-2 data-featured:ring-[var(--primary)] bg-[var(--card)] xl:p-10"
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={`tier-${tier.id}`}
                  className="text-lg/8 font-semibold text-[var(--foreground)] group-data-featured/tier:text-[var(--primary)]"
                >
                  {tier.name}
                </h3>
                <p className="rounded-full bg-[var(--primary)]/10 px-2.5 py-1 text-xs/5 font-semibold text-[var(--primary)] group-not-data-featured/tier:hidden">
                  Most Popular
                </p>
              </div>
              <p className="mt-4 text-sm/6 text-[var(--muted-foreground)]">
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1 group-not-has-[[name=frequency][value=monthly]:checked]/tiers:hidden">
                <span className="text-4xl font-bold tracking-tight text-[var(--foreground)]">
                  {tier.price.monthly}
                </span>
                <span className="text-sm/6 font-semibold text-[var(--muted-foreground)]">
                  /month
                </span>
              </p>
              <p className="mt-6 flex items-baseline gap-x-1 group-not-has-[[name=frequency][value=annually]:checked]/tiers:hidden">
                <span className="text-4xl font-bold tracking-tight text-[var(--foreground)]">
                  {tier.price.annually}
                </span>
                <span className="text-sm/6 font-semibold text-[var(--muted-foreground)]">
                  /year
                </span>
              </p>
              <button
                value={tier.id}
                name="tier"
                type="submit"
                aria-describedby={`tier-${tier.id}`}
                className="mt-6 block w-full rounded-md px-3 py-2 text-center text-sm/6 font-semibold text-[var(--primary)] ring-1 ring-[var(--primary)]/20 ring-inset group-data-featured/tier:bg-[var(--primary)] group-data-featured/tier:text-[var(--primary-foreground)] group-data-featured/tier:shadow-xs group-data-featured/tier:ring-0 hover:ring-[var(--primary)]/30 group-data-featured/tier:hover:bg-[var(--primary)]/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
              >
                Start Free Trial
              </button>
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm/6 text-[var(--muted-foreground)] xl:mt-10"
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check
                      aria-hidden="true"
                      className="h-6 w-5 flex-none text-[var(--secondary)]"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
