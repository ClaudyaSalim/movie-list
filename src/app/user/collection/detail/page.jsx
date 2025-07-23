'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import getFirebaseConfig from '@/firebase/config'
import useAuth from '@/hooks/useAuth'
import Link from 'next/link'
// import EditName from './EditName'
// import RemoveMovie from './RemoveMovie'
import { Button } from '@/components/ui/button'
import useModalStore from '@/stores/useModalStore'
import { Plus } from 'lucide-react'
import useColStore from '@/stores/useColStore'
import Image from 'next/image'
import useMovieStore from '@/stores/useMovieStore'

export default function CollectionDetailPage() {
  const { openModal } = useModalStore();
  const searchParams = useSearchParams()
  const id = searchParams.get('id');
  const { db } = getFirebaseConfig()
  const { user, isLoading } = useAuth()
  const userId = user?.uid

  const [col, setCollection] = useState(null);
  const [movies, setMovieList] = useState([]);
  const [loading, setLoading] = useState(true)
  // const [openAdd, setOpenAdd] = useState(false)
  const setCol = useColStore((state)=>state.setCol);
  const setMovie = useMovieStore((state) => state.setMovie);
  const setMovies = useMovieStore((state) => state.setMovies);

  useEffect(() => {
    const fetchCollection = async () => {
      if (!userId || !id) return

      try {
        const ref = doc(db, 'users', userId, 'collections', id)
        const fetchCol = onSnapshot(ref, (snapshot)=> {
          if (snapshot.exists()) {
            setCollection({ id: snapshot.id, ...snapshot.data() })
          } else {
            setCollection(null)
          }
        });

        return () => fetchCol();
        // const snapshot = await getDoc(ref)
        // if (snapshot.exists()) {
        //   setCollection({ id: snapshot.id, ...snapshot.data() })
        // } else {
        //   setCollection(null)
        // }
      } catch (err) {
        console.error('Error fetching collection detail:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCollection()
  }, [id, db, isLoading]);

  useEffect(()=>{
    setMovieList([]);
    if(col && col.movies){
      col.movies.map((movieId)=>{
        const movieRef = doc(db, "movies", movieId);
        const unsubscribe = onSnapshot(movieRef, (snapshot)=>{
          const movie = {...snapshot.data(), id: movieId};
          setMovieList(prev => [...prev, movie]);
        });
        return() => unsubscribe();
      });
    }
  }, [col]);

  console.log(movies);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h` : ""}${hours > 0 && mins > 0 ? " " : ""}${mins > 0 ? `${mins}m` : ""}`;
  };

  if (isLoading) return <p className="p-6">Loading user...</p>
  if (loading) return <p className="p-6">Loading...</p>
  if (!col) return <p className="p-6">Collection not found.</p>

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <Button variant="link">
          <Link href="/user/collection">
            ← Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{col.name}</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => { setCol(col); return openModal("edit-collection");} }
          >
            Edit Name
          </Button>
          <Button onClick={() => openModal("create-collection")}>
            <Plus />
            Add Collection
          </Button>
        </div>
      </div>

      {/* Modal Add Collection */}
      {/* <AddCollection open={openAdd} setOpen={setOpenAdd} /> */}

      {/* Edit Collection Name */}
      {/* <EditName collection={collection} setCollection={setCollection} /> */}

      <p className="text-gray-600 mt-4 mb-2">
        Total movies: {col.movies?.length || 0}
      </p>

      <div className="flex flex-wrap gap-y-7 justify-evenly">
        {movies.length > 0 ? (
          movies.map((movie) => (
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
                <Button variant="destructive" 
                onClick={() => { setMovie(movie); setMovies(movies); setCol(col); return openModal("del-movie-col");} }>
                  Remove Movie
                </Button>
              </div>
              <h4 className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-center font-medium line-clamp-2 text-lg overflow-hidden transition duration-300 opacity-100 lg:opacity-0 group-hover:opacity-100 px-4 z-10">
                {movie.title}
              </h4>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-4">No movies in this collection.</p>
        )}
      </div>
    </div>
  )
}
