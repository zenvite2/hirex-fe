import React, { useState } from 'react';

interface FormData {
  title: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  description: string;
  industry: string;
  experience: string;
  jobType: string;
  position: string;
  deadline: string;
  salary: string;
  overtime: string;
  email: string;
  phone: string;
}

const JobCreationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    province: '',
    district: '',
    ward: '',
    address: '',
    description: '',
    industry: '',
    experience: '',
    jobType: '',
    position: '',
    deadline: '',
    salary: '',
    overtime: '',
    email: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
    // You can add your submission logic here, such as sending data to an API
  };

  return (
    <div className="container mx-auto w-3/4 px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Thêm mới job</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Tiêu đề (*)</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 mb-4">
          <div>
            <label htmlFor="province" className="block text-gray-700 text-sm font-bold mb-2">Tỉnh / TP (*)</label>
            <select
              id="province"
              name="province"
              value={formData.province}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Chọn tỉnh / TP</option>
              {/* Add province options here */}
            </select>
          </div>
          <div>
            <label htmlFor="district" className="block text-gray-700 text-sm font-bold mb-2">Quận / huyện (*)</label>
            <select
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Chọn Quận / huyện</option>
              {/* Add district options here */}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Địa chỉ cụ thể (*)</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Mô tả (*)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={6}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="industry" className="block text-gray-700 text-sm font-bold mb-2">Ngành nghề (*)</label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Chọn ngành nghề</option>
              <option value="Bán hàng">Bán hàng</option>
              {/* Add more industry options */}
            </select>
          </div>
          <div>
            <label htmlFor="experience" className="block text-gray-700 text-sm font-bold mb-2">Kinh nghiệm làm việc (*)</label>
            <select
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Chọn kinh nghiệm</option>
              <option value="2 năm">2 năm</option>
              {/* Add more experience options */}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="jobType" className="block text-gray-700 text-sm font-bold mb-2">Loại hình làm việc (*)</label>
            <select
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Chọn loại hình làm việc</option>
              <option value="Bán thời gian cố định">Bán thời gian cố định</option>
              {/* Add more job type options */}
            </select>
          </div>
          <div>
            <label htmlFor="position" className="block text-gray-700 text-sm font-bold mb-2">Cấp bậc (*)</label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Chọn cấp bậc</option>
              <option value="Nhân viên">Nhân viên</option>
              {/* Add more position options */}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="deadline" className="block text-gray-700 text-sm font-bold mb-2">Hạn nộp hồ sơ (*)</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label htmlFor="salary" className="block text-gray-700 text-sm font-bold mb-2">Mức lương (*)</label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="overtime" className="block text-gray-700 text-sm font-bold mb-2">Làm thêm giờ (OT)</label>
            <select
              id="overtime"
              name="overtime"
              value={formData.overtime}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Không">Không</option>
              <option value="Có">Có</option>
            </select>
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobCreationForm;