import { setDepartments} from '@/redux/departmentSlice'
import { DEPARTMENT_API_END_POINT} from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllCompanies = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchCompanies = async () => {
            try {
                const res = await axios.get(`${DEPARTMENT_API_END_POINT}/get`,{withCredentials:true});
                console.log('called');
                if(res.data.success){
                    dispatch(setDepartments(res.data.companies));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchCompanies();
    },[])
}

export default useGetAllCompanies