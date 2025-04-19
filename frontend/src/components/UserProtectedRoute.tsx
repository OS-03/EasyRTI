import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserProtectedRoute = ({children}:any) => {
    const {user} = useSelector((store: { auth: { user: { role: string } | null } }) => store.auth);

    const navigate = useNavigate();

    useEffect(()=>{
        if(user == null || user.role === 'government' || user.role === ''){
            navigate("/");
        }
    },[]);

    return (
        <>
        {children}
        </>
    )
};
export default UserProtectedRoute;