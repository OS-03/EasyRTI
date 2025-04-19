import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT, REQUEST_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import BrowseApplications from './BrowseApplications';
import { useDispatch, useSelector } from 'react-redux';
import { setAllSubmittedRequests } from '@/redux/requestSlice';
import { RootState } from '@/redux/store';
import { useState, useEffect } from 'react';

// Define the SubmittedRequest type
interface SubmittedRequest {
    applications: string[];
    [key: string]: any; // Add additional fields as needed
}

const ApplicantsTable = ({ applicants, fetchAllApplicants }:any) => {
    
    const dispatch = useDispatch();
    const { allsubmittedRequests = [] } = useSelector((store: RootState) => store.request) as { allsubmittedRequests: SubmittedRequest[] };

    useEffect(() => {
        const fetchData: () => Promise<void> = async () => {
            try {
                const res = await axios.get(`${REQUEST_API_END_POINT}/user`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllSubmittedRequests(res.data.requests)); // Update Redux store with user's requests
                }

            } catch (error: any) {
                console.error('Error fetching data:', error.response?.data || error.message);
            }
        };

        fetchData();
    }, [dispatch]);


    const shortlistingStatus = ["Accepted", "Rejected", "Pending"]; // Add "Pending"

    const statusHandler = async (status: string, id: string) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            console.log(res)
            if (res.data.success) {
                toast.success(res.data.message);
                fetchAllApplicants(); // Refresh applicants data
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <>
      {/* <BrowseApplications/> */}
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-xl font-semibold text-center mb-4">A list of recent applied RTI Requests of citizens</h2>
            <div className="overflow-x-auto shadow-md rounded-lg">
       
            <Table className="min-w-full bg-white">
            
                {applicants?.length > 0  ? (
                <>
                    <TableHeader>
                    <TableRow className="bg-gray-100">
                        <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">FullName</TableHead>
                        <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">Email</TableHead>
                        <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">RTI Request Summary</TableHead>
                        <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">Department</TableHead>
                        <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</TableHead>
                        <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</TableHead>
                        <TableHead className="px-4 py-2 text-right text-sm font-medium text-gray-600">Action</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {applicants?.map((item: any) => (
                        <TableRow key={item.applicant._id} className="hover:bg-gray-50">
                        <TableCell className="px-4 py-2 text-sm text-gray-700">{item?.applicant.fullname}</TableCell>
                        <TableCell className="px-4 py-2 text-sm text-gray-700">{item?.applicant?.email}</TableCell>
                        <TableCell className="px-4 py-2 text-sm text-gray-700">
                      
                        {item?.request?.summary === '' && fetchAllApplicants()}
                          {(item?.request?.summary) ? (
                               <p className='text-justify'> {item?.request?.summary}</p>
                            ) : (
                                <span className="text-gray-400 italic">Loading Summary of Submitted Request...</span>
                            )}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-sm text-gray-700">{item?.request.department.name}</TableCell>
                        <TableCell className="px-4 py-2  text-md text-gray-700 w-40">{item?.createdAt.split("T")[0]}</TableCell>
                        <TableCell className="px-4 py-2 text-sm">
                            <span
                            className={`px-2 py-1 rounded-full text-white ${
                                item?.status === "Accepted"
                                ? "bg-green-500"
                                : item?.status === "Rejected"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                            }`}
                            >
                            {item?.status}
                            </span>
                        </TableCell>
                        <TableCell className="px-4 py-2 text-right cursor-pointer">
                            <Popover>
                            <PopoverTrigger>
                                <MoreHorizontal />
                            </PopoverTrigger>
                            <PopoverContent className="w-32 bg-white hover:bg-gray-100">
                                {shortlistingStatus.map((status, index) => (
                                <div
                                    onClick={() => statusHandler(status, item?._id)}
                                    key={index}
                                    className="flex w-fit items-center my-2 cursor-pointer hover:text-blue-500"
                                >
                                    <h3>{status}</h3>
                                </div>
                                ))}
                            </PopoverContent>
                            </Popover>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </>
                ) : (
                <TableRow>
                    <TableCell colSpan={6} className="text-center px-4 py-6 text-gray-500">
                    No applicants found.
                    </TableCell>
                </TableRow>
                )}
            </Table>
            </div>
        </div>
    </>
    );
};

export default ApplicantsTable;
