"use client";
import { useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import getFirebaseConfig from "@/firebase/config";
import Image from "next/image";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import AddToCollectionButton from "./[id]/_components/add-to-collection-button";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import NotFound from "../not-found";
import useSelectedMoviesStore from "./[id]/_components/useSelectedMoviesStore";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 8;

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("title-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const {role} = useAuth();
  const { selectedMovies, toggleMovie } = useSelectedMoviesStore();

  const redirect = () => {
    if(role==="admin"){
      router.push("/");
    }
  }

  useEffect(()=>{
    redirect();
  }, [role]);

  useEffect(() => {
    let interval;
    if (loading) {
      let value = 0;
      interval = setInterval(() => {
        value += 10;
        if (value >= 90) value = 90;
        setProgress(value);
      }, 200);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { db } = getFirebaseConfig();
        const querySnapshot = await getDocs(collection(db, "movies"));
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMovies(docs);
        setProgress(100);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };
    fetchData();
  }, []);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h` : ""}${hours > 0 && mins > 0 ? " " : ""}${mins > 0 ? `${mins}m` : ""}`;
  };

  const filteredSortedMovies = useMemo(() => {
    let result = [...movies];
    if (searchQuery) {
      result = result.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortOrder === "title-asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === "title-desc") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }
    return result;
  }, [movies, searchQuery, sortOrder]);

  const totalPages = Math.ceil(filteredSortedMovies.length / ITEMS_PER_PAGE);
  const paginatedMovies = filteredSortedMovies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <div className="relative w-full h-32 sm:h-40 md:h-60 rounded-lg overflow-hidden">
        <Image src="/banner-movies.webp" alt="banner movies" fill sizes="100vw" className="object-cover" />
      </div>

      <div className="w-full mt-7 flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 justify-between">
        <select
          id="sort"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="bg-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-200"
        >
          <option value="title-asc">Title (A → Z)</option>
          <option value="title-desc">Title (Z → A)</option>
        </select>

        <input
          type="text"
          placeholder="Search Movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-[40%] lg:w-1/4 p-2 rounded-lg shadow-md bg-white"
        />

        <AddToCollectionButton type="bulk" />
      </div>

      <div className="w-full p-4 mx-auto mt-7 bg-white">
        <div className="flex flex-wrap gap-y-7 justify-evenly">
          {loading ? (
            <div className="w-full mx-auto flex flex-col gap-y-2 mt-20">
              <Progress value={progress} className="w-10/12 mx-auto" />
              <p className="text-lg text-center text-muted-foreground mt-2">Loading movies...</p>
            </div>
          ) : paginatedMovies.length === 0 ? (
            <p className="my-20 text-center font-semibold text-2xl text-black">No movies found.</p>
          ) : (
            paginatedMovies.map((movie) => {
              const isSelected = selectedMovies.includes(movie.id);

              return(

                <div
                  key={movie.id}
                  className="group relative w-[250px] h-[350px] shadow-sm rounded-xl overflow-hidden transform transition duration-500 hover:-translate-y-2 hover:scale-105"
                >
                  <Image src={movie.coverUrl} alt={movie.title} fill sizes="100vw" className="object-cover" />
                  <div className="absolute top-0 left-0 opacity-100 lg:opacity-0 group-hover:opacity-100 transition duration-300 z-10">
                    <span className="p-2 flex gap-x-2 text-white text-center items-center">
                      <Image src="/star-icon.png" alt="star icon" width={22} height={20} />
                      {movie.rating}
                    </span>
                  </div>
                  <div className="absolute top-0 right-0 opacity-100 lg:opacity-0 group-hover:opacity-100 transition duration-300 z-10">
                    <span className="p-2 flex gap-x-1 text-white text-center">
                      <Image src="/clock-icon.png" alt="clock icon" width={22} height={20} />
                      {formatDuration(movie.duration)}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-100 lg:opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <div className="absolute inset-0 flex flex-col gap-y-4 items-center justify-center opacity-100 lg:opacity-0 group-hover:opacity-100 transition duration-300 z-10">
                    <Link href={`/movies/${movie.id}`} className="p-2 font-medium rounded-lg bg-white hover:bg-[#B8BBB8]">View Detail</Link>
                    <Button
                      onClick={() => toggleMovie(movie.id)}
                      className={`p-2 rounded-lg text-white transition ${
                        isSelected ? "bg-gray-500 hover:bg-gray-600" : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {isSelected ? "Added" : "Add to Collection"}
                    </Button>

                  </div>
                  <h4 className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-center font-medium line-clamp-2 text-lg overflow-hidden transition duration-300 opacity-100 lg:opacity-0 group-hover:opacity-100 px-4 z-10">
                    {movie.title}
                  </h4>
                </div>
              )
            })
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 pb-14">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 font-medium rounded disabled:opacity-50"
            >
              &lt;&lt;
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 font-medium rounded disabled:opacity-50"
            >
              &lt;
            </Button>

            <span className="px-4">Page {currentPage} of {totalPages}</span>

            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 font-medium rounded disabled:opacity-50"
            >
              &gt;
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 font-medium rounded disabled:opacity-50"
            >
              &gt;&gt;
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
