import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import DepartmentsTable from './DepartmentsTable'
import { useNavigate } from 'react-router-dom'
import useGetAllDepartments from '../../hooks/useGetAllDepartments'
import { useDispatch } from 'react-redux'
import { setSearchDepartmentByText } from '../../redux/departmentSlice'
import Footer from '../shared/Footer'

const Departments = () => {
    useGetAllDepartments();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(setSearchDepartmentByText(input));
    },[input]);
    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10 p-5 bg-white shadow-md rounded-lg'>
                <div className='flex items-center justify-between my-5'>
                    <Input
                        className="w-1/3 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Filter by name"
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button
                        className="relative tbtn bg-white text-black ring-1 ring-gray-900/5 rounded-lg leading-none flex items-center justify-center space-x-6 hover:text-blue-600 dark:text-sky-400"
                        onClick={() => navigate(`/admin/department/create`)}
                    >
                        New Department
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <DepartmentsTable />
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Departments