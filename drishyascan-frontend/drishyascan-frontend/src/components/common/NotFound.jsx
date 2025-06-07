import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div>
                    <h2 className="mt-6 text-9xl font-extrabold text-gray-900">
                        404
                    </h2>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        Page not found
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                        Sorry, we couldn't find the page you're looking for.
                    </p>
                </div>
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Go back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound; 