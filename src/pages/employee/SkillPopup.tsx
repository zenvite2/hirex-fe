import React, { useState, useRef } from 'react';
import { X, ChevronDown } from 'lucide-react';
import useAppDispatch from '../../hooks/useAppDispatch';
import { skillList } from '../../services/autofillApi';
import { updateSkill } from '../../services/employeeApi';
import { toast } from 'react-toastify';

interface Skill {
  id?: number;
  name: string;
}

interface SkillPopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialSkills?: Skill[];
}

const SkillPopup: React.FC<SkillPopupProps> = ({
  isOpen,
  onClose,
  initialSkills = []
}) => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>(initialSkills);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const debounceTimeoutRef = useRef<number>();

  const fetchSkills = async (name: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = window.setTimeout(async () => {
      setIsLoading(true);
      try {
        const result = await dispatch(skillList({ name })).unwrap();
        if (result?.response) {
          setAvailableSkills(result?.response?.data);
        } else {
          setAvailableSkills([]);
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
        setAvailableSkills([]);
        toast.error('Có lỗi khi tải danh sách kỹ năng');
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const filteredSkills = Array.isArray(availableSkills)
    ? availableSkills.filter(
      skill => !selectedSkills.some(selected => selected.id === skill.id)
    )
    : [];

  const handleAddSkill = (skill: Skill) => {
    if (!selectedSkills.some(selected => selected.id === skill.id)) {
      setSelectedSkills(prev => [...prev, skill]);
    }
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      // Chỉ lấy các id của skill và loại bỏ những skill không có id
      const skillIds = selectedSkills
        .map(skill => skill.id)
        .filter((id): id is number => id !== undefined);

      // Gửi request với body chỉ chứa mảng id
      const result = await dispatch(updateSkill({ skillIds })).unwrap();
      toast.success('Cập nhật kỹ năng thành công');
      onClose();

    } catch (error) {
      console.error('Error saving skills:', error);
      toast.error('Có lỗi xảy ra khi lưu kỹ năng');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">Sửa kỹ năng</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kỹ năng <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                fetchSkills(e.target.value);
              }}
              onFocus={() => {
                setIsDropdownOpen(true);
                fetchSkills('');
              }}
              placeholder="Nhập mới hoặc chọn trong danh sách dưới đây"
              className="w-full p-2 pr-8 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <ChevronDown
              className={`absolute right-2 top-3 text-gray-400 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`}
              size={20}
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                if (!isDropdownOpen) fetchSkills('');
              }}
            />

            {isDropdownOpen && (
              <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                {isLoading ? (
                  <div className="p-2 text-center text-gray-500">Đang tải...</div>
                ) : (
                  <>
                    {filteredSkills.map((skill) => (
                      <button
                        key={skill.id ?? skill.name}
                        onClick={() => handleAddSkill(skill)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50"
                      >
                        {skill.name}
                      </button>
                    ))}
                    {!isLoading && filteredSkills.length === 0 && (
                      <div className="p-2 text-center text-gray-500">
                        Không tìm thấy kỹ năng
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {selectedSkills.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <div
                  key={skill.id ?? skill.name}
                  className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm flex items-center"
                >
                  {skill.name}
                  <button
                    onClick={() => setSelectedSkills(prev => prev.filter(s => s.id !== skill.id))}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillPopup;