import { userProfile } from "@/lib/userProfile";
import { redirectToSignIn } from "@clerk/nextjs";

export default function ChatPage() {
  const profile = userProfile();
  if (!profile) redirectToSignIn();

  return <div>ChatPage</div>;
}
