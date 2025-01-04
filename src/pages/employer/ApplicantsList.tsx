import React, { useEffect, useState } from 'react';
import {
  Search,
  ChevronDown,
  Download,
  Trash,
  CheckCircle,
  XCircle,
  MessageSquareText,
  Eye,
} from 'lucide-react';
import {
  applicationLists,
  applicationUpdate,
  deleteApplication,
  ApplicationStatus,
} from '../../services/applicationApi';
import moment from 'moment';
import useAppDispatch from '../../hooks/useAppDispatch';
import { toast } from 'react-toastify';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import { addMessage } from '../../redux/slice/messageSlice';
import { ChatMessage } from '../chat/Messenger';
import { Transition } from '@headlessui/react';

const ApplicantsList = () => {
  const dispatch = useAppDispatch();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [error, setError] = useState(null);
  const [modalData, setModalData] = useState(null); // Data for the modal
  const [modalAction, setModalAction] = useState(''); // Action type: delete, accept, reject

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Lấy danh sách ứng dụng
  const fetchJobDetail = async () => {
    dispatch(startLoading());
    setError(null);
    try {
      const result = await dispatch(applicationLists());
      const data = result?.payload?.response?.data || [];
      setApplications(data);
      setFilteredApplications(data);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách ứng viên');
    } finally {
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
    fetchJobDetail();
  }, []);

  const handleAction = async () => {
    if (!modalData) return;

    try {
      if (modalAction === 'delete') {
        const result = await dispatch(deleteApplication({ id: modalData.id }));
        setApplications((prev) => prev.filter((app) => app.id !== modalData.id));
        toast.success('Xóa đơn ứng tuyển thành công!');
      } else {
        const status =
          modalAction === 'accept'
            ? ApplicationStatus.ACCEPTED
            : ApplicationStatus.REJECTED;
        const result = await dispatch(applicationUpdate({ id: modalData.id, status }));
        setApplications((prev) =>
          prev.map((app) =>
            app.id === modalData.id ? { ...app, status } : app
          )
        );
        toast.success(`Cập nhật trạng thái thành ${status}`);
      }
    } catch (err) {
      toast.error(err.message || 'Có lỗi xảy ra khi thực hiện thao tác');
    } finally {
      setModalData(null); // Close modal
    }
  };

  useEffect(() => {
    let filtered = applications;

    if (searchQuery.trim()) {
      filtered = filtered.filter((app) =>
        app.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  }, [searchQuery, statusFilter, applications]);

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-500 p-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Tên ứng viên"
          className="border p-2 mr-2 rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="relative inline-block mr-2">
          <select
            className="border p-2 pr-8 appearance-none rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Chọn trạng thái</option>
            <option value="PENDING">PENDING</option>
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
          <ChevronDown className="absolute right-2 top-3 w-4 h-4 pointer-events-none" />
        </div>

        <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
          <Search className="w-4 h-4 mr-2" />
          Tìm kiếm
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">Danh sách ứng tuyển</h2>

      {filteredApplications.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <div className="text-gray-500">Không có dữ liệu ứng viên</div>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="text-left text-pink-500">
              <th>Job</th>
              <th>Ứng viên</th>
              <th>Ngày ứng tuyển</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((application) => (
              <tr key={application?.id} className="border-b">
                <td className="py-2">
                  <div className="font-bold">{application?.jobTitle}</div>
                  <div className="text-gray-500">📍 {application?.address}</div>
                </td>
                <td
                  className="py-2">{application?.fullName || 'Chưa có tên'}
                  <div className="flex items-center">
                    {application?.resumeId && (
                      <a
                        href={`/generate-cv/${application?.resumeId}`}
                        target="_blank"
                        className="flex items-center text-blue-500 hover:text-blue-700 no-underline font-xs"
                      >
                        <Eye className="w-4 h-4 mr-1" /> <p>Xem trước CV</p>
                      </a>
                    )}

                    {application?.cvPdf && application?.resumeId == null && (
                      <a
                        href={application?.cvPdf}
                        download={`CV_${application?.fullName || 'unnamed'}.pdf`}
                        className="flex items-center text-blue-500 hover:text-blue-700 no-underline font-xs"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="w-4 h-4 mr-1" /> <p>Tải xuống CV</p>
                      </a>
                    )}

                  </div>
                </td>
                <td className="py-2">
                  {moment(application?.createdAt).format('YYYY-MM-DD HH:mm')}
                </td>
                <td className="py-2">
                  <span
                    className={
                      application?.status === 'ACCEPTED'
                        ? 'text-green-500'
                        : application?.status === 'REJECTED'
                          ? 'text-red-500'
                          : 'text-yellow-500'
                    }
                  >
                    {application?.status}
                  </span>
                </td>
                <td className="py-2">
                  <Trash
                    className="inline-block mr-2 text-gray-500 cursor-pointer"
                    size={18}
                    onClick={() => {
                      setModalData(application);
                      setModalAction('delete');
                    }}
                  />
                  <CheckCircle
                    className={`inline-block mr-2 ${application?.status === ApplicationStatus.ACCEPTED
                      ? 'text-green-500'
                      : 'text-gray-500 hover:text-green-500'
                      }`}
                    size={18}
                    onClick={() => {
                      setModalData(application);
                      setModalAction('accept');
                    }}
                  />
                  <XCircle
                    className={`inline-block mr-2 ${application?.status === ApplicationStatus.REJECTED
                      ? 'text-red-500'
                      : 'text-gray-500 hover:text-red-500'
                      }`}
                    size={18}
                    onClick={() => {
                      setModalData(application);
                      setModalAction('reject');
                    }}
                  />
                  <MessageSquareText className={'inline-block text-blue-500 cursor-pointer'}
                    size={18}
                    onClick={() => {
                      const msg: ChatMessage = {
                        receiver: String(application?.userId),
                        status: 'MESSAGE',
                        id: null,
                        senderName: String(application?.fullName),
                        direction: 'outgoing',
                        position: 'normal',
                        message: null,
                        sender: null,
                        sentTime: new Date().toISOString(),
                        type: 'html',
                      };

                      application
                        && dispatch(
                          addMessage({
                            converId: application?.userId,
                            avtUrl: application?.avatar,
                            fullName: application?.fullName ?? '',
                            msg,
                            openMessenger: true
                          })
                        )
                    }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Transition
        show={modalData}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0 transform scale-95 translate-y-4"
        enterTo="opacity-100 transform scale-100 translate-y-0"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100 transform scale-100 translate-y-0"
        leaveTo="opacity-0 transform scale-95 translate-y-4"
      >
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Xác nhận thao tác</h2>
            <p className="text-gray-700 mb-4">
              Bạn có chắc chắn muốn{' '}
              {modalAction === 'delete'
                ? 'xóa'
                : modalAction === 'accept'
                  ? 'duyệt'
                  : 'từ chối'}{' '}
              ứng viên này?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded"
                onClick={() => setModalData(null)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleAction}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default ApplicantsList;
