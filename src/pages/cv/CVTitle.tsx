import React from 'react'

const CVTitle: React.FC<{ title: string }> = ({ title }) => {

    return (
        <div className="py-2 rounded-t-md">
            <div className="flex items-center">
                <div className="w-[20px] border-b-2 border-blue-700 rounded-l-md"></div>
                <div className="border-2 border-blue-600 rounded-md px-2">
                    <h2 className="text-blue-800 font-bold font-md">{title}</h2>
                </div>
                <div className="flex-1 border-b-2 border-blue-700 rounded-r-md"></div>
            </div>
        </div>
    )
}

export default CVTitle;