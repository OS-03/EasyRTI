import React from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import useGetAllAdminRequests from '@/hooks/useGetAllAdminRequests';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { toast } from 'sonner';

function Rules() {
    const navigate = useNavigate();
    useGetAllAdminRequests(); // Fetch all admin requests

    const handleProceed = (event: React.MouseEvent) => {
        event.preventDefault(); // Prevent default behavior
        try {
            navigate('/submitrequest'); // Navigate to the RequestForm component
        } catch (error) {
            console.error('Error navigating to /submitrequest:', error);
        }
    };

    const handleCancel = (event: React.MouseEvent) => {
        event.preventDefault(); // Prevent default behavior
        try {
            toast.error("Please Login In To Request an RTI");
            navigate('/'); // Redirect to home
        } catch (error) {
            console.error('Error navigating to home:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-8 mb-8">
                <h2 className="text-xl font-bold mb-4">Guidelines for Use of RTI Online Portal</h2>
                <ul className="list-disc list-inside text-gray-800 mb-4">
                    <li>This Web Portal can be used by Indian citizens to file RTI applications online and make payments for RTI applications.</li>
                    <li>First appeals can also be filed online.</li>
                    <li>The fields marked * are mandatory while the others are optional.</li>
                    <li>The text of the application may be written at the prescribed column (limited to 3000 characters).</li>
                    <li>Only alphabets A-Z a-z, numbers 0-9, and special characters , . - _ ( ) / @ : & ? \ % are allowed in the text.</li>
                    <li>Applications exceeding 3000 characters can be uploaded as an attachment using the "Supporting document" column.</li>
                    <li>Do not upload Aadhar Card, PAN Card, or any other personal identification (except BPL Card).</li>
                    <li>PDF file names should not have blank spaces.</li>
                    <li>After filling the first page, click "Make Payment" to pay the prescribed fee via Internet banking, credit/debit cards, UPI, or RuPay Card.</li>
                    <li>If the registration number is not received within 24-48 hours after payment, contact helprtionline-dopt[at]nic[dot]in with transaction details.</li>
                    <li>No RTI fee is required for citizens below the poverty line (attach a valid certificate).</li>
                    <li>On submission, a unique registration number will be issued for future reference.</li>
                    <li>The application will be electronically transmitted to the concerned Ministry/Department.</li>
                    <li>Additional fees, if required, will be intimated through the portal or email alert.</li>
                    <li>For first appeals, click "Submit First Appeal" and use the original application's registration number for reference.</li>
                    <li>No fee is required for first appeals as per the RTI Act.</li>
                    <li>Submit your mobile number to receive SMS alerts.</li>
                    <li>View the status of RTI applications/first appeals by clicking "View Status".</li>
                </ul>
                <div className="flex justify-between">
                   
                    <div className="relative group cursor-pointer hover:visible my-4">
                        <div className="invisible absolute my-5 -inset-1 bg-gradient-to-br from-orange-400 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:visible duration-900 ease-in-out"></div>
                        <Button
                            type="button"
                            onClick={handleCancel}
                            className="relative tbtn w-full my-4 bg-white text-black ring-1 ring-gray-900/5 rounded-lg leading-none flex items-center justify-center space-x-6 hover:text-blue-600 dark:text-sky-400"
                        >
                            Cancel
                        </Button>
                    </div>
                    <div className="relative group cursor-pointer hover:visible my-4">
                        <div className="invisible absolute my-5 -inset-1 bg-gradient-to-br from-orange-400 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:visible duration-900 ease-in-out"></div>
                        <Button
                            type="button"
                            onClick={handleProceed}
                            className="relative tbtn w-full my-4 bg-white text-black ring-1 ring-gray-900/5 rounded-lg leading-none flex items-center justify-center space-x-6 hover:text-blue-600 dark:text-sky-400"
                        >
                            I have read and understood the above guidelines
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Rules;