import React, { useState, useEffect } from 'react';
import { Popover } from './ui/popover';

const CookiesPopover = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const userChoice = localStorage.getItem('cookiesAccepted');
        if (userChoice === null) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookiesAccepted', 'true');
        setIsVisible(false);
    };

    const handleReject = () => {
        localStorage.setItem('cookiesAccepted', 'false');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <Popover open={isVisible}>
            <div className="fixed bottom-5 left-5 bg-white p-4 shadow-lg rounded-lg z-50">
                <p className="mb-4 text-gray-700">We use cookies to improve your experience. Do you accept?</p>
                <div className="flex space-x-2">
                    <div className="relative group cursor-pointer hover:visible my-4">
                        <div className="invisible absolute -inset-1 bg-gradient-to-br from-orange-400 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:visible duration-900 ease-in-out"></div>
                        <button
                            onClick={handleAccept}
                            className="relative px-5 py-3 tbtn w-full my-4 bg-white text-black ring-1 ring-gray-900/5 rounded-lg leading-none flex items-center justify-center space-x-6 hover:text-blue-600 dark:text-sky-400"
                        >
                            Accept
                        </button>
                    </div>
                    <div className="relative group cursor-pointer hover:visible my-4">
                        <div className="invisible absolute -inset-1 bg-gradient-to-br from-orange-400 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:visible duration-900 ease-in-out"></div>
                        <button
                            onClick={handleReject}
                            className="relative px-5 py-3 tbtn w-full my-4 bg-white text-black ring-1 ring-gray-900/5 rounded-lg leading-none flex items-center justify-center space-x-6 hover:text-blue-600 dark:text-sky-400"
                        >
                            Reject
                        </button>
                    </div>
                </div>
            </div>
        </Popover>
    );
};

export default CookiesPopover;

