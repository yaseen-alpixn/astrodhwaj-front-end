import AdminSettingsHeader from "../AdminSettingsHeader";
import NotificationSection from "./NotificationSection";
import AdminTopHeader from "../../CommonComponents/AdminTopHeader";

export default function Page() {
  return (
    <>
      {" "}
      <AdminTopHeader />
      <div className="p-8 bg-white min-h-screen">
        <AdminSettingsHeader />
        <NotificationSection />
      </div>
    </>
  );
}
