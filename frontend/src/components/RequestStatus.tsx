import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Navbar from './shared/Navbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAllSubmittedRequests } from '../redux/requestSlice'; // Ensure this action exists
import { APPLICATION_API_END_POINT, REQUEST_API_END_POINT } from '../utils/constant'; // Adjust the endpoint path if needed
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import Footer from './shared/Footer';


interface SubmittedRequest {
    _id: string;
    title: string;
    description: string;
    address: string;
    location: string;
    salary: number;
    createdAt: string;
    updatedAt: string;
    created_by: string;
    applications: string[]; // Array of application IDs
    department: {
        _id: string;
        name: string;
        userId: string;
        createdAt: string;
        updatedAt: string;
    };
    summary?: string; // Add summary field
}

const RequestStatus = () => {
    const dispatch = useDispatch();
    const [applicationStatus, setApplicationStatus] = useState<Record<string, string>>({});
    const { allsubmittedRequests = [] } = useSelector((store: RootState) => store.request) as { allsubmittedRequests: SubmittedRequest[] };
    const fetchData: () => Promise<void> = async () => {
        try {
            console.log("printing----");
            const res = await axios.get(`${REQUEST_API_END_POINT}/user`, {
                withCredentials: true,
                // timeout: 30000, // Set a timeout of 10 seconds
            });


            console.log('Response Body:', res.data);
            const data = res.data;
            if (data.success) {
                dispatch(setAllSubmittedRequests(data.requests)); // Update Redux store with user's requests
            }

            const allRequests = data.requests as SubmittedRequest[];
            if (allRequests.length > 0) {
                for (const request of allRequests) {
                    const statuses: Record<string, string> = {};
                    for (const applicationId of request.applications) {
                        const { data } = await axios.get(`${APPLICATION_API_END_POINT}/${applicationId}/applicants`, { withCredentials: true });
                        const application = data.application.find((app: any) => app._id === applicationId);
                        if (application) {
                            statuses[applicationId] = application.status;
                        }
                    }
                    setApplicationStatus((prev) => ({ ...prev, ...statuses }));
                }
            }
        } catch (error: any) {
            console.error('Error fetching data:', error.response?.data || error.message);
            setApplicationStatus({});
        }
    };

    useEffect(() => {
        const fetchDataAsync = async () => {
            await fetchData();
        };
        fetchDataAsync();
    }, [dispatch]);
    { console.log(applicationStatus, allsubmittedRequests);
     }

    return (
        <div>
            <Navbar />
            <div className="max-w-5xl mx-auto p-4">
                <h3 className="text-xl font-semibold text-center mb-4">Your Submitted Requests</h3>
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <Table className="min-w-full bg-white md:table flex flex-col">
                        <TableHeader className="hidden md:table-header-group">
                            <TableRow className="bg-gray-100">
                                <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600 w-40">Date</TableHead>
                                <TableHead className="px py-2 text-left text-sm font-medium text-gray-600">Title</TableHead>
                                <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">Department</TableHead>
                                <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">RTI Response Summary</TableHead>
                                <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="flex flex-col md:table-row-group">

                            {
                                allsubmittedRequests.length === 0 ? (
                                    <TableRow className="flex flex-col md:table-row">
                                        <TableCell colSpan={5} className="text-center px-4 py-6 text-gray-500">
                                            You haven't submitted any requests yet.
                                        </TableCell>
                                    </TableRow>
                                ) : applicationStatus[allsubmittedRequests[0].applications[0]] ? (
                                    allsubmittedRequests.map((request) => (
                                        <TableRow key={request._id} className="hover:bg-gray-50 flex flex-col md:table-row">
                                            <TableCell className="px py-2 text-md text-gray-700 w-40" data-label="Date">
                                                <span className="md:hidden font-medium text-gray-600">Date:</span>
                                                {request?.createdAt?.split("T")[0]}
                                            </TableCell>
                                            <TableCell className="px py-2 text-sm text-gray-700" data-label="Title">
                                                <span className="md:hidden font-medium text-gray-600">Title: </span>
                                                {request.title}
                                            </TableCell>
                                            <TableCell className="px-4 py-2 text-sm text-gray-700" data-label="Department">
                                                <span className="md:hidden font-medium text-gray-600">Department: </span>
                                                {request.department?.name}
                                            </TableCell>
                                            <TableCell className="px-4 py-2 text-xs/4 text-gray-700 text-justify" data-label="RTI Request Response">
                                                <span className="md:hidden font-medium text-gray-600">RTI Request Response: </span>
                                                {request.summary || "Available Soon!"}
                                            </TableCell>
                                            <TableCell className="px-4 py-2 text-sm" data-label="Status">
                                                <span className="md:hidden font-medium text-gray-600">Status: </span>
                                                <Badge className={`px-2 py-1 rounded-full text-white ${request?.applications?.length === 0 ? 'bg-yellow-500' : applicationStatus[request.applications[0]] === 'accepted' ? 'bg-green-500' : applicationStatus[request.applications[0]] === 'rejected' ? 'bg-red-500' : 'bg-gray-400'}`}>
                                                    {request?.applications?.length === 0 ? "PENDING" : applicationStatus[request.applications[0]] || "SUBMITTED"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow className="flex flex-col md:table-row">
                                        <TableCell colSpan={5} className="text-center px-4 py-6 text-gray-500">
                                            <div className="relative w-full my-4 bg-white text-black  leading-none flex items-center justify-center space-x-6 hover:text-blue-600 dark:text-sky-400">
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Wait for Few Minutes Requests Loading...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default RequestStatus;