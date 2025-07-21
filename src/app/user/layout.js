"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import useAuth from "@/hooks/useAuth";
import { Toaster } from "sonner";
import MoviesModals from "../movies/[id]/_components/movies-modals";
import { Suspense } from "react";


export default function UserLayout({ children }) {

  const {user} = useAuth();

  return (
    <>
        <Navbar user={user} />
        <Suspense><div className="w-10/12 mx-auto mt-[300px] sm:mt-[180px] md:mt-[200px] min-h-screen">{children}</div></Suspense>
        <MoviesModals/>
        <Toaster />
        <Footer />
    </>
  );
}