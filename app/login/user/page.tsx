import EmailAccessCard from "@/app/components/AuthPage/EmailAccessCard";
import AutoLoginRedirect from "../../components/AutoLoginRedirect";

export default function UserLoginPage() {
  return (
    <>
      <AutoLoginRedirect />
      <EmailAccessCard role="user" mode="login" />
    </>
  );
}
