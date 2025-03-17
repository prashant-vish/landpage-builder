import React, { Children } from "react";
import { Button } from "./ui/button";
interface GoogleSignInButtonProps {
  children: React.ReactNode;
}

const loginwithGoogle = () => { 
  console.log("Login with Google");
}   
const GoogleSignInButton = ({ children }: GoogleSignInButtonProps) => {
  return <Button className="w-full" onClick={loginwithGoogle}>{children}</Button>;
};

export default GoogleSignInButton;
