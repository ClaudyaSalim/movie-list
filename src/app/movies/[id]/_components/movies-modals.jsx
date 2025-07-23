"use client";

import { useMemo } from "react";
import CreateCollectionModal from "../../modals/create-collection-modal";
import useModalStore from "@/stores/useModalStore";
import AddToCollectionModal from "../../modals/add-to-collection-modal";
import AddToCollectionBulkModal from "../../modals/add-to-collection-bulk-modal";
import EditCollectionModal from "../../modals/edit-collection-modal";
import DelCollectionModal from "../../modals/delete-collection-modal";
import DelMovieColModal from "../../modals/delete-movie-col-modal";

export default function MoviesModals() {
  const { currentModal } = useModalStore();

  const visibleCreateCollectionModal = useMemo(
    () => currentModal === "create-collection",
    [currentModal]
  );

  const visibleAddToCollectionModal = useMemo(
    () => currentModal === "add-to-collection",
    [currentModal]
  );

  const visibleAddToCollectionBulkModal = useMemo(
    () => currentModal === "add-to-collection-bulk",
    [currentModal]
  );

  const visibleEditCollectionModal = useMemo(
    () => currentModal === "edit-collection",
    [currentModal]
  );

  const visibleDelCollectionModal = useMemo(
    () => currentModal === "del-collection",
    [currentModal]
  );

  const visibleDelMovieColModal = useMemo(
    () => currentModal === "del-movie-col",
    [currentModal]
  );

  return (
    <>
      {visibleCreateCollectionModal && <CreateCollectionModal />}
      {visibleAddToCollectionModal && <AddToCollectionModal />}
      {visibleAddToCollectionBulkModal && <AddToCollectionBulkModal />}
      {visibleEditCollectionModal && <EditCollectionModal />}
      {visibleDelCollectionModal && <DelCollectionModal />}
      {visibleDelMovieColModal && <DelMovieColModal />}
    </>
  );
}
