import AdminSettingsHeader from "./AdminSettingsHeader";
import PlatformSettings from "./Platform/PlatformSettings";
import AdminTopHeader from "../CommonComponents/AdminTopHeader";

export default function AdminSettingsPage() {
  return (
    <>
      {" "}
      <AdminTopHeader />
      <div className="min-h-screen bg-white py-8 pl-5 pr-2">
        <AdminSettingsHeader />
        <PlatformSettings />
      </div>
    </>
  );
}
