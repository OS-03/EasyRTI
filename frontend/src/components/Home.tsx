import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store"; // Ensure the file exists and the path is correct
import HeroSection from "./HeroSection";
import SpeechChatbot from "./SpeechChatbot";

const Home: React.FC = () => {

    const { user } = useSelector((store: RootState) => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === "government") {
            navigate("/admin/dashboard");
        }
    }, [user, navigate]);

    return (
        <div >
            <Navbar />
            <HeroSection />
            <SpeechChatbot/>
            <Footer />
        </div>
    );
};

export default Home;
