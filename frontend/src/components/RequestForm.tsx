import React, { useState, useEffect } from 'react';
import Navbar from './shared/Navbar';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { APPLICATION_API_END_POINT, REQUEST_API_END_POINT } from '@/utils/constant';
import { Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSingleRequest } from '@/redux/requestSlice'; // Ensure this action exists
import useGetAllAdminRequests from '@/hooks/useGetAllAdminRequests';
import useSetAllApplicate from '@/hooks/useGetAllRequest'; // Ensure this hook exists
import Footer from './shared/Footer';

let debounceTimeout: NodeJS.Timeout;

const RequestForm = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        address: "",
        salary: "",
        location: "",
        department: "", // Add department field
    });
    const [loading, setLoading] = useState(false);
    const [classifiedDepartment, setClassifiedDepartment] = useState<string | null>(null);
    const [isClassifying, setIsClassifying] = useState(false); // Separate loading state for classification
    const navigate = useNavigate();
    const dispatch = useDispatch();


    useEffect(() => {
        const classifyRequest = async () => {
            if (!input.description.trim() || input.description.trim().length < 3) {
                setClassifiedDepartment(null);
                return;
            }

            setIsClassifying(true);
            try {
                const response = await fetch("http://127.0.0.1:8000/classify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: input.description }),
                });

                if (!response.ok) {
                    throw new Error("Failed to classify the text");
                }
                
                const data = await response.json();
                console.log("Full API Response:", data); // Log the full API response

                // Safely access the department field and handle unknown class
                const summary = data?.department || "Unknown";
    
                if (data.confidence > 0.55)
                setClassifiedDepartment(summary); // Update state with the correct value
            } catch (error) {
                console.error("Error:", error);
                setClassifiedDepartment("Unknown");
            } finally {
                setIsClassifying(false);
            }
        };
        // Debounce the API call
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            classifyRequest();
        }, 1000);

        return () => clearTimeout(debounceTimeout); // Cleanup timeout on unmount
    }, [input.description]);


    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const requestData = {
                ...input,
                department: classifiedDepartment || input.department, // Use classifiedDepartment or fallback to manual input
            };
            if (!requestData.department) {
                toast.error("Department is required. Please confirm the classification.");
                setLoading(false);
                return;
            }
            console.log(requestData);
            const res = await axios.post(`${REQUEST_API_END_POINT}/post`, requestData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                // Validate the request ID
                const requestId = res.data.request?._id;
                if (!requestId) {
                    toast.error("Invalid request ID received from the server.");
                    setLoading(false);
                    return;
                }

                // Apply the request and update the Redux store
                const applyEndpoint = `${APPLICATION_API_END_POINT}/apply/${requestId}`;
                console.log("Applying request at endpoint:", applyEndpoint); // Debugging log
                const applyRes = await axios.get(applyEndpoint, { withCredentials: true });
                if (applyRes.data.success) {
                    const updatedSingleRequest = {
                        ...res.data.request,
                        applications: [...res.data.request.applications, { applicant: applyRes.data.userId }]
                    };
                    dispatch(setSingleRequest(updatedSingleRequest)); // Update Redux store
                    toast.success(applyRes.data.message);

                    // Call the setAllApplicate hook
                    useSetAllApplicate(); // Pass the correct request ID
                } else {
                    toast.error(applyRes.data.message || "Failed to apply the request.");
                }
                navigate("/viewstatus");
            }
        } catch (error: any) {
            console.error("Error during request submission:", error);
            if (error.code === 'ERR_NETWORK') {
                toast.error("Network error: Unable to connect to the server. Please try again later.");
            } else {
                toast.error(error.response?.data?.message || "Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5'>
                <form onSubmit={submitHandler} className='p-7 max-w-3xl border border-gray-200 shadow-lg rounded-md'>
                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Request</Label>
                            <textarea
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 w-full border rounded-md p-2"
                                rows={4}
                            />
                            {classifiedDepartment && (
                                <div className="mt-1 text-sm text-gray-600">
                                    <strong>Predicted Department:</strong> {classifiedDepartment}
                                </div>
                            )}
                        </div>
                        <div>
                            <Label>Address</Label>
                            <textarea
                                name="address"
                                value={input.address}
                                onChange={changeEventHandler}
                                className="resize-none focus-visible:ring-offset-0 focus-visible:ring-0 my-1 w-full border rounded-md p-2"
                                rows={2}
                            />
                        </div>
                        <div>
                            <Label>Salary</Label>
                            <Input
                                type="text"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                       {isClassifying && (
                        <div className="my-4 p-2 border rounded-md bg-gray-100">
                            <Loader2 className='mr-2 h-4 w-4 animate-spin inline-block' /> Classifying...
                        </div>
                      )}
                     </div>
                     {
                        loading ? (
                            <div className="relative group cursor-pointer hover:visible my-4">
                                <div className="invisible absolute -inset-1 bg-gradient-to-br from-orange-400 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:visible duration-900 ease-in-out"></div>
                                <Button className="relative tbtn w-full my-4 bg-gray-500 text-white cursor-not-allowed">
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                                </Button>
                            </div>
                        ) : (
                            <div className="relative group cursor-pointer hover:visible my-4">
                                <div className="invisible absolute -inset-1 bg-gradient-to-br from-orange-400 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:visible duration-900 ease-in-out"></div>
                                <Button
                                    type="submit"
                                    className="relative tbtn w-full my-4 bg-white text-black ring-1 ring-gray-900/5 rounded-lg leading-none flex items-center justify-center space-x-6 hover:text-blue-600 dark:text-sky-400"
                                >
                                    Submit Request
                                </Button>
                            </div>
                        )
                     }
                </form>
            </div>
            <Footer/>
        </div>
    );
};

export default RequestForm;