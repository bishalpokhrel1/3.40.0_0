import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeatureHighlights from "@/components/FeatureHighlights";
import ExtensionShowcase from "@/components/ExtensionShowcase";
import SyncPreview from "@/components/SyncPreview";
import AIFeatures from "@/components/AIFeatures";
import SocialProof from "@/components/SocialProof";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <FeatureHighlights />
        <ExtensionShowcase />
        <SyncPreview />
        <AIFeatures />
        <SocialProof />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
