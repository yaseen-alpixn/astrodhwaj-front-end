import ProfileCard from "./ProfileCard";
import AboutSection from "./AboutSection";
import EducationSection from "./EducationSection";
import LanguagesSection from "./LanguagesSection";
import SkillsSection from "./SkillsSection";
import ContactInfo from "./ContactInfo";

export default function Profile() {
  return (
    <div className="mx-auto w-full flex flex-col gap-6 p-4 md:p-6">
      <ProfileCard />

      <AboutSection />
      <hr className="border-gray-300" />

      {/* Responsive Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <EducationSection />
        <LanguagesSection />
        <SkillsSection />
      </div>

      <hr className="border-gray-300" />

      <ContactInfo />

      <hr className="border-gray-300" />
    </div>
  );
}
