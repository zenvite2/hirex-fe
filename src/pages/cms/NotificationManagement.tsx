import React, { useState, useEffect } from 'react';
import { Send, Save, Eye } from 'lucide-react';
import axiosIns from '../../services/axiosIns';
import { toast } from 'react-toastify';

interface Errors {
    title?: string;
    content?: string;
    recipientType?: string;
}

const NotificationManagement = () => {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [recipientType, setRecipientType] = useState('0');
    const [errors, setErrors] = useState<Errors>({});
    const [showPreview, setShowPreview] = useState(false);
    const [templates, setTemplates] = useState([]);

    // Fetch templates when component mounts
    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const response = await axiosIns.get('/cms/pattern', { includeToken: true });
            setTemplates(response.data);
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    const validateForm = () => {
        const newErrors: Errors = {};

        if (!title.trim()) newErrors.title = 'Vui lòng nhập tiêu đề.';
        if (!content.trim()) newErrors.content = 'Vui lòng nhập nội dung.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await axiosIns.post('/cms/send', {
                title,
                content,
                sendTo: parseInt(recipientType),
            });

            // Xóa lỗi và làm sạch form sau khi gửi thành công
            setTitle('');
            setContent('');
            setRecipientType('0');
            setErrors({});
            toast('Thông báo đã được gửi thành công!');
        } catch (error) {
            console.error('Error sending notification:', error);
            toast('Có lỗi xảy ra khi gửi thông báo');
        }
    };

    const handleSaveTemplate = async () => {
        if (!validateForm()) return;

        try {
            await axiosIns.post(
                '/cms/pattern',
                {
                    type: recipientType,
                    subject: title,
                    content: content,
                    patternCms: true,
                },
                { includeToken: true }
            );

            // Refresh templates list
            fetchTemplates();
            toast('Đã lưu mẫu thông báo thành công!');
        } catch (error) {
            console.error('Error saving template:', error);
            toast('Có lỗi xảy ra khi lưu mẫu');
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-medium">Quản lý thông báo</h1>
                <div className="space-x-2">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        <Eye className="w-4 h-4 inline mr-2" />
                        Xem trước
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Form section */}
                <div className="col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Tiêu đề thông báo <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className={`w-full p-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="Nhập tiêu đề thông báo..."
                            />
                            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Đối tượng nhận <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={recipientType}
                                onChange={(e) => setRecipientType(e.target.value)}
                                className={`w-full p-2 border ${errors.recipientType ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            >
                                <option value="0">Chọn đối tượng nhận</option>
                                <option value="1">Người tìm việc</option>
                                <option value="2">Nhà tuyển dụng</option>
                            </select>
                            {errors.recipientType && <p className="text-sm text-red-500 mt-1">{errors.recipientType}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Nội dung thông báo <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={6}
                                className={`w-full p-2 border ${errors.content ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="Nhập nội dung thông báo..."
                            />
                            {errors.content && <p className="text-sm text-red-500 mt-1">{errors.content}</p>}
                        </div>

                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={handleSaveTemplate}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                <Save className="w-4 h-4 inline mr-2" />
                                Lưu mẫu
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                <Send className="w-4 h-4 inline mr-2" />
                                Gửi thông báo
                            </button>
                        </div>
                    </form>
                </div>

                {/* Templates sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-4 rounded-lg border" style={{ maxHeight: '470px', overflowY: 'auto' }}>
                        <h2 className="text-lg font-medium mb-4">Mẫu thông báo</h2>
                        <div className="space-y-2">
                            {templates.map((template) => (
                                <div
                                    key={template.id}
                                    className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                                    onClick={() => {
                                        setTitle(template.subject);
                                        setContent(template.content);
                                        setRecipientType(template.type);
                                    }}
                                >
                                    <h3 className="font-medium">{template.subject}</h3>
                                    <p className="text-sm text-gray-500 truncate">{template.content}</p>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mt-2 inline-block">
                                        {template.type === '0' ? 'Tất cả' :
                                            template.type === '1' ? 'Người tìm việc' :
                                                'Nhà tuyển dụng'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Preview Modal */}
                {showPreview && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
                            <h2 className="text-lg font-medium mb-4">Xem trước thông báo</h2>
                            <div className="border rounded-lg p-4">
                                <h3 className="font-medium text-lg mb-2">{title || 'Chưa có tiêu đề'}</h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Gửi đến: {recipientType === '0' ? 'Chưa chọn' :
                                        recipientType === '1' ? 'Người tìm việc' :
                                            'Nhà tuyển dụng'}
                                </p>
                                <div className="whitespace-pre-wrap">
                                    {content || 'Chưa có nội dung'}
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationManagement;
