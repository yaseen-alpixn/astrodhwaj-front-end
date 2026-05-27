import WhoAreYou from "@/app/components/AuthPage/WhoAreYou";
import AutoLoginRedirect from "../components/AutoLoginRedirect";

export default function LoginPage() {
  return (
    <>
      <AutoLoginRedirect />
      <WhoAreYou />
    </>
  );
}
