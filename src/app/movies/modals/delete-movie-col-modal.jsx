"use client";

import { useEffect, useState } from "react";

import useModalStore from "@/stores/useModalStore";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import getFirebaseConfig from "@/firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import useColStore from "@/stores/useColStore";
import { LoaderCircle } from "lucide-react";
import useMovieStore from "@/stores/useMovieStore";

export default function DelMovieColModal() {
  const { user, isLoading } = useAuth();
  const { closeModal } = useModalStore();
  const { db } = getFirebaseConfig();
  const collection = useColStore((state) => state.collection);
  const movie = useMovieStore((state) => state.movie);
  const movies = useMovieStore((state) => state.movies);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    try { 
      setDeleting(true);
      const colRef = doc(db, 'users', user.uid, 'collections', collection.id);
      const newMovies = movies.filter(mov => mov!==movie);
      const movieIds = newMovies.map((mov)=>mov.id);
      await updateDoc(colRef, {
        "movies": movieIds
      })
      toast.success("Movie removed successfully");
      closeModal();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  // useEffect(()=>{
  //   const fetchCol = async () => {
  //     const colRef = doc(db, 'users', user.uid, 'collections', colId)
  //     const snapshot = await getDoc(colRef);
  //     if(snapshot.exists()){
  //       setCol(snapshot.data());
  //     }
  //   }
  //   if(user){
  //     fetchCol();
  //   }
  // }, [isLoading]);

  console.log(movie);

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Remove movie</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove <b>{movie.title}</b> from <b>{collection.name}</b>?
          </DialogDescription>
        </DialogHeader>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">No</Button>
          </DialogClose>
          <Button
            variant="destructive"
            type="submit"
            disabled={deleting || isLoading}
            onClick={handleSubmit}
          >
            {deleting ? <LoaderCircle/> : "Yes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
