import React, { useState, useEffect } from 'react';
import Navbar from './shared/Navbar';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT, REQUEST_API_END_POINT } from '@/utils/constant';
import { Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSingleRequest } from '@/redux/requestSlice'; // Ensure this action exists
// Removed unused import
import useSetAllApplicate from '../hooks/useGetAllRequest'; // Ensure this hook exists
import Footer from './shared/Footer';

// Removed unused import

// Add your Mapbox access token 
const MAPBOX_ACCESS_TOKEN = (import.meta as any).env.VITE_MAPBOX_ACCESS_TOKEN;

const isProd = true;

const RequestForm = () => {
    let debounceTimeout: NodeJS.Timeout;
    const [, setAadhaarImage] = useState<File | null>(null); // Removed unused variable
    const [isProcessingAadhaar, setIsProcessingAadhaar] = useState(false);
    const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
    const [input, setInput] = useState({
        title: "",
        description: "",
        address: "",
        typeofration: "",
        location: "",
        department: "", // Add department field
        ratiocardnumber: "",
    });
    const [loading, setLoading] = useState(false);
    const [classifiedDepartment, setClassifiedDepartment] = useState<string | null>(null);
    const [isClassifying, setIsClassifying] = useState(false); // Separate loading state for classification
    // Removed unused state
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // Removed unused hook

    useEffect(() => {

        const classifyRequest = async () => {

            if (!input.description.trim()) {
                setClassifiedDepartment(null); // Reset classification if input is empty
                return;
            }
            setIsClassifying(true);
            await new Promise((resolve) => setTimeout(resolve, 100));
            try {

                const response = await fetch(
                    isProd
                        ? "https://easyrti-model.onrender.com/classify"
                        : "http://127.0.0.1:8000/classify",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include", // Use credentials for including credentials
                        body: JSON.stringify({ text: input.description }), // Pass data directly
                    }
                );


                if (!response.ok) {
                    throw new Error("Failed to classify the text");
                }

                const data = await response.json();
                console.log("Full API Response:", data); // Log the full API response

                // Safely access the department field and handle unknown class
                const summary = data?.department || "Unknown";
                console.log("Setting classifiedDepartment to:", summary); // Debug state update
                if (data.confidence > 0.4)
                    setClassifiedDepartment(summary); // Update state with the correct value
            } catch (error) {
                console.error("Error:", error);
                setIsClassifying(false);
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

    const handleAadhaarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAadhaarImage(file);
        setIsProcessingAadhaar(true);

        const formData = new FormData();
        formData.append("aadhaar", file);

        try {
            const response = await fetch(
                isProd ? "https://easyrti-model.onrender.com/extract-aadhaar"
                    : "http://127.0.0.1:8000/extract-aadhaar", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to process Aadhaar card");
            }

            const data = await response.json();
            console.log("Aadhaar Data:", data); // Log the full Aadhaar data for debugging

            if (data.success) {
                // Extract fields from the backend response
                const extractedAddress = data.data.ADDRESS || "Address not found";
                const extractedName = data.data.NAME || "Name not found";


                // Update input state with extracted data
                setInput((prev) => ({
                    ...prev,
                    address: extractedAddress,
                    title: extractedName, // Assuming 'title' is used for the name

                }));

                setIsAadhaarVerified(true);
                toast.success("Aadhaar card verified successfully!");
            } else {
                toast.error("Aadhaar verification failed. Please try again.");
            }
        } catch (error) {
            console.error("Error processing Aadhaar card:", error);
            toast.error("Failed to process Aadhaar card.");
        } finally {
            setIsProcessingAadhaar(false);
        }
    };

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
            // console.log(requestData);
            const res = await fetch(`${REQUEST_API_END_POINT}/post`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify(requestData),
            });

            const resData = await res.json();

            if (resData.success) {
                // Validate the request ID
                const requestId = resData.request?._id;
                if (!requestId) {
                    toast.error("Invalid request ID received from the server.");
                    setLoading(false);
                    return;
                }

                // Apply the request and update the Redux store
                const applyEndpoint = `${APPLICATION_API_END_POINT}/apply/${requestId}`;
                console.log("Applying request at endpoint:", applyEndpoint); // Debugging log
                const applyRes = await fetch(applyEndpoint, { credentials: "include" });
                const applyData = await applyRes.json();

                if (applyData.success) {
                    const updatedSingleRequest = {
                        ...resData.request,
                        applications: [...resData.request.applications, { applicant: applyData.userId }]
                    };
                    dispatch(setSingleRequest(updatedSingleRequest)); // Update Redux store
                    toast.success(applyData.message);

                    // Call the setAllApplicate hook
                    // setAllApplicate(requestId); // Pass the correct request ID
                } else {
                    toast.error(applyData.message || "Failed to apply the request.");
                }
                navigate("/viewstatus");
            }
        } catch (error: any) {
            console.error("Error during request submission:", error);
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
            // Clear all states after submission
            setInput({
                title: "",
                description: "",
                address: "",
                typeofration: "",
                location: "",
                department: "",
                ratiocardnumber: "",
            });
            setClassifiedDepartment(null);
        }
    };

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5'>
                {!isAadhaarVerified ? (
                    <div className="p-7 w-1/2 border border-gray-200 shadow-lg rounded-md">
                        <div className="text-3xl pt-3 pb-3">Upload Aadhaar Card</div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAadhaarUpload}
                            className="my-4"
                        />
                        {isProcessingAadhaar && (
                            <div className="my-4 p-2 border rounded-md bg-gray-100">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" /> Processing Aadhaar...
                            </div>
                        )}
                    </div>
                ) : (
                    <form onSubmit={submitHandler} className='p-7 w-1/2 border border-gray-200 shadow-lg rounded-md'>
                        <div className='text-3xl pt-3 pb-3'>RTI Request Form</div>
                        <div className='grid grid-cols-1 gap-2'></div>
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                name="title"
                                placeholder='Title Of Your Request'
                                value={input.title}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Address</Label>
                            <textarea
                                name="address"
                                value={input.address}
                                onChange={changeEventHandler}
                                placeholder='Enter Your Address'
                                className="resize-none focus-visible:ring-offset-0 focus-visible:ring-0 my-1 w-full border rounded-md p-2"
                                rows={2}
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
                                placeholder="Enter Your Current Location"
                            />
                            <div className="relative group cursor-pointer hover:visible mt-2 ">
                                <div className="relative invisible m-2 w-30 -inset-1 bg-gradient-to-br from-orange-400 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:visible duration-900 ease-in-out"></div>
                                <Button
                                    type="button"
                                    onClick={async () => {
                                        if (navigator.geolocation) {
                                            navigator.geolocation.getCurrentPosition(
                                                async (position) => {
                                                    const { latitude, longitude } = position.coords;
                                                    try {
                                                        const response = await fetch(
                                                            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
                                                        );
                                                        console.log(response);
                                                        const data = await response.json();
                                                        const location = data.features[0]?.place_name || `${latitude}, ${longitude}`;
                                                        setInput((prev) => ({ ...prev, location }));
                                                    } catch (error) {
                                                        console.error("Error fetching location from Mapbox:", error);
                                                        toast.error("Failed to fetch location.");
                                                    }
                                                },
                                                (error) => {
                                                    console.error("Geolocation error:", error);
                                                    toast.error("Unable to retrieve your location.");
                                                }
                                            );
                                        } else {
                                            toast.error("Geolocation is not supported by your browser.");
                                        }
                                    }}
                                    className="relative w-27 tbtn bg-white text-black ring-1 ring-gray-900/3 rounded-lg leading-none flex items-center justify-center hover:text-blue-600 dark:text-sky-400"
                                >
                                    Use Current Location
                                </Button>
                            </div>
                        </div>
                        <div>
                            <Label>Request</Label>
                            <textarea
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                placeholder='Enter Your RTI Request'
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 w-full border rounded-md p-2"
                                rows={10}
                            />
                            {isClassifying && (
                                <div className="my-4 p-2 border rounded-md bg-gray-100">
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin inline-block' /> Classifying...
                                </div>
                            )}
                            {classifiedDepartment && (
                                <div className="mt-1 text-sm text-gray-600">
                                    <strong>Predicted Department:</strong> {classifiedDepartment}
                                </div>
                            )}
                        </div>

                        <div>
                            <Label>Type of RationCard</Label>
                            <div className="flex flex-row my-2 gap-3">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="typeofration"
                                        value="Yellow"
                                        checked={input.typeofration === "Yellow"}
                                        onChange={changeEventHandler}
                                        className="form-radio"
                                    />
                                    <span>Yellow</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="typeofration"
                                        value="Orange"
                                        checked={input.typeofration === "Orange"}
                                        onChange={changeEventHandler}
                                        className="form-radio"
                                    />
                                    <span>Orange</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="typeofration"
                                        value="White"
                                        checked={input.typeofration === "White"}
                                        onChange={changeEventHandler}
                                        className="form-radio"
                                    />
                                    <span>White</span>
                                </label>
                            </div>
                            {input.typeofration === "Yellow" && (
                                <div className="mt-4">
                                    <Label>Ration Card Details</Label>
                                    <div className="flex items-center space-x-2 mt-2">

                                        <label htmlFor="rationcardnumber" className="text-sm text-gray-700">
                                            Provide Ration Card Details
                                        </label>
                                        <Input
                                            type="text"
                                            name="ratiocardnumber"
                                            value={input.ratiocardnumber}
                                            onChange={changeEventHandler}
                                            className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                            placeholder="Enter Your Ration Card Number"
                                        />
                                    </div>
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
                )}
            </div>
            <Footer />
        </div>
    );
};

export default RequestForm;
