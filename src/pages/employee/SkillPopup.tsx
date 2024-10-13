import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Skill {
  name: string;
  level: string;
  description?: string;
}

interface SkillPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (skill: Skill) => void;
  skill?: Skill;
}

const SkillPopup: React.FC<SkillPopupProps> = ({ isOpen, onClose, onSave, skill }) => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState(50); // Default skill level (percentage)
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (skill) {
      setName(skill.name);
      setLevel(skill.level === 'Sơ cấp' ? 25 : skill.level === 'Cao cấp' ? 75 : 50);
      setDescription(skill.description || '');
    } else {
      setName('');
      setLevel(50);
      setDescription('');
    }
  }, [skill]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const levelText = level <= 25 ? 'Sơ cấp' : level >= 75 ? 'Cao cấp' : 'Trung cấp';
    onSave({ name, level: levelText, description });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-96 p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2">
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold mb-4">Kỹ năng</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Kỹ Năng<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Microsoft Word"
              className="w-full border rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Trình độ</label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-sm font-medium">
                {level}% ({level <= 25 ? 'Sơ cấp' : level >= 75 ? 'Cao cấp' : 'Trung cấp'})
              </span>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Sơ cấp</span>
              <span>Trung cấp</span>
              <span>Cao cấp</span>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Mô tả kỹ năng</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="(Tùy chọn) Mô tả chi tiết kỹ năng"
              className="w-full border rounded-md p-2 h-24"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 border rounded-md"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              {skill ? 'Cập nhật' : 'Tạo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillPopup;
