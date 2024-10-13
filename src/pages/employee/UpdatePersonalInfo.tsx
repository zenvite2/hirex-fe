import React, { useState } from 'react';
import { X } from 'lucide-react';

interface PersonalInfo {
  fullName: string;
  gender: string;
  birthdate: string;
  email: string;
  phone: string;
  address: string;
  link: string;
  careerGoal: string;
}

interface UpdatePersonalInfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (info: PersonalInfo) => void;
  initialInfo: PersonalInfo;
}

const UpdatePersonalInfoPopup: React.FC<UpdatePersonalInfoPopupProps> = ({ isOpen, onClose, onSave, initialInfo }) => {
  const [info, setInfo] = useState<PersonalInfo>(initialInfo);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInfo(prevInfo => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(info);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 pt-16">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[calc(100vh-8rem)]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Thông tin cá nhân</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden mr-4">
              {avatarFile ? (
                <img src={URL.createObjectURL(avatarFile)} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <svg className="h-full w-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </div>
            <label htmlFor="avatar-upload" className="bg-blue-500 text-white px-3 py-1 rounded-md cursor-pointer hover:bg-blue-600 transition text-sm">
              Chọn ảnh
            </label>
            <input id="avatar-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ</label>
              <input type="text" name="lastName" value={info.fullName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" placeholder="Nhập họ" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input type="radio" name="gender" value="Nam" checked={info.gender === 'Nam'} onChange={handleChange} className="form-radio text-blue-500" />
                <span className="ml-2 text-sm">Nam</span>
              </label>
              <label className="inline-flex items-center">
                <input type="radio" name="gender" value="Nữ" checked={info.gender === 'Nữ'} onChange={handleChange} className="form-radio text-blue-500" />
                <span className="ml-2 text-sm">Nữ</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
              <input type="date" name="birthdate" value={info.birthdate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input type="tel" name="phone" value={info.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" placeholder="Nhập số điện thoại" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={info.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" placeholder="example@email.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
            <input type="text" name="address" value={info.address} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" placeholder="Nhập địa chỉ" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Liên kết</label>
            <input type="text" name="link" value={info.link} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" placeholder="https://example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mục tiêu nghề nghiệp</label>
            <textarea name="careerGoal" value={info.careerGoal} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" placeholder="Nhập mục tiêu nghề nghiệp của bạn"></textarea>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition text-sm">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePersonalInfoPopup;