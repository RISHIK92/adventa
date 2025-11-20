import WithAppScreenshot from "@/components/home/with-app-screenshot";
import { SpotlightLogoCloud } from "@/components/home/spotlight-logo-cloud";
import { ThreeColumnBentoGrid } from "@/components/home/three-column-bento-grid";
import WithProductScreenshot from "@/components/home/with-product-screenshot";
import WithProductScreenshotOnLeft from "@/components/home/with-product-screenshot-left";
import { TestimonialsGridWithCenteredCarousel } from "@/components/home/testinomials-grid-with-centered-corousel";
import ThreeTiersWithToggle from "@/components/home/three-tiers-with-toggle";
import { FrequentlyAskedQuestionsAccordion } from "@/components/home/faqs-with-accordion";
import SimpleCenteredWithGradient from "@/components/home/simple-centered-with-gradient";
import { FooterWithGrid } from "@/components/home/footer-with-grid";
import { CardLayoutHero } from "@/components/home/weakness-card";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <main className="min-h-screen">
      <WithAppScreenshot />
      {/* <SpotlightLogoCloud /> */}
      <ThreeColumnBentoGrid />
      <WithProductScreenshot />
      <WithProductScreenshotOnLeft />
      <CardLayoutHero />
      {/* <TestimonialsGridWithCenteredCarousel /> */}
      {/* <ThreeTiersWithToggle /> */}
      <FrequentlyAskedQuestionsAccordion />
      <SimpleCenteredWithGradient />
      <FooterWithGrid />
    </main>
  );
}
