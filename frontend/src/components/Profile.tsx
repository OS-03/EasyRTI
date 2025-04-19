import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'


const Profile = () => {

    const [open, setOpen] = useState(false);
    const { user } = useSelector((store: RootState) => store.auth);

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white shadow-md border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                            <p>{user?.profile?.bio}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right" variant="outline"><Pen /></Button>
                </div>
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phoneNumber}</span>
                    </div>
                </div>
                <div className='flex my-5'>

                    <div className='items-center'> 
                        {   
                            user?.updatedAt ? (
                            <h1>Profile Updated on - {new Date(user.updatedAt).toLocaleString()}</h1>
                            ) : (
                                <span>N/A</span>
                            )
                        }
                    </div>

                </div>
            </div>
            <UpdateProfileDialog className="bg-white-300 opacity=1" open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile