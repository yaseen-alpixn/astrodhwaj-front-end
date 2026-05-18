import AdminSettingsHeader from "../AdminSettingsHeader";
import EmailSMSSettings from "./EmailSMSSettings";
import AdminTopHeader from "../../CommonComponents/AdminTopHeader";

export default function EmailSMSPage() {
  return (
    <>
      <AdminTopHeader />
      <div className="p-6 bg-white min-h-screen">
        <AdminSettingsHeader />
        <EmailSMSSettings />
      </div>
    </>
  );
}
