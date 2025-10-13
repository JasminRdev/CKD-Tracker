"use client"
import { useRouter } from 'next/navigation'


import Menu from '../components/Menu'
import { useEffect } from 'react'


export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/chart') 
  },[])

  return (
    <div >
       <Menu />
    </div>
  );
}
