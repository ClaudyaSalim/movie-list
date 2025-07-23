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
        <Suspense><div className="w-10/12 mx-auto mt-26 md:mt-32 min-h-screen">{children}</div></Suspense>
        <MoviesModals/>
        <Toaster />
        <Footer />
    </>
  );
}