import React from 'react';

const HelpSupport: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-400">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Help and Support</h1>
                <p className="mb-4 text-gray-700 text-center">Nếu bạn gặp vấn đề cần sự hỗ trợ, hãy liên hệ</p>
                <div className="text-center">
                    <p className="mb-2 text-gray-700">
                        <span className="font-semibold">Email:</span> contact.hirexteam@gmail.com
                    </p>
                    <p className="mb-2 text-gray-700">
                        <span className="font-semibold">Phone:</span> +123 456 7890
                    </p>
                </div>
                <div className="mt-6 text-center">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpSupport;