import React, { useState, useEffect } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import ExperiencePopup from './ExperiencePopup';
import EducationPopup from './EducationPopup';
import SkillPopup from './SkillPopup';
import HeaderEditPopup from './HeaderEditPopup';
import CareerGoalPopup from './CareerGoalPopup';
import useAppDispatch from '../../hooks/useAppDispatch';
import { getEmployees } from '../../services/employeeApi';
import { RiAccountBoxFill } from "react-icons/ri";
import { educationDelete, educationGetAll } from '../../services/educationApi';
import { experienceDelete, experienceGetAll } from '../../services/experienceApi';
import { skillGetAll, skillDelete } from '../../services/skillApi';
import { toast } from 'react-toastify';

interface Experience {
  id?: number;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  yearExperience: number;
}

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

interface HeaderData {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  email: string;
  phoneNumber: string;
  avatarUrl?: string;
}

interface CareerGoalData {
  id?: number;
  position: string;
  description: string;
}

const ResumePage: React.FC = () => {

  const dispatch = useAppDispatch();
  const [educations, setEducations] = useState<Education[]>([]);
  const [isEducationPopupOpen, setIsEducationPopupOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isExperiencePopupOpen, setIsExperiencePopupOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [isSkillPopupOpen, setIsSkillPopupOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const Divider = () => <hr className="my-8 border-t border-gray-300" />;

  const [isHeaderEditPopupOpen, setIsHeaderEditPopupOpen] = useState(false);
  const [headerData, setHeaderData] = useState<HeaderData>({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    email: '',
    phoneNumber: '',
    avatarUrl: '',
  });

  const [isCareerGoalEditPopupOpen, setIsCareerGoalEditPopupOpen] = useState(false);
  const [CareerGoalData, setCareerGoalData] = useState<CareerGoalData>({
    position: '',
    description: ''
  });

  const handleSaveHeaderData = (newData: HeaderData) => {
    setHeaderData(newData);
    setIsHeaderEditPopupOpen(false);
  };

  const handleSaveCareerGoalData = (newData: CareerGoalData) => {
    setCareerGoalData(newData);
    setIsCareerGoalEditPopupOpen(false);
  };

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
        await fetchEducations(); // Fetch the updated list after deletion
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

  const fetchExperiens = async () => {
    try {
      const result = await dispatch(experienceGetAll());
      if (experienceGetAll.fulfilled.match(result)) {
        const experiencesData = result.payload.response.data.map((item: any) => ({
          id: item.id,
          companyName: item.companyName,
          position: item.position,
          startDate: item.startDate || '',
          endDate: item.endDate || '',
          description: item.description,
          yearExperience: item.yearExperience // Assuming the API now returns the level
        }));
        setExperiences(experiencesData);
      }
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
      toast.error('Failed to fetch experiences. Please try again.');
    }
  };

  const handleSaveExperience = async (experience: Experience) => {
    await fetchExperiens();
    setEditingExperience(null);
    setIsExperiencePopupOpen(false);
  };

  const handleDeleteExperience = async (id: number) => {
    try {
      const action = await dispatch(experienceDelete(id));
      if (experienceDelete.fulfilled.match(action)) {
        await fetchEducations();
        toast.success('Experience deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete experience:', error);
      toast.error('Failed to delete experience. Please try again.');
    }

  };
  useEffect(() => {
    fetchExperiens();
  }, [dispatch]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const action = await dispatch(getEmployees());
        if (getEmployees.fulfilled.match(action)) {
          const employeeData = action.payload.response?.data;
          if (employeeData) {
            const [day, month, year] = employeeData.dateOfBirth.split('/');
            const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            setHeaderData({
              fullName: employeeData.fullName,
              gender: employeeData.gender,
              dateOfBirth: formattedDate, // Đã được chuyển đổi sang yyyy-mm-dd
              address: employeeData.address,
              email: employeeData.email,
              phoneNumber: employeeData.phoneNumber,
              avatarUrl: employeeData.avatar,
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch employee data:', error);
      }
    };

    fetchEmployeeData();
  }, [dispatch]);

  const fetchSkills = async () => {
    try {
      const result = await dispatch(skillGetAll());
      if (skillGetAll.fulfilled.match(result)) {
        const skillsData = result.payload.response.data.map((item: any) => ({
          id: item.id,
          name: item.techName,
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

        {/* Header section */}
        <header className="mb-8 flex items-start">
          {headerData.avatarUrl ? (
            <img
              src={headerData.avatarUrl}
              alt="Profile"
              className="w-24 h-24 mr-8 bg-gray-200 flex items-center justify-center rounded-md"
            />
          ) : (
            <div className="w-24 h-24  mr-8 bg-gray-200 flex items-center justify-center rounded-md">
              <RiAccountBoxFill className="w-16 h-16 text-gray-400" />
            </div>
          )}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold">{headerData.fullName}</h1>
              <button
                onClick={() => setIsHeaderEditPopupOpen(true)}
                className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
              >
                <Pencil size={20} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p><span className="font-semibold">Giới tính:</span> {headerData.gender}</p>
              <p><span className="font-semibold">Ngày sinh:</span> {new Date(headerData.dateOfBirth).toLocaleDateString('vi-VN')}</p>
              <p><span className="font-semibold">Địa chỉ:</span> {headerData.address}</p>
              <p><span className="font-semibold">Email:</span> {headerData.email}</p>
              <p><span className="font-semibold">Số điện thoại:</span> {headerData.phoneNumber}</p>
            </div>
          </div>
        </header>

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

        {/* Experience section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-orange-600">Kinh nghiệm làm việc</h2>
            <button
              onClick={() => {
                setEditingExperience(null);
                setIsExperiencePopupOpen(true);
              }}
              className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
            >
              <Plus size={20} />
            </button>
          </div>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{exp.companyName}</p>
                  <p className="text-gray-600">{exp.position}</p>
                  <p className="text-sm text-gray-500">{exp.startDate} - {exp.endDate}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingExperience(exp);
                      setIsExperiencePopupOpen(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteExperience(exp.id!)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
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

        <header className="mb-8 flex items-start">
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-orange-600">Mục tiêu nghề nghiệp</h2>
              <button
                onClick={() => setIsCareerGoalEditPopupOpen(true)}
                className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
              >
                <Pencil size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <p><span className="font-semibold">Vị trí:</span> {headerData.gender}</p>
              <p><span className="font-semibold">Mô tả:</span> {new Date(headerData.dateOfBirth).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
        </header>

        {/* Popups */}
        <ExperiencePopup
          isOpen={isExperiencePopupOpen}
          onClose={() => setIsExperiencePopupOpen(false)}
          onSave={handleSaveExperience}
          experience={editingExperience}
        />
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
        <HeaderEditPopup
          isOpen={isHeaderEditPopupOpen}
          onClose={() => setIsHeaderEditPopupOpen(false)}
          onSave={handleSaveHeaderData}
          headerData={{ ...headerData, avatarUrl: headerData.avatarUrl }}
        />
        <CareerGoalPopup
          isOpen={isCareerGoalEditPopupOpen}
          onClose={() => setIsCareerGoalEditPopupOpen(false)}
          onSave={handleSaveCareerGoalData}
          careergoal={CareerGoalData}
        />

      </div>
    </div>

  );
};

export default ResumePage;