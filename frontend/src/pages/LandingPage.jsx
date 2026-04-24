import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import ProblemSolution from '../components/landing/ProblemSolution';
import ResearchTimeline from '../components/landing/ResearchTimeline';
import ModelMetrics from '../components/landing/ModelMetrics';
import ArchitectureSection from '../components/landing/ArchitectureSection';
import DatasetSection from '../components/landing/DatasetSection';
import TechStack from '../components/landing/TechStack';
import DeveloperSection from '../components/landing/DeveloperSection';

function LandingPage() {
  return (
    <div className="landing-page">
      <HeroSection />
      <ProblemSolution />
      <ResearchTimeline />
      <ModelMetrics />
      <ArchitectureSection />
      <DatasetSection />
      <TechStack />
      <DeveloperSection />
    </div>
  );
}

export default LandingPage;
