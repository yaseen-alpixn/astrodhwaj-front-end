import ProfileCard from "./ProfileCard";
import AboutSection from "./AboutSection";
import EducationSection from "./EducationSection";
import LanguagesSection from "./LanguagesSection";
import SkillsSection from "./SkillsSection";
import ContactInfo from "./ContactInfo";
import StatCard from "./StatCard";

export default function Profile() {
  return (
    <div className="mx-auto flex w-full flex-col gap-1 space-y-6 p-4 md:p-6 ">
      <ProfileCard />

      <AboutSection />
      <hr className="text-gray-300" />

      <EducationSection />
      <hr className="text-gray-300" />
      <LanguagesSection />
      <hr className="text-gray-300" />
      <SkillsSection />
      <hr className="text-gray-300" />
      <ContactInfo />
      <hr className="text-gray-300" />
      <StatCard />
    </div>
  );
}
