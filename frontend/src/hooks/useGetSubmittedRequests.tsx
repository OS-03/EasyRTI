import {  setAllSubmittedRequests } from "@/redux/requestSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

const useGetSubmittedRequest = () => {
    const dispatch = useDispatch();

    useEffect(()=>{
        const fetchSubmittedRequest = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {withCredentials:true});
                if(res.data.success){
                    dispatch(setAllSubmittedRequests(res.data.application));
                }
            } catch (error) {
                console.log("Error fetching submitted requests:", error);
            }
        }
        fetchSubmittedRequest();
    },[])
};
export default useGetSubmittedRequest;