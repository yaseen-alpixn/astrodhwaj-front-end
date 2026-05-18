import AdminSettingsHeader from "./AdminSettingsHeader";
import PlatformSettings from "./Platform/PlatformSettings";
import AdminTopHeader from "../CommonComponents/AdminTopHeader";

export default function AdminSettingsPage() {
  return (
    <>
      {" "}
      <AdminTopHeader />
      <div className="= bg-violet-50 min-h-screen py-8 pl-5 pr-2">
        <AdminSettingsHeader />
        <PlatformSettings />
      </div>
    </>
  );
}
