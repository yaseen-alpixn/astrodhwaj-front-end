import ConsultationTypes from "@/app/components/HomePage/ConsultationTypes";
import ServicesSlider from "@/app/components/HomePage/ServicesSlider";
import ServicesStrip from "@/app/components/HomePage/ServicesStrip";
import TopMentors from "@/app/components/HomePage/TopMentors";

export default function ServicePage() {
  return (
    <>
      <ServicesStrip />
      <ServicesSlider />
      <ConsultationTypes />
      <TopMentors />
    </>
  );
}
