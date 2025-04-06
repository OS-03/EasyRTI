import { setSingleDepartment } from '@/redux/departmentSlice'
import { DEPARTMENT_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetDepartmentById = (departmentId: string) => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchSingleDepartment = async () => {
            try {
                const res = await axios.get(`${DEPARTMENT_API_END_POINT}/get/${departmentId}`,{withCredentials:true});
                console.log(res.data.department);
                if(res.data.success){
                    dispatch(setSingleDepartment(res.data.department));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleDepartment();
    },[departmentId, dispatch])
}

export default useGetDepartmentById