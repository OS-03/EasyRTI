import React from 'react'
import { Badge } from '../ui/badge'
import { useNavigate } from 'react-router-dom'

// Define the type for the request prop
interface Request {
    _id: string;
    department?: {
        name: string;
    };
    title?: string;
    description?: string;
    salary?: string;
}

const LatestRequestCards: React.FC<{ request: Request }> = ({ request }) => {
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate(`/description/${request._id}`)} className='p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer'>
            <div>
                <h1 className='font-medium text-lg'>{request?.department?.name}</h1>
                <p className='text-sm text-gray-500'>India</p>
            </div>
            <div>
                <h1 className='font-bold text-lg my-2'>{request?.title}</h1>
                <p className='text-sm text-gray-600'>{request?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-[#7209b7] font-bold'} variant="default">{request?.salary} LPA</Badge>
            </div>
    </div>
    )
}

export default LatestRequestCards