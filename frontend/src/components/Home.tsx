import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
// import HeroSection from "./HeroSection";
// import CategoryCarousel from "./CategoryCarousel";
// import LatestJobs from "./LatestJobs";
import Footer from "./shared/Footer";
// import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store"; // Ensure the file exists and the path is correct
//import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import HeroSection from "./HeroSection";
import SpeechChatbot from "./SpeechChatbot";

const Home: React.FC = () => {
    // useGetAllJobs();
    const { user } = useSelector((store: RootState) => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === "government") {
            navigate("/admin/department");
        }
    }, [user, navigate]);

    return (
        <div >
            <Navbar />
            <HeroSection />
            {/* <CategoryCarousel /> */}
            {/* <LatestJobs /> */}
            <SpeechChatbot/>
            <Footer />
        </div>
    );
};

export default Home;
