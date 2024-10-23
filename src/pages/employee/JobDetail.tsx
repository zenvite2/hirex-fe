import React from 'react';

const JobDetail = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto p-6">
                <div className=" flex gap-6 ">
                    {/* Main Content */}
                    <div className="bg-white flex-1 p-6 rounded-xl shadow-sm">
                        {/* Header Section */}
                        <div className=" bg-white flex items-start justify-between mb-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                                    <span className="text-xl font-semibold text-gray-800">P</span>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">UI/UX Designer</h1>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <span className="text-blue-500 hover:underline cursor-pointer">Pixelz Studio</span>
                                        <span>•</span>
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            <span>Yogyakarta, Indonesia</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 mt-2 text-[15px] text-gray-500">
                                        <span>Fulltime</span>
                                        <span>Remote</span>
                                        <span>2-4 Years</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                </button>
                                <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                </button>
                                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
                                    Apply Now
                                </button>
                            </div>
                        </div>

                        {/* About Section */}
                        <section className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">About this role</h2>
                            <p className="text-gray-600 leading-relaxed">
                                As an UI/UX Designer on Pixelz Studio, you'll focus on design user-friendly on several platform (web, mobile, dashboard, etc) to our user's needs. Your innovative solution will enhance the user experience on several platforms. Join us and let's making impact on user engagement at Pixelz Studio.
                            </p>
                        </section>

                        {/* Qualification Section */}
                        <section className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Qualification</h2>
                            <ul className="space-y-2.5 text-gray-600 leading-relaxed">
                                <li className="flex gap-3">
                                    <span className="text-gray-400 mt-2">•</span>
                                    <span>At least 2-4 years of relevant experience in product design or related roles.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-gray-400 mt-2">•</span>
                                    <span>Knowledge of design validation, either through quantitative or qualitative research.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-gray-400 mt-2">•</span>
                                    <span>Have good knowledge using Figma and Figjam</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-gray-400 mt-2">•</span>
                                    <span>Experience with analytics tools to gather data from users.</span>
                                </li>
                            </ul>
                        </section>

                        {/* Responsibility Section */}
                        <section className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Responsibility</h2>
                            <ul className="space-y-2.5 text-gray-600 leading-relaxed">
                                <li className="flex gap-3">
                                    <span className="text-gray-400 mt-2">•</span>
                                    <span>Create design and user journey on every features and product/business units across multiples devices (Web+App)</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-gray-400 mt-2">•</span>
                                    <span>Identifying design problems through user journey and devising elegant solutions</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-gray-400 mt-2">•</span>
                                    <span>Develop low and hi fidelity designs, user experience flow, & prototype, translate it into highly-polished visual composites following style and brand guidelines.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-gray-400 mt-2">•</span>
                                    <span>Brainstorm and works together with Design Lead, UX Engineers, and PMs to execute a design sprint on specific story or task</span>
                                </li>
                            </ul>
                        </section>
                    </div>

                    {/* Similar Jobs Sidebar */}
                    <div className="w-80">
                        <section className="sticky top-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Similar Jobs</h2>
                            <div className="space-y-4">
                                {[
                                    {
                                        title: "Lead UI Designer",
                                        company: "Gojek",
                                        location: "Jakarta, Indonesia",
                                        type: "Fulltime",
                                        workplace: "Onsite",
                                        experience: "3-5 Years",
                                        time: "2 days ago",
                                        applicants: "521 Aplicants",
                                        letter: "G"
                                    },
                                    {
                                        title: "Sr. UX Designer",
                                        company: "GoPay",
                                        location: "Jakarta, Indonesia",
                                        type: "Fulltime",
                                        workplace: "Onsite",
                                        experience: "3-5 Years",
                                        time: "2 days ago",
                                        applicants: "210 Aplicants",
                                        letter: "G"
                                    }
                                ].map((job, index) => (
                                    <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300">
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-3">
                                                <div className="w-11 h-11 bg-gray-50 rounded-lg flex items-center justify-center">
                                                    <span className="font-semibold text-gray-800">{job.letter}</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                                                    <div className="text-[15px] text-gray-600">
                                                        {job.company} • {job.location}
                                                    </div>
                                                    <div className="flex gap-6 mt-1 text-[15px] text-gray-500">
                                                        <span>{job.type}</span>
                                                        <span>{job.workplace}</span>
                                                        <span>{job.experience}</span>
                                                    </div>
                                                    <div className="text-sm text-gray-500 mt-2">
                                                        {job.time} • {job.applicants}
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;