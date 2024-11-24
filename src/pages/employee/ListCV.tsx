import React, { useState, useEffect } from 'react';
import { Eye, Pencil, Trash } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { resumeGet, deleteResume, resumeCreate } from '../../services/resumeApi';
import { toast } from 'react-toastify';
import useAppDispatch from '../../hooks/useAppDispatch';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';

const ListCV = () => {
    const [resume, setResume] = useState([]);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            dispatch(startLoading());
            try {
                const result = await dispatch(resumeGet());
                if (result?.payload?.response?.success == true) {
                    setResume(result.payload.response.data);
                }
            } catch (error) {
                toast.error('Có lỗi xảy ra khi tải danh sách công việc');
            } finally {
                dispatch(stopLoading());
            }
        };

        fetchJobs();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const handleDelete = async (resumeId) => {
        try {
            await dispatch(deleteResume(resumeId));
            setResume(resume.filter((resume) => resume.id !== resumeId));
            toast.success('Xóa công việc thành công!');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa công việc');
        }
    };

    const handleCreate = async () => {
        try {
            const result = await dispatch(resumeCreate());
            if (result?.payload?.response?.success) {
                const createdResume = result.payload.response.data;
                toast.success('Thêm CV thành công!');
                navigate(`/resume/${createdResume.id}`); // Điều chỉnh cách gọi navigate
            } else {
                toast.error('Không thể tạo CV, hãy thử lại.');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi thêm CV');
            console.error('Error in handleCreate:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Header Section */}
            <div
                style={{
                    backgroundImage:
                        'radial-gradient(circle 311px at 8.6% 27.9%, rgba(62,147,252,0.57) 12.9%, rgba(239,183,192,0.44) 91.2%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
                className="p-6 rounded-lg mb-6 text-black"
            >
                <h1 className="text-2xl font-bold mb-2">Danh sách CV đã tạo</h1>
                <p className="text-sm">
                    Xem lại danh sách những CV mà bạn đã tạo trước đó.
                </p>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">Danh sách CV đã tạo</h1>
                    <button className="bg-[#0069DB] text-white px-3 py-2 rounded-md hover:bg-[#0050B3] transition duration-300"
                        onClick={() => handleCreate()}>
                        Tạo CV mới
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="text-left text-pink-500 border-b">
                                <th className="py-3">Tiêu đề</th>
                                <th className="py-3">Thời gian cập nhật cuối cùng</th>
                                <th className="py-3">Trạng thái</th>
                                <th className="py-3">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resume?.map((resume, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="py-4">
                                        <div className="font-medium">{resume.title}</div>
                                    </td>
                                    <td className="py-4">
                                        <div className="text-sm text-gray-600">{formatDate(resume.updatedAt)}</div>
                                    </td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded-full text-sm ${resume.status
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {resume.status ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => navigate(`/resume/${resume.id}`)}
                                                className="hover:text-yellow-600 transition-colors"
                                            >                      <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(resume.id)}
                                                className="hover:text-red-600 transition-colors">
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListCV;