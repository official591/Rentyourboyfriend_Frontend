import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import BrandStatement from "@/components/BrandStatement";
import PeopleSection from "@/components/PeopleSection";
import ExperiencesSection from "@/components/ExperiencesSection";
import CityEditorialSection from "@/components/CityEditorialSection";
import HowItWorks from "@/components/HowItWorks";
import TrustSection from "@/components/TrustSection";
import StoriesSection from "@/components/StoriesSection";
import JournalSection from "@/components/JournalSection";
import MembershipTeaser from "@/components/MembershipTeaser";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-cream text-dark">
      <Navigation />

      {/* 01 Hero Collage with Interactive Selector */}
      <HeroSection />

      {/* 02 Vibrant Cobalt Social Truth Statement */}
      <BrandStatement />

      {/* 03 People Worth Meeting Profile Directory */}
      <PeopleSection />

      {/* 04 Interactive "What's The Vibe?" Selector */}
      <ExperiencesSection />

      {/* 05 Interactive City Explorer Map Canvas */}
      <CityEditorialSection />

      {/* 06 Playful 01 FIND, 02 VIBE, 03 PLAN, 04 GO */}
      <HowItWorks />

      {/* 07 Trust & Safety in Deep Plum */}
      <TrustSection />

      {/* 08 Real Stories Testimonials */}
      <StoriesSection />

      {/* 09 The Companion Edit Digital Culture Magazine */}
      <JournalSection />

      {/* 10 Community Membership Pricing Strip */}
      <MembershipTeaser />

      {/* 11 Final Bold Coral CTA */}
      <FinalCta />

      {/* 12 Deep Plum Footer */}
      <Footer />
    </main>
  );
}
