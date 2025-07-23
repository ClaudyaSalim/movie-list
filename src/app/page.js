"use client"
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const router = useRouter();
  const {user, role} = useAuth();

  useEffect(()=> {
    if(role==="admin"){
      router.push("/admin");
    }
    else {
      router.push("/movies");
    }
  }, [role]);
}
