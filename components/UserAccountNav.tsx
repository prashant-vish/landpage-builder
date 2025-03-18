"use client";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

const UserAccountNav = () => {
  return (
    <div>
      <Button
        className="cursor-pointer"
        variant={"destructive"}
        onClick={() => {
          toast.success("Signed Out! Successfull!", {
            duration: 2000,
            style: {
              backgroundColor: "green",
              color: "white",
            },
            action: {
              label: "✖",
              onClick: () => toast.dismiss(),
            },
          });
          signOut({
            redirect: true,
            callbackUrl: `${window.location.origin}/signin`,
          });
        }}
      >
        Sign out
      </Button>
    </div>
  );
};

export default UserAccountNav;
