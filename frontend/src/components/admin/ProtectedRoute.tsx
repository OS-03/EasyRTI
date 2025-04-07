import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({children}:any) => {
    const {user} = useSelector((store: { auth: { user: { role: string } | null } }) => store.auth);

    const navigate = useNavigate();

    useEffect(()=>{
        if(user === null || user.role !== 'government'){
            navigate("/");
        }
    },[user, navigate]);

    // Ensure Axios is configured to send credentials
    axios.defaults.withCredentials = true;

    return (
        <>
        {children}
        </>
    )
};
export default ProtectedRoute;