import React from 'react'
import LatestJobCards from './LatestRequestCards';
import { useSelector } from 'react-redux';  // Adjust the path to your store file
import { RootState } from '../../redux/store'; // Adjust the path to your store's type definition

// const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];

const LatestRequests = () => {
    const {allRequests} = useSelector((store: RootState) => store.request) as { allRequests: { _id: string }[] };
   
    return (
        <div className='max-w-7xl mx-auto my-20'>
            <h1 className='text-4xl font-bold'><span className='text-[#1caa76]'>Latest Requests </span></h1>
            <div className='grid grid-cols-3 gap-4 my-5'>
                {
                    allRequests.length <= 0 ? <span>No new requests Available</span> : allRequests?.slice(0,6).map((request) => <LatestJobCards key={request._id} request={request}/>)
                }
            </div>
        </div>
    )
}

export default LatestRequests