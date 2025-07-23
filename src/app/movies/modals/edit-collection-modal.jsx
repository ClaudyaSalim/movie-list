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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import getFirebaseConfig from "@/firebase/config";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { toast } from "sonner";
import useColStore from "@/stores/useColStore";

export default function EditCollectionModal() {
  const { user, isLoading } = useAuth();
  const { closeModal } = useModalStore();
  const { db } = getFirebaseConfig();
  const colId = useColStore((state) => state.getColId());

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setIsSubmitting(true);

    if (!collectionName || collectionName.trim() === "") {
      setError("Collection name is required");
      return;
    }

    const isNameValid = /^[a-zA-Z0-9\s]+$/.test(collectionName);

    if (!isNameValid) {
      setError("Collection name must contain only letters and numbers");
      toast.error("Collection name must contain only letters and numbers");
      setCollectionName("");
      return;
    }

    try {    
      const q = query(
        collection(db, 'users', user.uid, 'collections'),
        where('name', '==', collectionName)
      )
      const snapshot = await getDocs(q)
      const isUsed = snapshot.docs.some((doc) => doc.id !== colId)

      if (isUsed) {
        setError('Collection existed with the same name');
        return
      }

      const ref = doc(db, 'users', user.uid, 'collections', colId)
      await updateDoc(ref, {
        name: collectionName,
        updatedAt: new Date()
      });

      toast.success("Collection name edited successfully");
      setCollectionName("");
      closeModal();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Edit Collection</DialogTitle>
          <DialogDescription>
            Edit your collection name
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="collection-name">New Collection Name:</Label>
            <Input
              disabled={isSubmitting || isLoading}
              id="collection-name"
              type="text"
              placeholder="e.g. Sci-Fi Movies"
              name="collectionName"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Editing..." : "Edit Collection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
