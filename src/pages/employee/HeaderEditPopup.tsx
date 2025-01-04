import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { updateEmployee } from '../../services/employeeApi';
import useAppDispatch from '../../hooks/useAppDispatch';
import { toast } from 'react-toastify';
import { RiAccountBoxFill } from "react-icons/ri";
import { Transition } from '@headlessui/react';

interface EmployeeDTO {
  email: string;
  fullName: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  avatar?: File;
  avatarUrl?: string;
}

interface HeaderEditPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EmployeeDTO) => void;
  headerData: EmployeeDTO | null;
}

const HeaderEditPopup: React.FC<HeaderEditPopupProps> = ({ isOpen, onClose, onSave, headerData }) => {
  const dispatch = useAppDispatch();
  const [editedData, setEditedData] = useState<EmployeeDTO>({
    email: '',
    fullName: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    avatarUrl: ''
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (headerData) {
      setEditedData(headerData);
      setAvatarPreview(headerData.avatarUrl || null);
    }
  }, [headerData]);

  const validateField = (name: string, value: string) => {
    if (!value && name !== 'avatar') {
      return 'Bắt buộc';
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    // Validate all required fields
    Object.entries(editedData).forEach(([key, value]) => {
      if (key !== 'avatar' && key !== 'avatarUrl') {
        const error = validateField(key, value);
        if (error) {
          errors[key] = error;
          isValid = false;
        }
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    Object.entries(editedData).forEach(([key, value]) => {
      if (key === 'dateOfBirth') {
        const date = new Date(value);
        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        formData.append(key, formattedDate);
      } else {
        formData.append(key, value);
      }
    });

    if (avatar) {
      formData.append('avatar', avatar);
    }

    const result = await dispatch(updateEmployee(formData))
    if (result?.payload?.response?.success === true) {
      toast.success('Cập nhật thông tin cá nhân thành công');
      onClose();
    } else {
      toast.error('Cập nhật thông tin cá nhân thất bại');
    }
    setIsSubmitting(false);
  };

  return (
    <Transition
      show={isOpen}
      enter="transition ease-out duration-300"
      enterFrom="opacity-0 transform scale-95 translate-y-4"
      enterTo="opacity-100 transform scale-100 translate-y-0"
      leave="transition ease-in duration-200"
      leaveFrom="opacity-100 transform scale-100 translate-y-0"
      leaveTo="opacity-0 transform scale-95 translate-y-4"
    >
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Thông tin cá nhân</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={isSubmitting}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className={`block w-full rounded-md border-2 ${hasSubmitted && validationErrors.fullName
                    ? 'border-red-500'
                    : 'border-gray-300'
                    } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2`}
                  value={editedData.fullName}
                  onChange={handleChange}
                />
                {hasSubmitted && validationErrors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.fullName}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`block w-full rounded-md border-2 ${hasSubmitted && validationErrors.email
                    ? 'border-red-500'
                    : 'border-gray-300'
                    } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2`}
                  value={editedData.email}
                  onChange={handleChange}
                />
                {hasSubmitted && validationErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  className={`block w-full rounded-md border-2 ${hasSubmitted && validationErrors.phoneNumber
                    ? 'border-red-500'
                    : 'border-gray-300'
                    } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2`}
                  value={editedData.phoneNumber}
                  onChange={handleChange}
                />
                {hasSubmitted && validationErrors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.phoneNumber}</p>
                )}
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className={`block w-full rounded-md border-2 ${hasSubmitted && validationErrors.address
                    ? 'border-red-500'
                    : 'border-gray-300'
                    } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2`}
                  value={editedData.address}
                  onChange={handleChange}
                />
                {hasSubmitted && validationErrors.address && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới tính <span className="text-red-500">*</span>
                </label>
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
                {hasSubmitted && validationErrors.gender && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.gender}</p>
                )}
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  className={`block w-full rounded-md border-2 ${hasSubmitted && validationErrors.dateOfBirth
                    ? 'border-red-500'
                    : 'border-gray-300'
                    } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2`}
                  value={editedData.dateOfBirth}
                  onChange={handleChange}
                />
                {hasSubmitted && validationErrors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.dateOfBirth}</p>
                )}
              </div>

              <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
                  Ảnh đại diện
                </label>
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <div className="mt-2">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-md">
                      <RiAccountBoxFill className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 p-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border-2 rounded-md text-gray-600 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 border-2 border-blue-500 disabled:bg-blue-300 disabled:border-blue-300"
                disabled={isSubmitting}
              >
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  );
};

export default HeaderEditPopup;