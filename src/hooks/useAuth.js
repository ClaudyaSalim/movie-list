import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDoc, doc } from "firebase/firestore";

import getFirebaseConfig from "@/firebase/config";

export default function useAuth() {
  const { auth, db } = getFirebaseConfig();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currUser) => {

      setIsLoading(true);

      if (currUser) {
        const userCollection = collection(db, "users");
        const userDoc = await getDoc(doc(userCollection, currUser.uid));
        setRole(userDoc.data()?.role || "");
        setUser({...userDoc.data(), uid: currUser.uid});
      }
      console.log(user);
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  return { user, isLoading, role };
}
