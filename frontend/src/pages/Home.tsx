import React from 'react';
import Hero from './home/Hero';
import Features from './home/Features';
import Testimonials from './home/Testimonials';
import CTA from './home/CTA';
import Banner from './home/Stats';
import MatrimonyAdvantage from './home/matrimonyAdvanced';
import PremiumLanding from './home/PremiumLanding';
// import AssistedService from './home/AssistedServices';

const Home: React.FC = () => {
  return (
    <main className="min-h-screen bg-white">
      <Banner />
      <MatrimonyAdvantage/>
      <Hero />
      <PremiumLanding />
      {/* <AssistedService/> */}
      <Features />
      <Testimonials />
      <CTA />

    </main>
  );
};

export default Home;
