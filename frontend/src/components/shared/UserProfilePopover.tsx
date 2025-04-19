import React, { useState } from 'react';
import { Popover } from '@headlessui/react';
import { Avatar } from '../ui/avatar'; // Adjusted the path to match the likely location
import { Link } from 'react-router-dom';

const UserProfilePopover = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popover>
            <Popover.Button as="div">
                <Avatar>
                    <img src="/path/to/profile.jpg" alt="User Profile" />
                </Avatar>
            </Popover.Button>
            <Popover.Panel className="bg-white shadow-lg rounded-lg p-4">
                <div className="flex items-center gap-2">
                    <Avatar>
                        <img src="/path/to/profile.jpg" alt="User Profile" />
                    </Avatar>
                    <div>
                        <h4 className="font-medium">John Doe</h4>
                        <p className="text-sm text-gray-500">johndoe@example.com</p>
                    </div>
                </div>
                <div className="mt-4">
                    <Link to="/profile" className="block text-blue-500 hover:underline">View Profile</Link>
                    <Link to="/settings" className="block text-blue-500 hover:underline">Settings</Link>
                    <button className="block text-red-500 hover:underline mt-2" onClick={() => console.log('Logout')}>Logout</button>
                </div>
            </Popover.Panel>
        </Popover>
    );
};

export default UserProfilePopover;
