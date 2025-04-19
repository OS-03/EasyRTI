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
            <div className="fixed bottom-5 left-5 bg-white px-5 py-5 shadow-xl rounded-lg z-50 w-3/4">
                <p className="text-gray-700 w-75">
                    We use cookies to enhance your browsing experience, analyze site traffic, 
                    and personalize content. By clicking "Accept", you consent to our use of cookies. 
                    To learn more about how we use cookies and how you can manage your preferences, 
                    please visit our
                    <a href="/" className="text-blue-600 hover:underline"> Privacy Policy</a> and
                    <a href="/" className="text-blue-600 hover:underline"> Cookie Policy</a>.
                </p>
                <div className="flex justify-start gap-10">
                    <div className="relative group cursor-pointer hover:visible">
                        <div className="invisible absolute my-5 -inset-1 bg-gradient-to-br from-orange-400 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:visible duration-900 ease-in-out"></div>
                        <button
                            onClick={handleAccept}
                            className="relative shadow-md px-5 py-3 tbtn w-full my-4 bg-white text-black ring-1 ring-gray-900/5 rounded-lg leading-none flex items-center justify-center space-x-6 hover:text-blue-600 dark:text-sky-400"
                        >
                            Accept
                        </button>
                    </div>
                    <div className="relative group cursor-pointer hover:visible">
                        <div className="invisible absolute my-5 -inset-1 bg-gradient-to-br from-orange-400 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:visible duration-900 ease-in-out"></div>
                        <button
                            onClick={handleReject}
                            className="relative shadow-md px-5 py-3  tbtn w-full my-4 bg-white text-black ring-1 ring-gray-900/5 rounded-lg leading-none flex items-center justify-center space-x-6 hover:text-blue-600 dark:text-sky-400"
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

