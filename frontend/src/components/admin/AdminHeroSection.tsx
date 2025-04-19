import React, { useState } from "react";
import { Button } from "../ui/button";
import { Settings, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";


const AdminHeroSection = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        // Logic to handle admin-specific search functionality
        console.log("Admin Search Query:", searchQuery);
        // navigate("/admin/search-results");
    };

    const handleManagePortal = () => {
        // Navigate to portal management page
        navigate("/admin/department");
    };

    const handleViewReports = () => {
        // Navigate to reports and analytics page
        navigate("/admin/applicants");
    };

    return (
        <div className="text-center bg-white-100 py-10">
            <div className="flex flex-col gap-6 my-10">
                <h1 className="text-5xl font-semibold bg-gradient-to-br from-orange-600 via-orange-100 via-neutral-100 to-emerald-500 bg-clip-text text-transparent font-script drop-shadow-sm">
                    Admin Dashboard
                </h1>
                <p className="text-lg text-gray-600">
                    Manage and oversee all RTI requests, user activities, and system analytics.
                </p>
                <div className="flex justify-center gap-4">
                    <Button
                        onClick={handleManagePortal}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
                    >
                        <Settings className="h-5 w-5 mr-2" />
                        Manage Departments
                    </Button>
                    <Button
                        onClick={handleViewReports}
                        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
                    >
                        <BarChart2 className="h-5 w-5 mr-2" />
                        View Applicants
                    </Button>
                </div>
                <div className="flex w-[50%] shadow-lg border border-gray-300 pl-3 rounded-full items-center gap-4 mx-auto">
                    <input
                        type="text"
                        placeholder="Search RTI Requests or Users..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="outline-none border-none w-full"
                    />
                    <Button onClick={handleSearch} className="rounded-r-full bg-[#1caa76]">
                        Search
                    </Button>
                </div>
                <div className="px-4 sm:px-20 md:px-30 lg:px-60 xl:px-60 font-light">
                    <p className="text-justify text-gray-700">
                        Welcome to the Admin Dashboard. Here, you can manage the RTI portal efficiently by overseeing user requests, generating detailed reports, and ensuring smooth operations. Utilize the tools provided to maintain transparency and streamline the RTI process for all users.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminHeroSection;