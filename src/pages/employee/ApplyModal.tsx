import React, { useState, useEffect } from 'react';
import { applicationCreate } from '../../services/applicationApi';
import { resumeGet } from '../../services/resumeApi';
import { toast } from 'react-toastify';
import useAppDispatch from '../../hooks/useAppDispatch';

interface Resume {
    id: string;
    title: string;
    updatedAt: string;
}

interface ApplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    jobId?: string | number;
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const ApplyModal: React.FC<ApplyModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    jobId
}) => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [useProfile, setUseProfile] = useState(true);

    const [resumes, setResumes] = useState<Resume[]>([]);
    const [selectedResumeId, setSelectedResumeId] = useState<string>('');

    useEffect(() => {
        const loadResumes = async () => {
            try {
                const fetchedResumes = await dispatch(resumeGet());
                const resumeList = fetchedResumes.payload.response.data || [];
                setResumes(resumeList);

                if (resumeList.length > 0) {
                    setSelectedResumeId(resumeList[0].id);
                }
            } catch (error) {
                toast.error('Không thể tải danh sách hồ sơ');
            }
        };

        if (isOpen) {
            loadResumes();
        }
    }, [isOpen, dispatch]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error('Tệp không được vượt quá 10MB');
                return;
            }

            const validTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            if (!validTypes.includes(file.type)) {
                toast.error('Chỉ chấp nhận tệp PDF, DOC hoặc DOCX');
                return;
            }

            setSelectedFile(file);
        }
    };

    const handleFileRemove = () => {
        setSelectedFile(null);
    };

    const handlePreviewCV = () => {
        if (useProfile && selectedResumeId) {
            window.open(`/generate-cv/${selectedResumeId}`, '_blank');
        } else {
            toast.error('Vui lòng chọn CV để xem trước');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (useProfile && !selectedResumeId) {
            toast.error('Vui lòng chọn hồ sơ');
            return;
        }

        if (!useProfile && !selectedFile) {
            toast.error('Vui lòng chọn tệp CV');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('jobId', jobId?.toString() || '');
            formData.append('coverLetter', coverLetter);
            formData.append('useProfile', String(useProfile));

            if (useProfile) {
                formData.append('resumeId', selectedResumeId);
            } else if (selectedFile) {
                formData.append('cvPdf', selectedFile);
            }

            const result = await dispatch(applicationCreate(formData));

            if (result.payload?.response?.success) {
                toast.success('Ứng tuyển thành công!');
                onSubmit(result.payload.response.data);
                onClose();

                setCoverLetter('');
                setSelectedFile(null);
                setUseProfile(true);
                if (resumes.length > 0) {
                    setSelectedResumeId(resumes[0].id);
                }
            } else {
                toast.error('Gửi ứng tuyển thất bại');
            }
        } catch (error) {
            toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-full max-w-xl mx-4 shadow-xl">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-medium">Ứng Tuyển</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    <div className="mb-6">
                        <h3 className="font-medium mb-3">Chọn CV</h3>

                        <div className="mb-3">
                            <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        checked={useProfile}
                                        onChange={() => setUseProfile(true)}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="ml-2">CV từ Hồ Sơ</span>
                                </div>
                            </label>

                            {useProfile && (
                                <div className="mt-2 ml-6 flex items-center space-x-2">
                                    {resumes.length > 0 ? (
                                        <div className="flex-grow">
                                            <select
                                                value={selectedResumeId}
                                                onChange={(e) => setSelectedResumeId(e.target.value)}
                                                className="w-full p-2 border rounded"
                                            >
                                                {resumes.map((resume) => (
                                                    <option key={resume.id} value={resume.id}>
                                                        {resume.title} - {formatDate(resume.updatedAt)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : (
                                        <div className="text-gray-500">
                                            Chưa có hồ sơ. Vui lòng tạo hồ sơ.
                                        </div>
                                    )}

                                    {resumes.length > 0 && (
                                        <div
                                            onClick={handlePreviewCV}
                                            className="cursor-pointer text-blue-500 hover:underline"
                                        >
                                            Xem trước
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded">
                                <input
                                    type="radio"
                                    checked={!useProfile}
                                    onChange={() => setUseProfile(false)}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="ml-2">Tải lên hồ sơ ứng tuyển</span>
                            </label>

                            {!useProfile && (
                                <div className="mt-3 relative">
                                    {!selectedFile ? (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="space-y-2">
                                                <div className="text-blue-500">
                                                    Nhấp để thêm tệp hoặc kéo thả tại đây
                                                </div>
                                                <div className="text-gray-400 text-sm">
                                                    Định dạng: DOC, DOCX, PDF
                                                </div>
                                                <div className="text-gray-400 text-sm">
                                                    Kích thước tối đa: 10MB
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between border-2 border-dashed border-gray-300 rounded-lg p-3">
                                            <div className="flex items-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6 text-blue-500 mr-2"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                                <span className="truncate max-w-[200px]">
                                                    {selectedFile.name}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleFileRemove}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-medium mb-2">Thư Ứng Tuyển</h3>
                        <p className="text-gray-600 text-sm mb-3">
                            Thư ứng tuyển giúp bạn trở nên chuyên nghiệp và gây ấn tượng với nhà tuyển dụng.
                        </p>
                        <div className="border rounded-lg">
                            <textarea
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                maxLength={2000}
                                className="w-full p-3 min-h-[120px] focus:outline-none resize-none"
                                placeholder="Thêm mô tả"
                            />
                            <div className="border-t p-2 flex items-center">
                                <span className="ml-auto text-sm text-gray-500">
                                    {coverLetter.length} / 2000
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Đang xử lý...' : 'Lưu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplyModal;