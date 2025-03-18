import React, { Children, useState } from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
interface GoogleSignInButtonProps {
  children: React.ReactNode;
}

const GoogleSignInButton = ({ children }: GoogleSignInButtonProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const loginwithGoogle = async () => {
    try {
      setIsLoading(true);
      await signIn("google", { callbackUrl: "http://localhost:3000/admin" });
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      disabled={isLoading}
      className="w-full cursor-pointer"
      onClick={loginwithGoogle}
    >
      {isLoading && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 mr-2 animate-spin"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      )}
      {children}
    </Button>
  );
};

export default GoogleSignInButton;
