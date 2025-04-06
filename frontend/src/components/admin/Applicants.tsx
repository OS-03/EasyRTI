import { useEffect, useCallback } from 'react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setAllApplicants } from '@/redux/applicationSlice';
import ApplicantsTable from './ApplicantsTable'; // Import ApplicantsTable component

const Applicants = () => {
    const { applicants = []} = useSelector((store: RootState) => store.application) || { applications: [] };
    const dispatch = useDispatch();

    // Fetch all applicants
    const fetchAllApplicants = useCallback(async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setAllApplicants(res.data.applicants)); // Update Redux store with applicants           
            }
        } catch (error) {
            console.error('Error fetching applicants:', error);
        }
    }, [dispatch]);

    useEffect(() => {
        // Fetch all applicants on component mount
        fetchAllApplicants();
    }, [fetchAllApplicants]);

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto">
                <h1 className="font-bold text-xl my-5 mx-5">Applicants ({applicants?.length })</h1>
                {/* Render ApplicantsTable */}
                <ApplicantsTable
                    applicants={applicants} 
                    fetchAllApplicants={fetchAllApplicants} // Pass fetchAllApplicants as a prop
                />
            </div>
            <Footer />
        </div>
    );
};

export default Applicants;