import React, { useEffect, useState } from 'react';
import { Search, ChevronDown, Download, Trash, CheckCircle, XCircle } from 'lucide-react';
import { applicationLists, applicationUpdate, deleteApplication, ApplicationStatus } from '../../services/applicationApi';
import moment from 'moment';
import useAppDispatch from '../../hooks/useAppDispatch';
import { toast } from 'react-toastify';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import { getAllUserCMS, updateActiveUser, updateInActiveUser } from '../../services/jobApi';
import { Transition } from '@headlessui/react';

const AccountManagement = () => {
  const dispatch = useAppDispatch();
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [users, setUsers] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  // Thêm state quản lý modal
  const [modalData, setModalData] = useState({
    show: false,
    action: '',
    userId: null
  });

  // Hàm mở modal
  const handleModalShow = (action, userId) => {
    setModalData({
      show: true,
      action,
      userId
    });
  };

  // Hàm đóng modal
  const handleModalClose = () => {
    setModalData({
      show: false,
      action: '',
      userId: null
    });
  };

  // Hàm xử lý khi xác nhận
  const handleModalConfirm = async () => {
    try {
      if (modalData.action === 'activate') {
        await handleUpdateActive(modalData.userId);
      } else {
        await handleUpdateInActive(modalData.userId);
      }
      handleModalClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Lấy danh sách user
  const fetchUser = async () => {
    dispatch(startLoading());
    setError(null);
    try {
      const result = await dispatch(getAllUserCMS());
      if (result?.payload?.response?.success === true) {
        setUsers(result.payload.response.data);
      }
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách user');
    } finally {
      dispatch(stopLoading());
    }
  };

  // Lấy dữ liệu khi component được mount
  useEffect(() => {
    fetchUser();
  }, []);

  const handleUpdateActive = async (userId) => {
    try {
      setUpdatingId(userId);
      await dispatch(updateActiveUser(userId));

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, active: true } : user
        )
      );

      toast.success("Mở khóa tài khoản thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi mở khóa tài khoản");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateInActive = async (userId) => {
    try {
      setUpdatingId(userId);
      await dispatch(updateInActiveUser(userId));

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, active: false } : user
        )
      );

      toast.success("Khóa tài khoản thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi khóa tài khoản");
    } finally {
      setUpdatingId(null);
    }
  };

  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD") // Tách dấu khỏi ký tự
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
      .replace(/đ/g, "d") // Thay "đ" thành "d"
      .replace(/Đ/g, "D") // Thay "Đ" thành "D"
      .toLowerCase(); // Chuyển về chữ thường
  };

  // Cập nhật danh sách ứng dụng hiển thị khi tìm kiếm hoặc lọc trạng thái thay đổi
  useEffect(() => {
    let filtered = users;

    // Tìm kiếm không phân biệt dấu theo fullName hoặc userName
    if (searchQuery.trim()) {
      const normalizedQuery = removeVietnameseTones(searchQuery); // Chuẩn hóa từ khóa
      filtered = filtered.filter((user) => {
        const normalizedFullName = removeVietnameseTones(user.fullName || "");
        const normalizedUserName = removeVietnameseTones(user.username || "");
        return (
          normalizedFullName.includes(normalizedQuery) ||
          normalizedUserName.includes(normalizedQuery)
        );
      });
    }

    // Lọc theo trạng thái ACTIVE/INACTIVE
    if (statusFilter) {
      filtered = filtered.filter(
        (user) =>
          (statusFilter === "ACTIVE" && user.active === true) ||
          (statusFilter === "INACTIVE" && user.active === false)
      );
    }

    setFilteredApplications(filtered);
  }, [searchQuery, statusFilter, users]);

  // Hiển thị lỗi
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
        {/* Ô tìm kiếm */}
        <input
          type="text"
          placeholder="Tên ứng viên"
          className="border p-2 mr-2 rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Lọc trạng thái */}
        <div className="relative inline-block mr-2">
          <select
            className="border p-2 pr-8 appearance-none rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Chọn trạng thái</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
          <ChevronDown className="absolute right-2 top-3 w-4 h-4 pointer-events-none" />
        </div>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        // onClick={() => fetchJobDetail()}
        >
          <Search className="w-4 h-4 mr-2" />
          Tìm kiếm
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">Danh sách tài khoản</h2>

      {filteredApplications.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <div className="text-gray-500">Không có dữ liệu tài khoản</div>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="text-left text-pink-500">
              <th>Tên đăng nhập</th>
              <th>Tên đầy đủ</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((user) => (
              <tr key={user?.id} className="border-b">
                <td className="py-2">
                  <div className="font-bold">{user?.username}</div>
                </td>
                <td className="py-2">
                  <div>{user?.fullName || 'Chưa có tên'}</div>
                </td>
                <td className="py-2">
                  {user?.email}
                </td>
                <td className="py-2">
                  {user?.role?.name === "EMPLOYEE" ? "Người tìm việc" : "Nhà tuyển dụng"}
                </td>
                <td
                  className={`py-2 ${user?.active ? "text-green-500" : "text-red-500"}`}
                >
                  {user?.active === true ? "ACTIVE" : "INACTIVE"}
                </td>
                <td className="py-2">
                  {/* <Trash
                    className={`inline-block mr-2 text-gray-500 cursor-pointer ${updatingId === user.id ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    size={18}
                    onClick={() => handleDeleteApplication(user.id)}
                  /> */}
                  <CheckCircle
                    className={`inline-block mr-2 cursor-pointer ${user.active === true
                      ? 'text-green-500'
                      : 'text-gray-500 hover:text-green-500'
                      } ${updatingId === user.id ? 'opacity-50' : ''}`}
                    size={18}
                    onClick={() => handleModalShow('activate', user.id)}
                  />
                  <XCircle
                    className={`inline-block cursor-pointer ${user.active === false
                      ? 'text-red-500'
                      : 'text-gray-500 hover:text-red-500'
                      } ${updatingId === user.id ? 'opacity-50' : ''}`}
                    size={18}
                    onClick={() => handleModalShow('deactivate', user.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table >
      )}

      <Transition
        show={modalData.show}
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
            <p>
              {modalData.action === 'activate' ? 'Bạn có chắc muốn mở khóa tài khoản này?' : 'Bạn có chắc muốn khóa tài khoản này?'}
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button className="px-4 py-2 bg-gray-300 text-black rounded" onClick={handleModalClose}>Hủy</button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleModalConfirm}>Xác nhận</button>
            </div>
          </div>
        </div>
      </Transition>
    </div >
  );
};

export default AccountManagement;