import { SignUp } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp
        afterSignUpUrl="/chat"
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
