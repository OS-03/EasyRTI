import { setAllRequests } from '@/redux/requestSlice'
import { REQUEST_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'


const useGetAllRequest = () => {
    const dispatch = useDispatch();
    const {searchedQuery} = useSelector((store: RootState) => store.request);
    useEffect(()=>{
        const fetchAllRequests = async () => {
            try {
                const res = await axios.get(`${REQUEST_API_END_POINT}/get?keyword=${searchedQuery}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setAllRequests(res.data.requests));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllRequests();
    },[])
}

export default useGetAllRequest
