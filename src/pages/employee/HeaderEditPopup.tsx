import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const HeaderEditPopup = ({ isOpen, onClose, onSave, headerData }) => {
  const [editedData, setEditedData] = useState(headerData);

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Thông tin cá nhân</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
              <input
                type="text"
                id="name"
                name="name"
                className="block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                value={editedData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh *</label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                className="block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                value={editedData.birthDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ *</label>
              <input
                type="text"
                id="address"
                name="address"
                className="block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                value={editedData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                className="block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                value={editedData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính *</label>
              <div className="mt-1 space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio border-2 border-gray-300"
                    name="gender"
                    value="Nam"
                    checked={editedData.gender === "Nam"}
                    onChange={handleChange}
                  />
                  <span className="ml-2">Nam</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio border-2 border-gray-300"
                    name="gender"
                    value="Nữ"
                    checked={editedData.gender === "Nữ"}
                    onChange={handleChange}
                  />
                  <span className="ml-2">Nữ</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện</label>
              <div className="mt-1">
                <img src="/api/placeholder/100/100" alt="Placeholder" className="w-24 h-24 object-cover rounded border-2 border-gray-300" />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 p-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border-2 rounded-md text-gray-600 hover:bg-gray-50">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 border-2 border-blue-500">Cập nhật</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeaderEditPopup;