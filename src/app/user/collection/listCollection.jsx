'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
  getDoc
} from 'firebase/firestore'
import getFirebaseConfig from '@/firebase/config'
import useAuth from '@/hooks/useAuth'
import Link from 'next/link'
import EditCollection from './editCollection'
import AddCollection from './addCollection'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useModalStore from '@/stores/useModalStore'
import useColStore from '@/stores/useColStore'
import { valueOrDefault } from '@/lib/utils'
import { Card } from '@/components/ui/card'

export default function ListCollection() {
  const { openModal } = useModalStore();
  const { user } = useAuth();

  const [collections, setCollections] = useState([])
  const [listMovies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const setCol = useColStore((state)=>state.setCol);
  const placeholderImg = "/assets/images/placeholders/collection.png";

  // var userId = user?.uid;

  useEffect(() => {
    const { db } = getFirebaseConfig();
    if(user){
      setLoading(true);
      const q = query(
        collection(db, 'users', user.uid, 'collections'),
        orderBy('createdAt', 'desc')
      )

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCollections(data);
        setLoading(false);
      })

      return () => unsubscribe();
    }
  }, [user]);

  useEffect(()=>{

    const fetchMovie = async (movieId) => {
      const {db} = getFirebaseConfig();
      const movieRef = collection(db, "movies");
      const movieDocs = await getDoc(doc(movieRef, movieId));
      console.log(movieDocs.data());
      if(movieDocs.exists){
        return movieDocs.data();
      }
      return null;
    }

    const assignCovers = async () => {
      const movieCovers = [];
      setLoading(true);
      await Promise.all(
        collections.map(async (collection) => {
          const moviesPromise = collection.movies?.map(async (movieId) => {
            return await fetchMovie(movieId);
          });

          const moviesList = await Promise.all(moviesPromise);
          console.log(moviesList[0]);
          movieCovers.push({imageUrl: valueOrDefault(
              moviesList?.[0]?.coverUrl,
              "/assets/images/placeholders/collection.png"
            ),});
        })
      );
      setMovies(movieCovers);
      console.log(movieCovers);
      setLoading(false);
    }
    if(collections.length>0){
      assignCovers();
    }
  }, [collections]);

  // Tampilkan loading jika user belum ready
  if (!user) { return <p className="p-6">Loading user...</p>}
  if(loading) { return <p className="p-6">Loading collections...</p>}
  if(collections.length==0) { return <p className="p-6">No collections yet</p>}

  for (let index = 0; index < listMovies.length; index++) {
    console.log(listMovies[index].imageUrl);    
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Collections</h1>
        <Button
          onClick={() => openModal("create-collection")}
        >
          <Plus />
          Add Collection
        </Button>
      </div>

      {/* <AddCollection open={openAdd} setOpen={setOpenAdd} /> */}


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {collections.map((col, index) => (
          <Card key={col.id} className="p-4 border rounded shadow bg-white relative">
            <Link href={`/user/collection/detail?id=${col.id}`}>
              <div className="cursor-pointer">
                <img
                  src={
                    listMovies[index]? listMovies[index].imageUrl : placeholderImg
                  }
                  alt={col.name}
                  className="h-40 w-full object-cover rounded mb-2 hover:opacity-50"
                />
                <h2 className="text-lg font-semibold hover:underline">{col.name}</h2>
                <p className="text-sm text-gray-500">
                  {col.movies?.length || 0} movie{col.movies?.length !== 1 ? 's' : ''}
                </p>
              </div>
            </Link>

            <div className="flex justify-between mt-3">
              <Button
                variant="secondary"
                onClick={() => { setCol(col); return openModal("edit-collection");} }
              >
                Edit Name
              </Button>
              <Button
                variant="destructive"
                onClick={() => { setCol(col); return openModal("del-collection");} }
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* <EditCollection
        open={openEdit}
        setOpen={setOpenEdit}
        collection={selectedCollection}
      /> */}
    </>
  )
}
