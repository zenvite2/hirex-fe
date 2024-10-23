import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { applicationCreate } from '../../services/applicayionApi';
import useAppDispatch from '../../hooks/useAppDispatch';
import { toast } from 'react-toastify';

interface ApplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    jobId?: string | number;
}

const ApplyModal: React.FC<ApplyModalProps> = ({ isOpen, onClose, onSubmit, jobId }) => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const applicationData = {
                jobId: Number(jobId),
                coverLetter: coverLetter
            };

            const result = await dispatch(applicationCreate(applicationData));

            if (result.payload?.response?.success === true) {
                toast.success('Application submitted successfully!');
                onSubmit(result.payload.response.data);
                onClose();
                setCoverLetter('');
            } else {
                toast.error('Failed to submit application');
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Apply for this position</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Cover Letter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cover Letter
                        </label>
                        <textarea
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            required
                            rows={5}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Write your cover letter here..."
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplyModal;