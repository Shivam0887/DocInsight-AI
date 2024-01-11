import { SignIn } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn
        afterSignInUrl="/chat"
        appearance={{
          baseTheme: shadesOfPurple,
          variables: {
            colorBackground: "rgb(30, 30, 30)",
          },
        }}
      />
    </div>
  );
}
