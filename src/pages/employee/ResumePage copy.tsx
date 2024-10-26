import React, { useState, useEffect } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import EducationPopup from './EducationPopup';
import SkillPopup from './SkillPopup';
import useAppDispatch from '../../hooks/useAppDispatch';
import { educationDelete, educationGetAll } from '../../services/educationApi';
import { skillGetAll, skillDelete} from '../../services/skillApi';
import { toast } from 'react-toastify';


interface Education {
  id?: number;
  level: string;
  universityName: string;
  expertise: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Skill {
  id?: number;
  name: string;
  level: string;
  description?: string;
}

const ResumePage: React.FC = () => {

  const dispatch = useAppDispatch();
  const [educations, setEducations] = useState<Education[]>([]);
  const [isEducationPopupOpen, setIsEducationPopupOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);

 
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isSkillPopupOpen, setIsSkillPopupOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const Divider = () => <hr className="my-8 border-t border-gray-300" />;

  const fetchEducations = async () => {
    try {
      const result = await dispatch(educationGetAll());
      if (educationGetAll.fulfilled.match(result)) {
        const educationsData = result.payload.response.data.map((item: any) => ({
          id: item.id,
          universityName: item.universityName,
          expertise: item.expertise,
          startDate: item.startDate || '',
          endDate: item.endDate || '',
          description: item.description,
          level: item.level // Assuming the API now returns the level
        }));
        setEducations(educationsData);
      }
    } catch (error) {
      console.error('Failed to fetch educations:', error);
      toast.error('Failed to fetch educations. Please try again.');
    }
  };

  const handleSaveEducation = async (education: Education) => {
    await fetchEducations();
    setEditingEducation(null);
    setIsEducationPopupOpen(false);
  };

  const handleDeleteEducation = async (id: number) => {
    try {
      const action = await dispatch(educationDelete(id));
      if (educationDelete.fulfilled.match(action)) {
        await fetchEducations(); 
        toast.success('Education deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete education:', error);
      toast.error('Failed to delete education. Please try again.');
    }

  };
  useEffect(() => {
    fetchEducations();
  }, [dispatch]);

  const fetchSkills = async () => {
    try {
      const result = await dispatch(skillGetAll());
      if (skillGetAll.fulfilled.match(result)) {
        const skillsData = result.payload.response.data.map((item: any) => ({
          id: item.id,
          name: item.skillName,
          level: item.level,
          description: item.description
        }));
        setSkills(skillsData);
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error);
      toast.error('Failed to fetch skills. Please try again.');
    }
  };

  const handleSaveSkill = async (skill: Skill) => {
    await fetchSkills();
    setEditingSkill(null);
    setIsSkillPopupOpen(false);
  };

  const handleDeleteSkill = async (id: number) => {
    try {
      const action = await dispatch(skillDelete(id));
      if (action?.payload?.response?.success ===  true) {
        await fetchSkills(); 
        toast.success('Skill deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete skill. Please try again.');
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [dispatch]);

  
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-3xl">

        <Divider />

        {/* Education section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-orange-600">Học vấn</h2>
            <button
              onClick={() => {
                setEditingEducation(null);
                setIsEducationPopupOpen(true);
              }}
              className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
            >
              <Plus size={20} />
            </button>
          </div>
          {educations.length > 0 ? (
            educations.map((edu) => (
              <div key={edu.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600">{edu.expertise}</p>
                    <p className="font-semibold text-lg">{edu.universityName}</p>
                    <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingEducation(edu);
                        setIsEducationPopupOpen(true);
                      }}
                      className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteEducation(edu.id!)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Chưa có thông tin học vấn</p>
          )}
        </section>

        <Divider />

        {/* Skills section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-orange-600">Kỹ năng</h2>
            <button
              onClick={() => {
                setEditingSkill(null);
                setIsSkillPopupOpen(true);
              }}
              className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
            >
              <Plus size={20} />
            </button>
          </div>
          {skills.length > 0 ? (
              skills.map((skill) => (
                <div key={skill.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{skill.name}</p>
                    <p className="text-sm text-gray-600">{skill.level}</p>
                    {skill.description && (
                      <p className="text-sm text-gray-500 mt-1">{skill.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingSkill(skill);
                        setIsSkillPopupOpen(true);
                      }}
                      className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteSkill(skill.id!)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-gray-500">Chưa có thông tin kỹ năng</p>
          )}
        </section>
        <Divider />

        <EducationPopup
          isOpen={isEducationPopupOpen}
          onClose={() => setIsEducationPopupOpen(false)}
          onSave={handleSaveEducation}
          education={editingEducation}
        />
        <SkillPopup
          isOpen={isSkillPopupOpen}
          onClose={() => setIsSkillPopupOpen(false)}
          onSave={handleSaveSkill}
          skill={editingSkill}
        />
    
      </div>
    </div>

  );
};

export default ResumePage;