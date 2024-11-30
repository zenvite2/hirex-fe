import React from "react";
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin, FaTiktok } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

const Footer = () => {
    return (
        <footer className="bg-dark-blue text-white py-10">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-6xl justify-center items-start">
                {/* About HireX */}
                <div className="mx-auto w-full max-w-xs">
                    <h3 className="text-lg font-bold mb-4 text-center">About HireX</h3>
                    <ul className="space-y-2 text-center">
                        {[
                            { label: "About us", href: "#" },
                            { label: "Operation Regulation", href: "#" },
                            { label: "Privacy Policy", href: "#" },
                            { label: "Terms of Use", href: "#" },
                            { label: "Contact us", href: "#" },
                            { label: "Site Map", href: "#" },
                            { label: "HireX.asia", href: "#" }
                        ].map(({ label, href }) => (
                            <li key={label}>
                                <a href={href} className="hover:text-gray-300 transition-colors">
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Job Seekers */}
                <div className="mx-auto w-full max-w-xs">
                    <h3 className="text-lg font-bold mb-4 text-center">Job Seekers</h3>
                    <ul className="space-y-2 text-center">
                        {[
                            { label: "Jobs", href: "#" },
                            { label: "Quick Job Search", href: "#" },
                            { label: "Companies", href: "#" },
                            { label: "Career Tools", href: "#" },
                            { label: "CV Templates", href: "#" },
                            { label: "Japanese Study Consulting", href: "#" }
                        ].map(({ label, href }) => (
                            <li key={label}>
                                <a href={href} className="hover:text-gray-300 transition-colors">
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Employers */}
                <div className="mx-auto w-full max-w-xs">
                    <h3 className="text-lg font-bold mb-4 text-center">Employers</h3>
                    <ul className="space-y-2 text-center">
                        {[
                            { label: "Executive Search", href: "#" },
                            { label: "Hiring Advice", href: "#" }
                        ].map(({ label, href }) => (
                            <li key={label}>
                                <a href={href} className="hover:text-gray-300 transition-colors">
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex justify-center space-x-6 mt-8">
                {[
                    { Icon: FaFacebook, href: "/" },
                    { Icon: FaInstagram, href: "/" },
                    { Icon: FaYoutube, href: "/" },
                    { Icon: FaLinkedin, href: "/" },
                    { Icon: SiZalo, href: "/" },
                    { Icon: FaTiktok, href: "/" }
                ].map(({ Icon, href }, index) => (
                    <a
                        key={index}
                        href={href}
                        className="text-white hover:text-gray-300 transition-colors"
                    >
                        <Icon size={24} />
                    </a>
                ))}
            </div>

            {/* App Download Links */}
            <div className="flex justify-center mt-6 space-x-4">
                {[
                    {
                        icon: "/assets/gg-play.png",
                        alt: "Google Play",
                        text: "Download on Google Play"
                    },
                    {
                        icon: "/assets/app-store.png",
                        alt: "App Store",
                        text: "Download on the App Store"
                    }
                ].map(({ icon, alt, text }, index) => (
                    <a
                        key={index}
                        href="/"
                        className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <img src={icon} alt={alt} className="w-6 h-6" />
                        <span className="text-sm">{text}</span>
                    </a>
                ))}
            </div>

            {/* Copyright Section */}
            <div className="text-center mt-8 text-sm space-y-2">
                <p>
                    Jobs & Job search, find jobs in Vietnam, executive jobs, work, Employment &mdash;
                    <a href="https://deploy-hirexptit.io.vn" className="underline ml-1">HireX.vn</a>
                </p>
                <p>CTY TNHH HireX | GPKD số 0400539269</p>
                <p>
                    Copyright © 2024-{new Date().getFullYear()} by
                    <a href="https://deploy-hirexptit.io.vn" className="underline ml-1">
                        HireX.vn
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;