import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({children}:any) => {
    const {user} = useSelector((store: { auth: { user: { role: string } | null } }) => store.auth);

    const navigate = useNavigate();

    useEffect(()=>{
        if(user === null || user.role !== 'government'){
            navigate("/");
        }
    },[]);

    return (
        <>
        {children}
        </>
    )
};
export default ProtectedRoute;