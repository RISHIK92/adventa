"use client";

export default function SimpleCenteredWithGradient() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-br from-[var(--primary)] via-[var(--accent)] to-[var(--secondary)]">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
            Ready to Crack JEE & NEET?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg/8 text-pretty text-white">
            Join thousands of successful students who trusted our AI-powered
            preparation platform. Start your free trial today and experience the
            difference.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-[#ff6b35] hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
            >
              Start Free Trial
            </a>
            <a
              href="#"
              className="text-sm/6 font-semibold text-white hover:text-white/80 transition-colors"
            >
              Contact Support <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center gap-x-8 text-sm text-white">
            <span>No Credit Card Required</span>
            <span>Cancel Anytime</span>
          </div>
        </div>
      </div>
      <svg
        viewBox="0 0 1024 1024"
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -z-10 size-256 -translate-x-1/2 mask-[radial-gradient(closest-side,white,transparent)]"
      >
        <circle
          r={512}
          cx={512}
          cy={512}
          fill="url(#8d958450-c69f-4251-94bc-4e091a323369)"
          fillOpacity="0.3"
        />
        <defs>
          <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
            <stop stopColor="var(--primary)" />
            <stop offset={1} stopColor="var(--secondary)" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
