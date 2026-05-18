import AdminSettingsHeader from "../AdminSettingsHeader";
import SecuritySettings from "./SecuritySettings";
import AdminTopHeader from "../../CommonComponents/AdminTopHeader";

export default function Page() {
  return (
    <>
      {" "}
      <AdminTopHeader />
      <div className="p-8 bg-violet-50 min-h-screen">
        <AdminSettingsHeader />
        <SecuritySettings />
      </div>
    </>
  );
}
