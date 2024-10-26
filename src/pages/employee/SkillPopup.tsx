import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import useAppDispatch from '../../hooks/useAppDispatch';
import { techList } from '../../services/autofillApi';
import { skillCreate, skillUpdate } from '../../services/skillApi';
import { toast } from 'react-toastify';

interface Skill {
  id?: number;
  name: string;
  level: string;
  description?: string;
}

interface TechItem {
  id: number;
  name: string;
}

interface SkillPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (skill: Skill) => void;
  skill?: Skill;
}

const SkillPopup: React.FC<SkillPopupProps> = ({ isOpen, onClose, onSave, skill }) => {
  const dispatch = useAppDispatch();
  const [selectedTechId, setSelectedTechId] = useState('');
  const [level, setLevel] = useState(50);
  const [description, setDescription] = useState('');
  const [techItems, setTechItems] = useState<TechItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTechList = async () => {
      try {
        const result = await dispatch(techList()).unwrap();
        if (result.response?.success) {
          setTechItems(result.response.data);
        }
      } catch (error) {
        console.error('Failed to fetch tech list:', error);
      }
    };

    fetchTechList();
  }, [dispatch]);

  useEffect(() => {
    if (skill) {
      setIsEditing(true);
      const tech = techItems.find(t => t.name === skill.name);
      setSelectedTechId(tech?.id.toString() || '');
      setLevel(skill.level === 'Sơ cấp' ? 25 : skill.level === 'Cao cấp' ? 75 : 50);
      setDescription(skill.description || '');
    } else {
      setIsEditing(false);
      setSelectedTechId('');
      setLevel(50);
      setDescription('');
    }
  }, [skill, techItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const levelText = level <= 25 ? 'Sơ cấp' : level >= 75 ? 'Cao cấp' : 'Trung cấp';
    const selectedTech = techItems.find(t => t.id.toString() === selectedTechId);

    try {
      const skillData = {
        skillName: selectedTech?.name || '',
        techId: selectedTechId,
        level: levelText,
        description: description
      };

      let result;

      if (isEditing && skill?.id) {
        result = await dispatch(skillUpdate({
          id: skill.id,
          ...skillData
        }));
      } else {
        result = await dispatch(skillCreate(skillData));
      }

      if (
        (skillCreate.fulfilled.match(result) || skillUpdate.fulfilled.match(result)) &&
        result.payload?.response?.success
      ) {
        toast.success(
          isEditing
            ? 'Cập nhật kỹ năng thành công!'
            : 'Thêm kỹ năng thành công!'
        );

        // Gọi onSave với dữ liệu skill đã được cập nhật
        const updatedSkill: Skill = {
          id: skill?.id || result.payload.response.data.id,
          name: selectedTech?.name || '',
          level: levelText,
          description: description
        };
        onSave(updatedSkill);
        onClose();
      } else {
        toast.error(
          isEditing
            ? 'Cập nhật kỹ năng thất bại!'
            : 'Thêm kỹ năng thất bại!'
        );
      }
    } catch (error) {
      console.error('Failed to save skill:', error);
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-96 p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2">
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold mb-4">
          {isEditing ? 'Cập nhật kỹ năng' : 'Thêm kỹ năng mới'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Ngôn ngữ lập trình<span className="text-red-500">*</span>
            </label>
            <select
              value={selectedTechId}
              onChange={(e) => setSelectedTechId(e.target.value)}
              className="w-full border rounded-md p-2 bg-white"
              required
            >
              <option value="">Chọn ngôn ngữ lập trình</option>
              {techItems.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name}
                </option>
              ))}
            </select>
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
              placeholder="(Tùy chọn) Mô tả chi tiết về kinh nghiệm với ngôn ngữ này"
              className="w-full border rounded-md p-2 h-24"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {isEditing ? 'Cập nhật' : 'Tạo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillPopup;