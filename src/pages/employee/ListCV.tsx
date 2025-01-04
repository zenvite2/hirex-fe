import React, { useState, useEffect } from 'react';
import { Eye, Pencil, Trash } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { resumeGet, deleteResume, resumeCreate } from '../../services/resumeApi';
import { toast } from 'react-toastify';
import useAppDispatch from '../../hooks/useAppDispatch';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import { Transition } from '@headlessui/react';

const ListCV = () => {
    const [resume, setResume] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [newResumeName, setNewResumeName] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [resumeToDelete, setResumeToDelete] = useState(null);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            dispatch(startLoading());
            try {
                const result = await dispatch(resumeGet());
                if (result?.payload?.response?.success === true) {
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

    const handleDelete = async () => {
        if (!resumeToDelete) return;
        try {
            await dispatch(deleteResume(resumeToDelete.id));
            setResume(resume.filter((res) => res.id !== resumeToDelete.id));
            toast.success('Xóa CV thành công!');
            setShowDeleteModal(false);
            setResumeToDelete(null);
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa CV');
        }
    };

    const handleCreate = async () => {
        try {
            const result = await dispatch(resumeCreate({ name: newResumeName }));
            if (result?.payload?.response?.success) {
                const createdResume = result.payload.response.data;
                toast.success('Thêm CV thành công!');
                navigate(`/resume/${createdResume.id}`);
                setShowPopup(false);
                setNewResumeName('');
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
                className="p-6 rounded-lg mb-6 text-black mt-4"
            >
                <h1 className="text-2xl font-bold mb-2">Danh sách CV đã tạo</h1>
                <p className="text-sm">
                    Xem lại danh sách những CV mà bạn đã tạo trước đó.
                </p>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">Danh sách CV đã tạo</h1>
                    <button
                        className="bg-[#0069DB] text-white px-3 py-2 rounded-md hover:bg-[#0050B3] transition duration-300"
                        onClick={() => setShowPopup(true)}
                    >
                        Tạo CV mới
                    </button>
                </div>
                <Transition
                    show={showPopup}
                    enter="transition ease-out duration-300"
                    enterFrom="opacity-0 transform scale-95 translate-y-4"
                    enterTo="opacity-100 transform scale-100 translate-y-0"
                    leave="transition ease-in duration-200"
                    leaveFrom="opacity-100 transform scale-100 translate-y-0"
                    leaveTo="opacity-0 transform scale-95 translate-y-4"
                >
                    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-lg font-bold mb-4">Nhập tên CV</h2>
                            <input
                                type="text"
                                value={newResumeName}
                                onChange={(e) => setNewResumeName(e.target.value)}
                                placeholder="Nhập tên CV"
                                className="border p-2 rounded w-full mb-4"
                            />
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    className="px-4 py-2 bg-gray-300 text-black rounded"
                                    onClick={() => setShowPopup(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                    onClick={handleCreate}
                                >
                                    Tạo
                                </button>
                            </div>
                        </div>
                    </div>
                </Transition>

                <Transition
                    show={showDeleteModal}
                    enter="transition ease-out duration-300"
                    enterFrom="opacity-0 transform scale-95 translate-y-4"
                    enterTo="opacity-100 transform scale-100 translate-y-0"
                    leave="transition ease-in duration-200"
                    leaveFrom="opacity-100 transform scale-100 translate-y-0"
                    leaveTo="opacity-0 transform scale-95 translate-y-4"
                >
                    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h3 className="text-xl font-semibold mb-4">Xác nhận</h3>
                            <p>Bạn có chắc chắn muốn xóa CV này?</p>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button className="px-4 py-2 bg-gray-300 text-black rounded" onClick={() => setShowDeleteModal(false)}>Hủy</button>
                                <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleDelete}>Xóa</button>
                            </div>
                        </div>
                    </div>
                </Transition>

                {/* Resume Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="text-left text-pink-500 border-b">
                                <th className="py-3">Tiêu đề</th>
                                <th className="py-3">Thời gian cập nhật cuối cùng</th>
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
                                        <div className="text-sm text-gray-600">
                                            {formatDate(resume.updatedAt)}
                                        </div>
                                    </td>

                                    <td className="py-4">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => navigate(`/resume/${resume.id}`)}
                                                className="hover:text-yellow-600 transition-colors"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setResumeToDelete(resume);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="hover:text-red-600 transition-colors"
                                            >
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