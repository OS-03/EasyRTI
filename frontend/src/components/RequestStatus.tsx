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
    const [applicationStatuses, setApplicationStatuses] = useState<Record<string, string>>({});
    const { allsubmittedRequests = [] } = useSelector((store: RootState) => store.request) as { allsubmittedRequests: SubmittedRequest[] };

    useEffect(() => {
        const fetchData: () => Promise<void> = async () => {
            try {
                const res = await axios.get(`${REQUEST_API_END_POINT}/user`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllSubmittedRequests(res.data.requests)); // Update Redux store with user's requests
                }

                const allRequests = res.data.requests as SubmittedRequest[];
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
                        setApplicationStatuses((prev) => ({ ...prev, ...statuses }));
                    }
                }
            } catch (error: any) {
                console.error('Error fetching data:', error.response?.data || error.message);
                setApplicationStatuses({});
            }
        };

        fetchData();
    }, [dispatch]);

    return (
        <div>
            <Navbar />
            <div className="max-w-6xl mx-auto p-4">
                <h3 className="text-xl font-semibold text-center mb-4">Your Submitted Requests</h3>
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <Table className="min-w-full bg-white">
                        <TableHeader>
                            <TableRow className="bg-gray-100">
                                <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</TableHead>
                                <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">Title</TableHead>
                                <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">Department</TableHead>
                                <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">RTI Request Response</TableHead>
                                <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>

                            {
                                allsubmittedRequests.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center px-4 py-6 text-gray-500">
                                            You haven't submitted any requests yet.
                                        </TableCell>
                                    </TableRow>
                                ) :  applicationStatuses[allsubmittedRequests[0].applications[0]] ? (
                                    allsubmittedRequests.map((request) => (
                                        <TableRow key={request._id} className="hover:bg-gray-50">
                                            <TableCell className="px-4 py-2 text-sm text-gray-700">{request?.createdAt?.split("T")[0]}</TableCell>
                                            <TableCell className="px-4 py-2 text-sm text-gray-700">{request.title}</TableCell>
                                            <TableCell className="px-4 py-2 text-sm text-gray-700">{request.department?.name}</TableCell>
                                            <TableCell className="px-4 py-2 text-xs/4 text-gray-700">{request.summary || "Available Soon!"}</TableCell>
                                            <TableCell className="px-4 py-2 text-sm">
                                                <Badge className={`px-2 py-1 rounded-full text-white ${request?.applications?.length === 0 ? 'bg-yellow-500' : applicationStatuses[request.applications[0]] === 'accepted' ? 'bg-green-500' : applicationStatuses[request.applications[0]] === 'rejected' ? 'bg-red-500' : 'bg-gray-400'}`}>
                                                    {request?.applications?.length === 0 ? "PENDING" : applicationStatuses[request.applications[0]] || "SUBMITTED"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                    <TableCell colSpan={5} className="text-center px-4 py-6 text-gray-500">
                                        Wait for Few Minutes Requests Loading...
                                    </TableCell>
                                </TableRow>

                                )
                            }
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default RequestStatus;