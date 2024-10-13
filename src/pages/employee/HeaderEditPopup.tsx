import React, { useEffect } from 'react';

const HeaderEditPopup = ({ isOpen, onClose, onSave, headerData }) => {
  const [editedData, setEditedData] = React.useState(headerData);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl"> {/* Changed max-w-md to max-w-3xl */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4"> {/* Added grid layout for two columns */}
            <div>
              <label htmlFor="resumeTitle" className="block text-sm font-medium text-gray-700">Tiêu đề hồ sơ *</label>
              <input
                type="text"
                id="resumeTitle"
                name="resumeTitle"
                value={editedData.resumeTitle}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Họ và tên *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editedData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">Quốc tịch *</label>
              <select
                id="nationality"
                name="nationality"
                value={editedData.nationality}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                <option value="Việt kiều">Việt kiều</option>
                {/* Add other nationality options here */}
              </select>
            </div>
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Ngày sinh *</label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={editedData.birthDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ảnh đại diện</label>
            <div className="mt-1 flex items-center">
              <img src="/placeholder-image.jpg" alt="Profile" className="w-12 h-12 object-cover rounded-full" />
              <button type="button" className="ml-4 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                Chọn ảnh
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4"> {/* Added grid layout for two columns */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tình trạng hôn nhân *</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="maritalStatus"
                    value="single"
                    checked={editedData.maritalStatus === 'single'}
                    onChange={handleChange}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2">Độc thân</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="maritalStatus"
                    value="married"
                    checked={editedData.maritalStatus === 'married'}
                    onChange={handleChange}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2">Đã kết hôn</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính *</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={editedData.gender === 'male'}
                    onChange={handleChange}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2">Nam</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={editedData.gender === 'female'}
                    onChange={handleChange}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2">Nữ</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeaderEditPopup;