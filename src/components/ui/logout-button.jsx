"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import getFirebaseConfig from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();
  const { auth } = getFirebaseConfig();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("You have been logged out.");
      router.push("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}