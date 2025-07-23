'use client'
import { useRouter } from 'next/navigation';
import ListCollection from './listCollection'
import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';

export default function CollectionPage() {
  const router = useRouter();
  const {role, isLoading} = useAuth();

  const redirect = () => {
    if(role!=="user" && !isLoading){
      console.log(role);
      router.push("/");
    }
  }

  useEffect(()=>{
    redirect();
  }, [isLoading]);

  return <ListCollection />
}
