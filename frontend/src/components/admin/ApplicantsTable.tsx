import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import BrowseApplications from './BrowseApplications';

const ApplicantsTable = ({ applicants, fetchAllApplicants }:any) => {
    const shortlistingStatus = ["Accepted", "Rejected", "Pending"]; // Add "Pending"
    const statusHandler = async (status: string, id: string) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
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
        <div className="overflow-x-auto rounded-xl">
            <h2 className="text-lg font-semibold mb-4 text-center">A list of recent applied RTI Requests of citizens</h2>
            <div className="mx-auto max-w-screen-lg rounded-xl">
                <Table className="min-w-full border  rounded-lg shadow-md mb-5 rounded-xl">
                    {applicants?.length > 0 ? (
                        <>
                            <TableHeader>
                                <TableRow className="bg-gray-100">
                                    <TableHead className="px-4 py-2">FullName</TableHead>
                                    <TableHead className="px-4 py-2">Email</TableHead>
                                    <TableHead className="px-4 py-2">Department</TableHead>
                                    <TableHead className="px-4 py-2">Date</TableHead>
                                    <TableHead className="px-4 py-2">Status</TableHead>
                                    <TableHead className="px-4 py-2 text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applicants?.map((item: any) => (
                                    <TableRow key={item.applicant._id} className="hover:bg-gray-50">
                                        <TableCell className="px-4 py-2">{item?.applicant.fullname}</TableCell>
                                        <TableCell className="px-4 py-2">{item?.applicant?.email}</TableCell>
                                        <TableCell className="px-4 py-2">{item?.request.department.name}</TableCell>
                                        <TableCell className="px-4 py-2">{item?.createdAt.split("T")[0]}</TableCell>
                                        <TableCell className="px-4 py-2">
                                            <span
                                                className={`px-2 py-1 rounded text-white ${
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
                        <h1 className="text-center text-gray-500 py-4">No applicants found.</h1>
                    )}
                </Table>
            </div>
        </div>
        </>
    );
};

export default ApplicantsTable;