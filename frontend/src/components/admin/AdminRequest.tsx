import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button' 
import { useNavigate } from 'react-router-dom' 
import { useDispatch } from 'react-redux' 
import AdminJobsTable from './AdminRequestsTable'
import useGetAllAdminRequests from '../../hooks/useGetAllAdminRequests'
import { setSearchRequestByText } from '@/redux/requestSlice'

const AdminRequest = () => {
  useGetAllAdminRequests();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchRequestByText(input));
  }, [input]);
  return (
    <div>
      <Navbar />
      <div className='max-w-6xl mx-auto my-10'>
        <div className='flex items-center justify-between my-5'>
          <Input
            className="w-fit"
            placeholder="Filter by departments"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => navigate("/admin/requesttable")}>New Request</Button>
        </div>
        <AdminJobsTable />
      </div>
    </div>
  )
}

export default AdminRequest