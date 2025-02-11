'use client'
import { useAuthContext } from '@/app/provider'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import DesignCard from './_components/DesignCard';

function page() {
    const {user} = useAuthContext();

    const [wireframes, setWireframes] = useState([]);

    const getAllWireframes = async () => {
        const result = await axios.get(`/api/wireframe-to-code?email=${user?.email}`);
        console.log(result.data);
        setWireframes(result.data);
    }

    useEffect(() => {
        user && getAllWireframes();
    },[user])

  return (
    <div>
      <h2 className='font-bold text-2xl'>Wifreframes and Codes:</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-10'>
        {wireframes.map((item,index) => {
          return (
            <DesignCard key={index} item={item}/>
          )
        })}
      </div>
    </div>
  )
}

export default page
