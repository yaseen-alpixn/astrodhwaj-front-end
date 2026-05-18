import AdminSettingsHeader from "../AdminSettingsHeader";
import GatewaySection from "./GatewaySection";
import AdminTopHeader from "../../CommonComponents/AdminTopHeader";

export default function Page() {
  return (
    <>
      <AdminTopHeader />
      <div className="p-8 bg-white min-h-screen">
        <AdminSettingsHeader />
        <GatewaySection />
      </div>
    </>
  );
}
