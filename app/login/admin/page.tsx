import EmailAccessCard from "@/app/components/AuthPage/EmailAccessCard";
import AutoLoginRedirect from "../../components/AutoLoginRedirect";

export default function AdminLoginPage() {
  return (
    <>
      <AutoLoginRedirect />
      <EmailAccessCard role="admin" mode="login" />
    </>
  );
}
