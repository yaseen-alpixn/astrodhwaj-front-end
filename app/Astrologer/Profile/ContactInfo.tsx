import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactInfo() {
  return (
    <div className="space-y-3">
      <h2 className="font-[DM_Sans] font-semibold text-[18px] capitalize">
        Contact Information
      </h2>

      <div className="flex flex-wrap gap-8 ">
        <div className="flex items-center gap-2">
          <Phone size={16} className="text-[#4898E1]" />
          <span>+91 9876543210</span>
        </div>

        <div className="flex items-center gap-2">
          <Mail size={16} className="text-[#4898E1]" />
          <span>rahul@email.com</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-[#4898E1]" />
          <span>Delhi, India</span>
        </div>
      </div>
    </div>
  );
}
