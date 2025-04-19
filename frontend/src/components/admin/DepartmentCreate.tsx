import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { DEPARTMENT_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleDepartment } from '@/redux/departmentSlice'

const DepartmentCreate = () => {
    const navigate = useNavigate();
    const [departmentName, setDepartmentName] = useState('');
    const dispatch = useDispatch();

    const registerNewDepartment = async () => {

        try {
            const res = await axios.post(`${DEPARTMENT_API_END_POINT}/register`, { departmentName }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            console.log(res);

            if (res.data.success) {
                dispatch(setSingleDepartment(res.data.department));
                toast.success(res.data.message);
                const departmentId = res.data?.department?._id;
                navigate(`/admin/department/${departmentId}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto'>
                <div className='my-10'>
                    <h1 className='font-bold text-2xl'>Your Department Name</h1>
                    <p className='text-gray-500'>What would you like to name your department? You can change this later.</p>
                </div>

                <Label>Department Name</Label>
                <Input
                    type="text"
                    className="my-2"
                    placeholder="Health and Science, Jharkhand"
                    onChange={(e) => setDepartmentName(e.target.value)}
                />
                <div className='flex items-center gap-2 my-10'>
                    <Button variant="outline" onClick={() => navigate('/admin/department')}>Cancel</Button>
                    <Button onClick={registerNewDepartment}>Continue</Button>
                </div>
            </div>
        </div>
    )
}

export default DepartmentCreate