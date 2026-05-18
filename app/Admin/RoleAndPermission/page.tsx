import RoleAndPermissionHeader from "./RoleAndPermissionHeader";
import RoleCards from "./RoleCards";
import PermissionMatrix from "./PermissionMatrix";
import AdminTopHeader from "../CommonComponents/AdminTopHeader";

export default function RolesPage() {
  return (
    <>
      {" "}
      <AdminTopHeader />
      <div className="min-h-screen overflow-x-hidden bg-white py-8 pl-5 pr-2 md:p-6 lg:max-w-[900px] xl:max-w-full">
        {" "}
        <RoleAndPermissionHeader />
        <RoleCards />
        <PermissionMatrix />
      </div>
    </>
  );
}
