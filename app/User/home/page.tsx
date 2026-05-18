import HoroscopeSection from "./HoroscopeSection";
import UserLiveSessions from "./UserLiveSessions";
import ReikiHealing from "./ReikiHealing";
import VastuServices from "./VastuServices";
import FeaturedAstrologer from "./FeaturedAstrologer";

import TrendingCards from "./TrendingCards";
export default function HomePage() {
  return (
    <div className="ml-1">
      <HoroscopeSection />

      <UserLiveSessions />

      <FeaturedAstrologer />
      <ReikiHealing />
      <VastuServices />
      <TrendingCards />
    </div>
  );
}
