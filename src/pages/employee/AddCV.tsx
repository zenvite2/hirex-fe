import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

// Types
interface Objective {
  id: number;
  content: string;
}

interface Hobby {
  id: number;
  name: string;
  description: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  technology: string;
  role: string;
  startDate: string;
  endDate: string;
}

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editData: any | null;
  type: 'objective' | 'hobby' | 'project';
}

const initialData = {
  objectives: [],
  hobbies: [],
  projects: []
};

// Generic Popup Component
const Popup: React.FC<PopupProps> = ({ isOpen, onClose, onSave, editData, type }) => {
  const [formData, setFormData] = useState(
    editData || {
      id: Date.now(),
      ...(type === 'objective' && { content: '' }),
      ...(type === 'hobby' && { name: '', description: '' }),
      ...(type === 'project' && {
        name: '',
        description: '',
        technology: '',
        role: '',
        startDate: '',
        endDate: ''
      })
    }
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {editData ? 'Edit' : 'Add'} {type.charAt(0).toUpperCase() + type.slice(1)}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {type === 'objective' && (
            <div className="mb-4">
              <label className="block mb-2">Content</label>
              <textarea
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                required
              />
            </div>
          )}

          {type === 'hobby' && (
            <>
              <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Description</label>
                <textarea
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>
            </>
          )}

          {type === 'project' && (
            <>
              <div className="mb-4">
                <label className="block mb-2">Project Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Description</label>
                <textarea
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Technology</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={formData.technology}
                  onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Role</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-2">Start Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">End Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ResumePage: React.FC = () => {
  const [data, setData] = useState(initialData);
  const [popup, setPopup] = useState({
    isOpen: false,
    type: null as 'objective' | 'hobby' | 'project' | null,
    editData: null
  });

  const openPopup = (type: 'objective' | 'hobby' | 'project', editData: any = null) => {
    setPopup({ isOpen: true, type, editData });
  };

  const closePopup = () => {
    setPopup({ isOpen: false, type: null, editData: null });
  };

  const handleSave = (newData: any) => {
    setData((prev) => {
      const section = `${popup.type}s` as keyof typeof prev;
      if (popup.editData) {
        return {
          ...prev,
          [section]: prev[section].map((item: any) =>
            item.id === newData.id ? newData : item
          )
        };
      }
      return {
        ...prev,
        [section]: [...prev[section], newData]
      };
    });
  };

  const handleDelete = (type: string, id: number) => {
    setData((prev) => ({
      ...prev,
      [`${type}s`]: prev[`${type}s` as keyof typeof prev].filter(
        (item: any) => item.id !== id
      )
    }));
  };

  const Section: React.FC<{
    title: string;
    type: 'objective' | 'hobby' | 'project';
    items: any[];
    renderItem: (item: any) => React.ReactNode;
  }> = ({ title, type, items, renderItem }) => (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-orange-600">{title}</h2>
        <button
          onClick={() => openPopup(type)}
          className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start">
              {renderItem(item)}
              <div className="flex gap-2">
                <button
                  onClick={() => openPopup(type, item)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(type, item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-3xl">
        <Section
          title="Giới thiệu/Mục tiêu nghề nghiệp"
          type="objective"
          items={data.objectives}
          renderItem={(item: Objective) => (
            <div className="flex-1">
              <p className="text-gray-700">{item.content}</p>
            </div>
          )}
        />

        <hr className="my-8 border-t border-gray-300" />

        <Section
          title="Sở thích"
          type="hobby"
          items={data.hobbies}
          renderItem={(item: Hobby) => (
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-gray-600 mt-1">{item.description}</p>
            </div>
          )}
        />

        <hr className="my-8 border-t border-gray-300" />

        <Section
          title="Dự án"
          type="project"
          items={data.projects}
          renderItem={(item: Project) => (
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-gray-600 mt-1">{item.description}</p>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Technology:</p>
                  <p className="text-gray-700">{item.technology}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role:</p>
                  <p className="text-gray-700">{item.role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {item.startDate} - {item.endDate || 'Present'}
              </p>
            </div>
          )}
        />

        {popup.isOpen && popup.type && (
          <Popup
            isOpen={popup.isOpen}
            onClose={closePopup}
            onSave={handleSave}
            editData={popup.editData}
            type={popup.type}
          />
        )}
      </div>
    </div>
  );
};

export default ResumePage;