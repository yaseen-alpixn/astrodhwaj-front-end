import EmailAccessCard from "@/app/components/AuthPage/EmailAccessCard";
import AutoLoginRedirect from "../../components/AutoLoginRedirect";

export default function AstrologerLoginPage() {
  return (
    <>
      <AutoLoginRedirect />
      <EmailAccessCard role="astrologer" mode="login" />
    </>
  );
}
