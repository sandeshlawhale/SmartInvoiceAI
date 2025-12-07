import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Visuals } from "@/components/landing/visuals";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { FinalCTA } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />

      {/* 
        Main content wrapper 
        - z-10 and bg-background to cover the fixed footer
        - mb-[500px] to create space for the footer to be revealed
        - shadow-2xl to add a nice drop shadow over the footer
      */}
      <main className="relative z-10 bg-background mb-[500px] shadow-2xl rounded-b-3xl border-b">
        <Hero />
        <Visuals />
        <Features />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
