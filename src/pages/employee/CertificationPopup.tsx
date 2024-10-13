import React, { useState, useEffect } from 'react';

interface Certification {
  id?: number;
  name: string;
  issuedBy: string;
  issueDate: string;
  expirationDate?: string;
}

interface CertificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (certification: Certification) => void;
  certification: Certification | null;
}

const CertificationPopup: React.FC<CertificationPopupProps> = ({ isOpen, onClose, onSave, certification }) => {
  const [formData, setFormData] = useState<Certification>({
    name: '',
    issuedBy: '',
    issueDate: '',
    expirationDate: '',
  });

  useEffect(() => {
    if (certification) {
      setFormData(certification);
    } else {
      setFormData({
        name: '',
        issuedBy: '',
        issueDate: '',
        expirationDate: '',
      });
    }
  }, [certification]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">{certification ? 'Edit Certification' : 'Add Certification'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border rounded w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Issued By</label>
            <input
              type="text"
              name="issuedBy"
              value={formData.issuedBy}
              onChange={handleChange}
              required
              className="border rounded w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Issue Date</label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              required
              className="border rounded w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Expiration Date (optional)</label>
            <input
              type="date"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleChange}
              className="border rounded w-full p-2"
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 text-gray-500">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificationPopup;
