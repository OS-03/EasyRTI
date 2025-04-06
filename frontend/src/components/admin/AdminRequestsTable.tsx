import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


const AdminRequestsTable = () => { 
    const {allAdminRequests, searchRequestsByText} = useSelector((store:any)=>store.request);

    const [filterRequests, setFilterRequests] = useState(allAdminRequests || []);
    const navigate = useNavigate();

    useEffect(()=>{ 
        console.log('called');
        const filteredRequests = (allAdminRequests || []).filter((request:any)=>{
            if(!searchRequestsByText){
                return true;
            };
            return request.title?.toLowerCase().includes(searchRequestsByText.toLowerCase()) || request.department?.name.toLowerCase().includes(searchRequestsByText.toLowerCase());

        });
        setFilterRequests(filteredRequests);
    },[allAdminRequests,searchRequestsByText])

    if (!filterRequests.length) {
        return <div>No requests found.</div>; // Handle empty state
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent Requests</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Department Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterRequests?.map((request:any) => (
                            <tr key={request._id}>
                                <TableCell>{request?.company?.name}</TableCell>
                                <TableCell>{request?.title}</TableCell>
                                <TableCell>{request?.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            <div onClick={()=> navigate(`/admin/departments/${request._id}`)} className='flex items-center gap-2 w-fit cursor-pointer'>
                                                <Edit2 className='w-4' />
                                                <span>Edit</span>
                                            </div>
                                            <div onClick={()=> navigate(`/admin/requests/${request._id}/applicants`)} className='flex items-center w-fit gap-2 cursor-pointer mt-2'>
                                                <Eye className='w-4'/>
                                                <span>Applicants</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </tr>

                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminRequestsTable