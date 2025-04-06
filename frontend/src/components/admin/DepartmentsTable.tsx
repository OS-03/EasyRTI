import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, MoreHorizontal, Trash2 } from 'lucide-react'; // Import Trash2 icon
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { setDepartments } from '../../redux/departmentSlice';
import { DEPARTMENT_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

interface Department {
    _id: string;
    name: string;
    logo: string;
    createdAt: string;
}

function DepartmentsTable() {
    const dispatch = useDispatch();
    const { departments, searchDepartmentByText } = useSelector((store: RootState) => store.department);
    const [filterDepartment, setFilterDepartment] = useState<Department[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchDepartments() {
            try {
                axios.defaults.withCredentials = true;
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`${DEPARTMENT_API_END_POINT}/get`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = response.data;

                if (data && Array.isArray(data.department)) {
                    dispatch(setDepartments(data.department));
                } else {
                    console.error('Invalid data format:', data);
                    dispatch(setDepartments([]));
                }
            } catch (error) {
                console.error('Failed to fetch departments:', error);
                dispatch(setDepartments([]));
            }
        }
        fetchDepartments();
    }, [dispatch]);

    useEffect(() => {
        if (!departments) return;
        const filteredDepartment = departments.filter((department: Department) => {
            if (!searchDepartmentByText) {
                return true;
            }
            return department?.name?.toLowerCase().includes(searchDepartmentByText.toLowerCase());
        });
        setFilterDepartment(filteredDepartment);
    }, [departments, searchDepartmentByText]);

    const handleDelete = async (departmentId: string) => {
        try {
            const token = localStorage.getItem('authToken');
            console.log(departmentId);
            await axios.delete(`${DEPARTMENT_API_END_POINT}/delete/${departmentId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            // Remove the deleted department from the Redux store
            dispatch(setDepartments(departments.filter((dept: Department) => dept._id !== departmentId)));
        } catch (error) {
            console.error('Failed to delete department:', error);
        }
    };

    return (
        <div>
            <TableCaption className='block justify-center text-lg font-semibold text-gray-700 mb-5'><h3>A list of your recent registered department</h3></TableCaption>
            <Table className='w-full border border-gray-200 rounded-lg shadow-sm'>
                <TableHeader className='bg-gray-100'>
                    <TableRow>
                        <TableHead className='px-4 py-2 text-left text-sm font-medium text-gray-600'>Logo</TableHead>
                        <TableHead className='px-4 py-2 text-left text-sm font-medium text-gray-600'>Name</TableHead>
                        <TableHead className='px-4 py-2 text-left text-sm font-medium text-gray-600'>Date</TableHead>
                        <TableHead className="px-4 py-2 text-right text-sm font-medium text-gray-600">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className='divide-y divide-gray-200 rounded-xl'>
                    {
                        filterDepartment?.map((department: Department) => (
                            <TableRow key={department._id} className='hover:bg-gray-50'>
                                <TableCell className='px-4 py-2'>
                                    <Avatar className='w-10 h-10'>
                                        <AvatarImage src={department.logo} alt={`${department.name} logo`} />
                                    </Avatar>
                                </TableCell>
                                <TableCell className='px-4 py-2 text-sm text-gray-700'>{department.name}</TableCell>
                                <TableCell className='px-4 py-2 text-sm text-gray-500'>{department.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="px-4 py-2 text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger className='inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-100'>
                                            <MoreHorizontal className='w-5 h-5 text-gray-600' />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32 bg-white border border-gray-200 rounded-lg shadow-lg">
                                            <div onClick={() => navigate(`/admin/department/${department._id}`)} className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer'>
                                                <Edit2 className='w-4 h-4' />
                                                <span>Edit</span>
                                            </div>
                                            <div onClick={() => handleDelete(department._id)} className='flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-100 cursor-pointer'>
                                                <Trash2 className='w-4 h-4' />
                                                <span>Delete</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    );
}

export default DepartmentsTable;