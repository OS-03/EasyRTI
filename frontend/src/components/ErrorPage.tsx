import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <h1 className="text-6xl font-bold text-red-600 animate-bounce">Oops!</h1>
            <h2 className="text-4xl font-semibold mt-4">404 - Page Not Found</h2>
            <p className="mt-2 text-lg text-gray-600">
                Sorry, the page you are looking for does not exist.
            </p>
            <p className="mt-2 text-sm text-gray-500">
                If you are a government official, please contact the administrator for assistance.
            </p>
            <Link
                to="/"
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
                Go Back to Home
            </Link>
        </div>
    );
};

export default ErrorPage;