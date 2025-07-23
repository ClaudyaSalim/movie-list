"use client";

import { useState } from "react";

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
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import useColStore from "@/stores/useColStore";
import { LoaderCircle } from "lucide-react";

export default function DelCollectionModal() {
  const { user, isLoading } = useAuth();
  const { closeModal } = useModalStore();
  const { db } = getFirebaseConfig();
  const col = useColStore((state) => state.collection);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    try { 
      setDeleting(true);
      await deleteDoc(doc(db, 'users', user.uid, 'collections', col.id));
      toast.success("Collection deleted successfully");
      closeModal();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete Collection</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <b>{col.name}</b>?
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
