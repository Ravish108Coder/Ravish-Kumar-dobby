import React, { useRef } from 'react'
import LogOutBtn from './LogOutBtn'
import ImagesContainer from './ImagesContainer'
import { Upload } from 'lucide-react'

const Home = () => {
    const uploadFormBtnRef = useRef(null)

    return (
        <>
            <div className='p-4'>
                <div className='flex justify-between'>
                    <div>Home</div>
                    <LogOutBtn />
                </div>

                <ImagesContainer uploadFormBtnRef={uploadFormBtnRef} />
            </div>
            <div className='h-full fixed z-[9999] inline-flex items-center right-6 top-0'>
                <div onClick={() => uploadFormBtnRef.current.click()} className='cursor-pointer animate-bounce inline-flex justify-center items-center bg-blue-gray-100 p-4 rounded-full'><Upload /></div>
            </div>
        </>
    )
}

export default Home