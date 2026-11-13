import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import ProblemSection from '../components/landing/ProblemSection';
import SatelliteSection from '../components/landing/SatelliteSection';
import DataSection from '../components/landing/DataSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import HonestySection from '../components/landing/HonestySection';
import JourneySection from '../components/landing/JourneySection';
import AuthorSection from '../components/landing/AuthorSection';

function LandingPage() {
  return (
    <div className="landing">
      <HeroSection />
      <ProblemSection />
      <SatelliteSection />
      <DataSection />
      <HowItWorksSection />
      <HonestySection />
      <JourneySection />
      <AuthorSection />
    </div>
  );
}

export default LandingPage;
