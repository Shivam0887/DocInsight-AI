import { auth, redirectToSignIn } from "@clerk/nextjs";

export function userProfile() {
  const { userId } = auth();
  if (!userId) redirectToSignIn();

  return userId;
}
