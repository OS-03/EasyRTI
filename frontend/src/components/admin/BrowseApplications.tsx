import useGetAllRequest from '@/hooks/useGetAllRequest';
import React, { useEffect } from 'react';
import Navbar from '../shared/Navbar'
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/requestSlice'; // Ensure this path is correct
import { RootState } from '@/redux/store'; // Ensure this path points to your store definition


function BrowseApplications() {
  useGetAllRequest();
  const { allRequests = [] } = useSelector((store: RootState) => store.request) as { allRequests: { _id: string; title: string }[] };
  const dispatch = useDispatch();
  useEffect(() => {
      return () => {
          dispatch(setSearchedQuery(""));
      }
  }, []);
  return (
    <div>
        <div className='max-w-7xl mx-auto my-10'>
            <h1 className='font-bold text-xl my-10'>Search Results ({allRequests.length})</h1>
            <div className='grid grid-cols-3 gap-4'>
                {
                    allRequests.map((request) => {
                        return (
                            <div key={request._id}>{request.title}</div> 
                        )
                    })
                }
            </div>
        </div>
    </div>
  )
}

export default BrowseApplications

