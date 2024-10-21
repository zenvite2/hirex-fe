import React from 'react';

interface CompanyInfo {
  name: string;
  headquarters: string;
  phone: string;
  email: string;
  industries: string[];
  companySize: string;
  website?: string;
  workingHours: string;
  logo?: File;
  description?: string;
}

const industries = [
  { id: "sales", label: "Bán hàng" },
  { id: "marketing", label: "Marketing" },
  { id: "admin", label: "Hành chính văn phòng" },
  { id: "tech", label: "Kỹ thuật" },
];

const CompanyInfoForm: React.FC = () => {
  const [formData, setFormData] = React.useState<CompanyInfo>({
    name: '',
    headquarters: '',
    phone: '',
    email: '',
    industries: [],
    companySize: '',
    workingHours: '',
    website: '',
    description: ''
  });

  const [selectedFile, setSelectedFile] = React.useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(formData);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">
        Cập nhật thông tin công ty
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Tên công ty <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Pasal"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div>
            <label htmlFor="headquarters" className="block mb-1 font-medium">
              Trụ sở chính <span className="text-red-500">*</span>
            </label>
            <input
              id="headquarters"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Số 206 Bạch Mai, Hai Bà Trưng, Hà Nội"
              value={formData.headquarters}
              onChange={(e) => setFormData({...formData, headquarters: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block mb-1 font-medium">
                Số điện thoại Cty <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="02436248686"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 font-medium">
                Email cty <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="pasal@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Ngành nghề</label>
              <div className="grid grid-cols-2 gap-2">
                {industries.map((industry) => (
                  <label key={industry.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.industries.includes(industry.id)}
                      onChange={(e) => {
                        const newIndustries = e.target.checked
                          ? [...formData.industries, industry.id]
                          : formData.industries.filter(id => id !== industry.id);
                        setFormData({...formData, industries: newIndustries});
                      }}
                    />
                    <span className="text-sm">{industry.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="companySize" className="block mb-1 font-medium">
                Quy mô công ty
              </label>
              <select
                id="companySize"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.companySize}
                onChange={(e) => setFormData({...formData, companySize: e.target.value})}
              >
                <option value="">Chọn quy mô</option>
                <option value="small">Dưới 10 người</option>
                <option value="medium">10-50 người</option>
                <option value="large">Trên 50 người</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="website" className="block mb-1 font-medium">
                Website
              </label>
              <input
                id="website"
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="workingHours" className="block mb-1 font-medium">
                Thời gian làm việc
              </label>
              <select
                id="workingHours"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.workingHours}
                onChange={(e) => setFormData({...formData, workingHours: e.target.value})}
              >
                <option value="">Chọn thời gian làm việc</option>
                <option value="mon-fri">Thứ 2 - đến thứ 6</option>
                <option value="mon-sat">Thứ 2 - đến thứ 7</option>
                <option value="all-week">Cả tuần</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Logo</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="logo-upload"
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                Chọn tệp
              </button>
              <span className="text-sm text-gray-500">
                {selectedFile || 'Không có tệp nào được chọn'}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block mb-1 font-medium">
              Mô tả
            </label>
            <textarea
              id="description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Cập nhật thông tin
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyInfoForm;