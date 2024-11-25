import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAppDispatch from '../hooks/useAppDispatch';
import { startLoading, stopLoading } from '../redux/slice/loadingSlice';
import { registerEmployee, registerEmployer } from '../services/authApi';
import { toast } from 'react-toastify';
import axiosIns from '../services/axiosIns';

const OTPInput = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    // const { username, email, password, retryPassword } = location.state || {};
    const { registrationType, formData } = location.state || {};
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(300);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const timerRef = useRef<NodeJS.Timeout>();

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== '' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        if (!/^\d+$/.test(pastedData)) return;

        const pastedArray = pastedData.slice(0, 6).split('');
        const newOtp = [...otp];
        pastedArray.forEach((value, index) => {
            if (index < 6) newOtp[index] = value;
        });
        setOtp(newOtp);
    };


    // useEffect(() => {
    //     if (!formData.email) {
    //         navigate('/register'); // Quay về nếu không có dữ liệu
    //         return;
    //     }
    //     generateOTP(); // Gửi OTP ngay khi vào trang
    // }, []);

    const generateOTP = async () => {
        try {
            setLoading(true);
            setError('');
            await axiosIns.post('/otp/generate', { email: formData.email });
            setTimeLeft(300);
            setOtp(['', '', '', '', '', '']);
            setSuccess('OTP đã được gửi đến email của bạn');
        } catch (err) {
            setError('Không thể gửi OTP. Vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    const handleRegistration = async () => {
        try {
            await dispatch(startLoading());
            let result;

            // Gọi API đăng ký tương ứng với type
            if (registrationType === 'employee') {
                result = await dispatch(registerEmployee(formData));
            } else if (registrationType === 'employer') {
                result = await dispatch(registerEmployer(formData));
            }

            dispatch(stopLoading());

            if (result?.payload?.response?.success) {
                navigate('/login');
                toast.success('Đăng ký thành công');
            } else {
                setError('Đăng ký thất bại');
            }
        } catch (err) {
            setError('Đăng ký thất bại. Vui lòng thử lại');
        }
    };

    const verifyOTP = async () => {
        try {
            setLoading(true);
            setError('');
            const otpString = otp.join('');
            await axiosIns.post('/otp/verify', {
                email: formData.email,
                otp: otpString
            });
            setSuccess('Xác thực OTP thành công');

            // Sau khi xác thực OTP thành công, tiến hành đăng ký
            await handleRegistration();
        } catch (err) {
            setError('Mã OTP không đúng hoặc đã hết hạn');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [timeLeft]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-xl mx-auto p-8 bg-white rounded-xl shadow-lg">
                <h1 className="text-2xl font-semibold text-center mb-6">Xác thực mã OTP</h1>

                {/* Email Input */}
                <div className="mb-6">
                    <h5 className="text-center mb-6">Mã xác thực đã được gửi tới mail: {formData.email} </h5>
                </div>

                <div className="flex justify-center gap-4 mb-8">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => inputRefs.current[index] = el}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleChange(index, e.target.value)}
                            onKeyDown={e => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className="w-16 h-16 text-2xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                    ))}
                </div>

                {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                {success && <div className="text-green-500 text-center mb-4">{success}</div>}

                <div className="text-center mb-8">
                    <span className="text-lg text-gray-600">
                        Bạn chưa nhận được mã?{' '}
                        {timeLeft > 0 ? (
                            <span className="text-gray-400">
                                Gửi lại OTP ({formatTime(timeLeft)})
                            </span>
                        ) : (
                            <button
                                onClick={generateOTP}
                                disabled={loading || !formData.email}
                                className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                            >
                                Gửi lại OTP
                            </button>
                        )}
                    </span>
                </div>

                <button
                    className="w-full bg-blue-600 text-white text-lg py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                    onClick={verifyOTP}
                    disabled={loading || otp.includes('') || !formData.email}
                >
                    {loading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN'}
                </button>
            </div>
        </div>
    );
};

export default OTPInput;