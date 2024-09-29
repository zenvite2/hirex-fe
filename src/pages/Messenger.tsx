import React, { useState } from 'react';

const Messenger: React.FC = () => {

    return (
        <div className="container mx-auto p-4 gap-2.5 bg-customBlue flex items-center">
            <img
                className="w-8 h-8 rounded-full"
                src="https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png"
                alt="Jese image"
            />
            <div className="flex flex-col gap-1 w-full max-w-[320px]">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Bonnie Green
                    </span>
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        11:46
                    </span>
                </div>
                <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                    <p className="text-sm font-normal text-gray-900 dark:text-white">
                        That's awesome. I think our users will really appreciate the improvements.
                    </p>
                </div>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    Delivered
                </span>
            </div>
        </div>
    );
};

export default Messenger;
