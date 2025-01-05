import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { applyForgotPassword } from '../../services/authApi';

const ApplyForgotPassword: React.FC = () => {
    const [newPassword, setUsername] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const token = new URLSearchParams(window.location.search).get('token');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await applyForgotPassword({ newPassword, token });
            toast.success('Mật khẩu đã được đặt lại.');
        } catch (error) {
            // toast.error(res.data.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Đặt lại mật khẩu</h1>
                <p className="mb-4 text-gray-700 text-center">
                    Hãy nhập mật khẩu mới.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Mật khẩu mới
                        </label>
                        <input
                            placeholder='Mật khẩu mới'
                            type="text"
                            value={newPassword}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Đang gửi...' : 'Đặt lại mật khẩu'}
                    </button>
                </form>
                <div className="text-center mt-4">
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Quay trở lại trang đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ApplyForgotPassword;