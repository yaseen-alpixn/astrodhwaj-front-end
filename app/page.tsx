import AboutSection from "./components/HomePage/AboutSection";
import ConsultationTypes from "./components/HomePage/ConsultationTypes";
import FeatureCards from "./components/HomePage/FeatureCards";
import Hero from "./components/HomePage/Hero";
import HowItWorks from "./components/HomePage/HowItWorks";
import LiveSessions from "./components/HomePage/LiveSessions";
import SpiritualCTA from "./components/HomePage/SpiritualCTA";
import TopMentors from "./components/HomePage/TopMentors";
import ServicesSlider from "./components/HomePage/ServicesSlider";
import ServicesStrip from "./components/HomePage/ServicesStrip";
import UserTestimonials from "./components/HomePage/UserTestimonials";
import Footer from "./components/layout/Footer";

// import VideoCall from "./calls/VideoCall";
// import AudioCall from "./calls/AudioCall";

export default function Home() {
  return (
    <>
      {/* <VideoCall /> */}
      {/* <AudioCall /> */}

      <Hero />

      <ServicesStrip />
      <ServicesSlider />
      <FeatureCards />
      <ConsultationTypes />
      <LiveSessions />
      <AboutSection />
      <TopMentors />
      <HowItWorks />
      <UserTestimonials />
      <SpiritualCTA />
      <Footer />
    </>
  );
}
