import React, { useState } from 'react';
import { changePassword } from '../../services/authApi'; 
import useAppDispatch from '../../hooks/useAppDispatch';
import { toast } from 'react-toastify';

const PasswordChangeForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Validation states
    const [errors, setErrors] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        };

        // Current password validation
        if (!oldPassword.trim()) {
            newErrors.oldPassword = 'Vui lòng nhập mật khẩu hiện tại';
            isValid = false;
        }

        // New password validation
        if (!newPassword.trim()) {
            newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
            isValid = false;
        } else if (newPassword.length < 8) {
            newErrors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự';
            isValid = false;
        }

        // Confirm password validation
        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu mới';
            isValid = false;
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu mới không khớp';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        try {
            // Dispatch the change password action
            const result = await dispatch(changePassword({
                oldPassword,
                newPassword,
                confirmPassword
            }));

            // Check if the action was successful
            if (changePassword.fulfilled.match(result)) {
                toast.success('Cập nhật mật khẩu thành công!');

                // Reset form fields
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            toast.success('Cập nhật mật khẩu thất bại!');
        }
    };

    return (
        <div className="max-w-md mx-auto my-8">
            <h1 className="text-2xl font-bold mb-6">Thay đổi mật khẩu</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="old-password" className="block font-medium mb-1">
                        Mật khẩu hiện tại *
                    </label>
                    <input
                        id="old-password"
                        type={showPassword ? 'text' : 'password'}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            errors.oldPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nhập mật khẩu hiện tại"
                    />
                    {errors.oldPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="new-password" className="block font-medium mb-1">
                        Mật khẩu mới *
                    </label>
                    <input
                        id="new-password"
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            errors.newPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nhập mật khẩu mới"
                    />
                    {errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="confirm-password" className="block font-medium mb-1">
                        Nhập lại mật khẩu mới *
                    </label>
                    <input
                        id="confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nhập lại mật khẩu mới"
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
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