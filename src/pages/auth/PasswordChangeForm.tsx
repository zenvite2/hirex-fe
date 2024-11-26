import React, { useState } from 'react';

const PasswordChangeForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="max-w-md mx-auto my-8">
            <h1 className="text-2xl font-bold mb-6">Thay đổi mật khẩu</h1>
            <form className="space-y-4">
                <div>
                    <label htmlFor="old-password" className="block font-medium mb-1">
                        Mật khẩu hiện tại *
                    </label>
                    <input
                        id="old-password"
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập mật khẩu hiện tại"
                    />
                </div>
                <div>
                    <label htmlFor="new-password" className="block font-medium mb-1">
                        Mật khẩu mới *
                    </label>
                    <input
                        id="new-password"
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập mật khẩu mới"
                    />
                </div>
                <div>
                    <label htmlFor="confirm-password" className="block font-medium mb-1">
                        Nhập lại mật khẩu mới *
                    </label>
                    <input
                        id="confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập lại mật khẩu mới"
                    />
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="show-password"
                        checked={showPassword}
                        onChange={togglePasswordVisibility}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="show-password" className="text-sm font-medium">
                        Hiển thị mật khẩu
                    </label>
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-3 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-auto"
                >
                    Cập nhật mật khẩu
                </button>
            </form>
        </div>
    );
};

export default PasswordChangeForm;
