import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import axios from 'axios';
import { DEPARTMENT_API_END_POINT } from '@/utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store'; // Adjust the path to your store file
import useGetDepartmentById from '@/hooks/useGetDepartmentById';

const DepartmentSetup = () => {
    const params = useParams();

    useGetDepartmentById(params.id || '');
    const [input, setInput] = useState({
        name: '',
        description: '',
        location: '',
        file: null,
    })
    const { singleDepartment } = useSelector((store: RootState) => store.department) as { singleDepartment: { name: string; description: string; location: string } | null };
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e:any) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e:any) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    };

    const submitHandler = async (e:any) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', input.name);
        formData.append('description', input.description);
        formData.append('location', input.location);
        if (input.file) {
            formData.append('file', input.file);
        }
        try {
            setLoading(true);
            const res = await axios.put(`${DEPARTMENT_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/admin/department');
            }
        } catch (error:any) {
            console.error(error);
            toast.error(error.response.data.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (singleDepartment) {
            setInput({
                name: singleDepartment.name ,
                description: singleDepartment.description,
                location: singleDepartment.location,
                file: null,
            });
        }
    }, [singleDepartment]);

    return (
        <div>
            <Navbar />
            <div className="max-w-xl mx-auto my-10">
                <form onSubmit={submitHandler}>
                    <div className="flex items-center gap-5 p-8">
                        <Button
                            onClick={() => navigate('/admin/departments')}
                            variant="outline"
                            className="flex items-center gap-2 text-gray-500 font-semibold"
                        >
                            <ArrowLeft />
                            <span>Back</span>
                        </Button>
                        <h1 className="font-bold text-xl">Department Setup</h1>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Department Name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Logo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={changeFileHandler}
                            />
                        </div>
                    </div>
                    {loading ? (
                        <Button className="w-full my-4">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full my-4">
                            Update
                        </Button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default DepartmentSetup;