import React, { useState, useEffect } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import SkillPopup from './SkillPopup';
import useAppDispatch from '../../hooks/useAppDispatch';
import { skillGetAll } from '../../services/skillApi';
import { toast } from 'react-toastify';


interface Skill {
  id?: number;
  name: string;
}


const ResumePage: React.FC = () => {

  const dispatch = useAppDispatch();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [isSkillPopupOpen, setIsSkillPopupOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);

  const Divider = () => <hr className="my-8 border-t border-gray-300" />;



  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const result = await dispatch(skillGetAll());
      if (skillGetAll.fulfilled.match(result)) {
        const skillsData = result.payload.response.data.map((item: any) => ({
          id: item.id,
          name: item.name,
        }));
        setSkills(skillsData);
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error);
      toast.error('Không thể tải danh sách kỹ năng. Vui lòng thử lại.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-3xl">

        <Divider />

        {/* Skills section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-orange-600">Kỹ năng</h2>
            <button
              onClick={() => setIsSkillPopupOpen(true)}
              className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
            >
              <Pencil size={20} />
            </button>
          </div>

          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-blue-100 text-blue-800 rounded-full px-4 py-1 text-sm"
                >
                  {skill.name}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Chưa có thông tin kỹ năng</p>
          )}
        </section>

        <SkillPopup
          isOpen={isSkillPopupOpen}
          onClose={() => setIsSkillPopupOpen(false)}
          initialSkills={selectedSkills}
        />

      </div>
    </div>

  );
};

export default ResumePage;