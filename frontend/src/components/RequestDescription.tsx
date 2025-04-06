import { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, REQUEST_API_END_POINT } from '@/utils/constant';
import { setSingleRequest } from '@/redux/requestSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store'; // Adjust the path to your store file
import { toast } from 'sonner';

function RequestDescription() {
    const {user} = useSelector((store: RootState) => store.auth);
    const singleRequest = useSelector((store: RootState) => store.request.singleRequest) as { title?: string; salary?: string; location?: string; description?: string; experience?: string; createdAt?: string; applications: { applicant: string }[] } | null;
    const isIntiallyApplied = singleRequest?.applications?.some((application) => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);

    const params = useParams();
    const requestId = params.id;
    const dispatch = useDispatch();

    const applyRequestHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${requestId}`, {withCredentials:true});
            
            if(res.data.success){
                setIsApplied(true); // Update the local state
                const updatedSingleRequest = singleRequest ? {...singleRequest, applications:[...singleRequest.applications,{applicant:user?._id}]} : null;
                dispatch(setSingleRequest(updatedSingleRequest)); // helps us to real time UI update
                toast.success(res.data.message);

            }
        } catch (error:any) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    useEffect(()=>{
        const fetchSingleRequest = async () => {
            try {
                const res = await axios.get(`${REQUEST_API_END_POINT}/get/${requestId}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleRequest(res.data.request));
                    setIsApplied(res.data.request.applications.some((application: { applicant: string | undefined; }) => application.applicant === user?._id)); // Ensure the state is in sync with fetched data
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleRequest(); 
    },[requestId, dispatch, user?._id]);

    return (
        <div className='max-w-7xl mx-auto my-10'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-bold text-xl'>{singleRequest?.title || 'No Title Available'}</h1>
                    <div className='flex items-center gap-2 mt-4'>

                        <Badge className={'text-[#7209b7] font-bold'} variant="default">{singleRequest?.salary}LPA</Badge>
                    </div>
                </div>
                <Button
                onClick={isApplied ? undefined : applyRequestHandler}
                    disabled={isApplied}
                    className={`rounded-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}>
                    {isApplied ? 'Already Applied' : 'Apply Now'}
                </Button>
            </div>
            <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Request Description</h1>
            <div className='my-4'>
                <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{singleRequest?.location}</span></h1>
                <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>{singleRequest?.description}</span></h1>
                <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleRequest?.salary}LPA</span></h1>
                <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{singleRequest?.applications?.length}</span></h1>
                <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleRequest?.createdAt?.split("T")[0] || 'N/A'}</span></h1>
            </div>
        </div>
    )
}

export default RequestDescription