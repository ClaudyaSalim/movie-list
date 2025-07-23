"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import getFirebaseConfig from "@/firebase/config";
import { AddMovieForm } from "./_components/add-movie-form";
import { MoviesTable } from "./_components/movies-table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import { LogoutButton } from "../../components/ui/logout-button";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";


export default function AdminPage() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");

  const router = useRouter();
  const {role} = useAuth();

  const redirect = () => {
    if(role==="user"){
      router.push("/");
    }
  }

  useEffect(()=>{
    redirect();
  }, [role]);


  useEffect(() => {
    async function getMovies() {
      try {
        const { db } = getFirebaseConfig();
        const moviesCollection = collection(db, "movies");
        const movieSnapshot = await getDocs(moviesCollection);
        const movieList = movieSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMovies(movieList);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getMovies();
  }, []);

  const filteredAndSortedMovies = useMemo(() => {
    return movies
      .filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [searchQuery, movies, sortBy, sortOrder]);

  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  return (
    <main className="container mx-auto py-10">
      <div className="flex flex-wrap gap-y-4 justify-between items-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Manage Movies</h1>
        <div className="flex-shrink-0 flex items-center gap-2">
          <AddMovieForm />
          <LogoutButton />
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
            <p className="text-center">Loading movies...</p>
        ) : (
            <MoviesTable 
                movies={filteredAndSortedMovies} 
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
            />
        )}
      </div>
    </main>
  );
}
