import { setAllAdminResponse } from '@/redux/requestSlice'
import { REQUEST_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllAdminRequests = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchAllAdminJobs = async () => {
            try {
                const res = await axios.get(`${REQUEST_API_END_POINT}/getadminrequest`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setAllAdminResponse(res.data.request));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllAdminJobs();
    },[])
}

export default useGetAllAdminRequests