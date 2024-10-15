import React, { useState } from 'react';
import { Pencil, Plus } from 'lucide-react';
import ExperiencePopup from './ExperiencePopup';
import EducationPopup from './EducationPopup';
import CertificationPopup from './CertificationPopup';
import SkillPopup from './SkillPopup';
import HeaderEditPopup from './HeaderEditPopup';
import { Logo } from "../../assets";

interface ResumeData {
  name: string;
  gender: string;
  birthDate: string;
  maritalStatus: string;
  nationality: string;
  address: string;
  email: string;
  totalExperience: string;
  about: string;
}

interface Experience {
  id?: number;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id?: number;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
  major: string;
}

interface Certification {
  id?: number;
  name: string;
  issuedBy: string;
  issueDate: string;
  expirationDate?: string;
}

interface Skill {
  id?: number;
  name: string;
  level: string;
}

const ResumePage: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  const [isExperiencePopupOpen, setIsExperiencePopupOpen] = useState(false);
  const [isEducationPopupOpen, setIsEducationPopupOpen] = useState(false);
  const [isCertificationPopupOpen, setIsCertificationPopupOpen] = useState(false);
  const [isSkillPopupOpen, setIsSkillPopupOpen] = useState(false);

  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const Divider = () => <hr className="my-8 border-t border-gray-300" />;
  const [isHeaderEditPopupOpen, setIsHeaderEditPopupOpen] = useState(false);
  const [headerData, setHeaderData] = useState({
    name: "Quân Nguyễn",
    gender: "Nam",
    birthDate: "15/01/1970",
    address: 'Hà nội',
    email:'quanbanthu@gmail.com'
  });

  const handleSaveHeaderData = (newData) => {
    setHeaderData(newData);
    setIsHeaderEditPopupOpen(false);
  };

  const handleSaveExperience = (experience: Experience) => {
    if (experience.id) {
      setExperiences(experiences.map(e => e.id === experience.id ? experience : e));
    } else {
      setExperiences([...experiences, { ...experience, id: Date.now() }]);
    }
    setEditingExperience(null);
    setIsExperiencePopupOpen(false);
  };

  const handleSaveEducation = (education: Education) => {
    if (education.id) {
      setEducations(educations.map(e => e.id === education.id ? education : e));
    } else {
      setEducations([...educations, { ...education, id: Date.now() }]);
    }
    setEditingEducation(null);
    setIsEducationPopupOpen(false);
  };

  const handleSaveCertification = (certification: Certification) => {
    if (certification.id) {
      setCertifications(certifications.map(c => c.id === certification.id ? certification : c));
    } else {
      setCertifications([...certifications, { ...certification, id: Date.now() }]);
    }
    setEditingCertification(null);
    setIsCertificationPopupOpen(false);
  };

  const handleSaveSkill = (skill: Skill) => {
    if (skill.id) {
      setSkills(skills.map(s => s.id === skill.id ? skill : s));
    } else {
      setSkills([...skills, { ...skill, id: Date.now() }]);
    }
    setEditingSkill(null);
    setIsSkillPopupOpen(false);
  };


  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-3xl">

        {/* Header section */}
        <header className="mb-8 flex items-start">
          <img
            src={Logo}
            alt="Profile"
            className="w-32 h-32 rounded-full mr-8 object-cover"
          />
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold">{headerData.name}</h1>
              <button
                onClick={() => setIsHeaderEditPopupOpen(true)}
                className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
              >
                <Pencil size={20} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p><span className="font-semibold">Giới tính:</span> {headerData.gender}</p>
              <p><span className="font-semibold">Ngày sinh:</span> {headerData.birthDate}</p>
              <p><span className="font-semibold">Địa chỉ:</span> {headerData.address}</p>
              <p><span className="font-semibold">Email:</span> {headerData.email}</p>
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
                    <p className="font-semibold text-lg">{edu.school}</p>
                    <p className="text-gray-600">{edu.degree}</p>
                    <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingEducation(edu);
                      setIsEducationPopupOpen(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                  >
                    <Pencil size={16} />
                  </button>
                </div>
                <p className="mt-2 text-gray-700">{edu.description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500"></p>
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
                  <p className="font-semibold text-lg">{exp.company}</p>
                  <p className="text-gray-600">{exp.position}</p>
                  <p className="text-sm text-gray-500">{exp.startDate} - {exp.endDate}</p>
                </div>
                <button
                  onClick={() => {
                    setEditingExperience(exp);
                    setIsExperiencePopupOpen(true);
                  }}
                  className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                >
                  <Pencil size={16} />
                </button>
              </div>
              <p className="mt-2 text-gray-700">{exp.description}</p>
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
          <div className="grid grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div key={skill.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold">{skill.name}</p>
                  <p className="text-sm text-gray-600">{skill.level}</p>
                </div>
                <button
                  onClick={() => {
                    setEditingSkill(skill);
                    setIsSkillPopupOpen(true);
                  }}
                  className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                >
                  <Pencil size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

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
        <CertificationPopup
          isOpen={isCertificationPopupOpen}
          onClose={() => setIsCertificationPopupOpen(false)}
          onSave={handleSaveCertification}
          certification={editingCertification}
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
          headerData={headerData}
        />
      </div>
    </div>

  );
};

export default ResumePage;