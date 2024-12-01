import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Briefcase, Plus, Edit, Trash2, Code, ShieldCheck, Star, GraduationCap, ShieldBan, Link as LinkIcon, FileDown } from 'lucide-react';
import { Project, Resume, Certificate, Education, Experience } from './types';
import ProjectPopup from './ProjectPopup';
import GoalPopup from './GoalPopup';
import HobbyPopup from './HobbyPopup';
import CertificatePopup from './CertificatePopup';
import EducationPopup from './EducationPopup';
import ExperiencePopup from './ExperiencePopup';
import { fetchResume, saveResume } from '../../services/resumeApi';


const ResumeComponent: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resumeData, setResumeData] = useState<Resume>({
        career: undefined,
        hobby: undefined,
        certificates: [],
        projects: [],
        educations: [],
        experiences: []
    });

    const [showProjectPopup, setShowProjectPopup] = useState(false);
    const [editingProject, setEditingProject] = useState<Project>({
        name: '',
        startDate: '',
        endDate: '',
        teamSize: 1,
        position: '',
        description: '',
        link: ''
    });

    const [showCertificatePopup, setShowCertificatePopup] = useState(false);
    const [editingCertificate, setEditingCertificate] = useState<Certificate>({
        name: '',
        startDate: '',
        endDate: '',
        description: '',
    });

    const [showEducationPopup, setShowEducationPopup] = useState(false);
    const [editingEducation, setEditingEducation] = useState<Education>({
        name: '',
        major: '',
        startDate: '',
        endDate: '',
        gpa: ''
    });

    const [showExperiencePopup, setShowExperiencePopup] = useState(false);
    const [editingExperience, setEditingExperience] = useState<Experience>({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
    });

    const Divider = () => <hr className="my-8 border-t border-gray-300" />;

    const [showGoalPopup, setShowGoalPopup] = useState(false);
    const [editingGoal, setEditingGoal] = useState('');

    const [showHobbyPopup, setShowHobbyPopup] = useState(false);
    const [editingHobby, setEditingHobby] = useState('');

    // Fetch existing resume on component mount
    useEffect(() => {
        const loadResume = async () => {
            try {
                const fetchedResume = await fetchResume(id);
                if (fetchedResume) {
                    setResumeData({
                        id: fetchedResume.id,
                        career: fetchedResume.career,
                        hobby: fetchedResume.hobby,
                        certificates: fetchedResume.certificates || [],
                        projects: fetchedResume.projects || [],
                        educations: fetchedResume.educations || [],
                        experiences: fetchedResume.experiences || []
                    });
                }
                console.log(fetchedResume)
            } catch (error) {
                console.error('Failed to load resume', error);
            }
        };

        loadResume();
    }, []);

    // Project Management Methods
    const handleAddProject = async () => {
        if (editingProject.name.trim() && editingProject.description.trim()) {
            const newProject = {
                ...editingProject,
                id: Date.now() // Temporary client-side ID
            };

            const updatedResume = {
                ...resumeData,
                projects: [...resumeData.projects, newProject]
            };

            try {
                const savedResume = await saveResume(updatedResume);
                setResumeData(savedResume);
                setShowProjectPopup(false);
                resetProjectForm();
            } catch (error) {
                console.error('Failed to save project', error);
            }
        }
    };

    const handleUpdateProject = async () => {
        const updatedProjects = resumeData.projects.map(project =>
            project.id === editingProject.id ? editingProject : project
        );

        try {
            const savedResume = await saveResume({
                ...resumeData,
                projects: updatedProjects
            });
            setResumeData(savedResume);
            setShowProjectPopup(false);
            resetProjectForm();
        } catch (error) {
            console.error('Failed to update project', error);
        }
    };

    const handleDeleteProject = async (projectId: number) => {
        const updatedProjects = resumeData.projects.filter(p => p.id !== projectId);

        try {
            const savedResume = await saveResume({
                ...resumeData,
                projects: updatedProjects
            });
            setResumeData(savedResume);
        } catch (error) {
            console.error('Failed to delete project', error);
        }
    };

    const handleAddCertificate = async () => {
        if (editingCertificate.name.trim() && editingCertificate.description.trim()) {
            const newCertificate = {
                ...editingCertificate,
                id: Date.now()
            };

            const updatedResume = {
                ...resumeData,
                certificates: [...resumeData.certificates, newCertificate]
            };

            try {
                const savedResume = await saveResume(updatedResume);
                setResumeData(savedResume);
                setShowCertificatePopup(false);
                resetCertificateForm();
            } catch (error) {
                console.error('Failed to save certificate', error);
            }
        }
    };

    const handleUpdateCertificate = async () => {
        const updatedCertificates = resumeData.certificates.map(certificate =>
            certificate.id === editingCertificate.id ? editingCertificate : certificate
        );

        try {
            const savedResume = await saveResume({
                ...resumeData,
                certificates: updatedCertificates
            });
            setResumeData(savedResume);
            setShowCertificatePopup(false);
            resetCertificateForm();
        } catch (error) {
            console.error('Failed to update project', error);
        }
    };

    const handleDeleteCertificate = async (certificateId: number) => {
        const updatedCertificates = resumeData.certificates.filter(p => p.id !== certificateId);

        try {
            const savedResume = await saveResume({
                ...resumeData,
                certificates: updatedCertificates
            });
            setResumeData(savedResume);
        } catch (error) {
            console.error('Failed to delete certificate', error);
        }
    };

    const handleAddEducation = async () => {
        if (editingEducation.name.trim() && editingEducation.major.trim()) {
            const newEducation = {
                ...editingEducation,
                id: Date.now()
            };

            const updatedResume = {
                ...resumeData,
                educations: [...resumeData.educations, newEducation]
            };

            try {
                const savedResume = await saveResume(updatedResume);
                setResumeData(savedResume);
                setShowEducationPopup(false);
                resetEducationForm();
            } catch (error) {
                console.error('Failed to save education', error);
            }
        }
    };

    const handleUpdateEducation = async () => {
        const updatedEducation = resumeData.educations.map(education =>
            education.id === editingEducation.id ? editingEducation : education
        );

        try {
            const savedResume = await saveResume({
                ...resumeData,
                educations: updatedEducation
            });
            setResumeData(savedResume);
            setShowEducationPopup(false);
            resetEducationForm();
        } catch (error) {
            console.error('Failed to update project', error);
        }
    };

    const handleDeleteEducation = async (educationId: number) => {
        const updatedCertificates = resumeData.certificates.filter(p => p.id !== educationId);

        try {
            const savedResume = await saveResume({
                ...resumeData,
                certificates: updatedCertificates
            });
            setResumeData(savedResume);
        } catch (error) {
            console.error('Failed to delete certificate', error);
        }
    };


    const handleAddExperience = async () => {
        if (editingExperience.company.trim() && editingExperience.position.trim()) {
            const newExperience = {
                ...editingExperience,
                id: Date.now()
            };

            const updatedResume = {
                ...resumeData,
                experiences: [...resumeData.experiences, newExperience]
            };

            try {
                const savedResume = await saveResume(updatedResume);
                setResumeData(savedResume);
                setShowExperiencePopup(false);
                resetExperienceForm();
            } catch (error) {
                console.error('Failed to save experience', error);
            }
        }
    };

    const handleUpdateExperience = async () => {
        const updatedExperience = resumeData.experiences.map(experience =>
            experience.id === editingExperience.id ? editingExperience : experience
        );

        try {
            const savedResume = await saveResume({
                ...resumeData,
                experiences: updatedExperience
            });
            setResumeData(savedResume);
            setShowEducationPopup(false);
            resetEducationForm();
        } catch (error) {
            console.error('Failed to update experience', error);
        }
    };

    const handleDeleteExperience = async (experienceId: number) => {
        const updatedExperience = resumeData.experiences.filter(p => p.id !== experienceId);

        try {
            const savedResume = await saveResume({
                ...resumeData,
                experiences: updatedExperience
            });
            setResumeData(savedResume);
        } catch (error) {
            console.error('Failed to delete experience', error);
        }
    };


    const handleSaveGoal = async () => {
        if (editingGoal.trim()) {
            try {
                const savedResume = await saveResume({
                    ...resumeData,
                    career: editingGoal
                });
                setResumeData(savedResume);
                setShowGoalPopup(false);
                setEditingGoal('');
            } catch (error) {
                console.error('Failed to save goal', error);
            }
        }
    };

    const handleSaveHobby = async () => {
        if (editingHobby.trim()) {
            try {
                const savedResume = await saveResume({
                    ...resumeData,
                    hobby: editingHobby
                });
                setResumeData(savedResume);
                setShowHobbyPopup(false);
                setEditingHobby('');
            } catch (error) {
                console.error('Failed to save hobby', error);
            }
        }
    };

    const handleDeleteGoal = async () => {
        try {
            const savedResume = await saveResume({
                ...resumeData,
                career: undefined
            });
            setResumeData(savedResume);
        } catch (error) {
            console.error('Failed to delete goal', error);
        }
    };

    const handleDeleteHobby = async () => {
        try {
            const savedResume = await saveResume({
                ...resumeData,
                hobby: undefined
            });
            setResumeData(savedResume);
        } catch (error) {
            console.error('Failed to delete goal', error);
        }
    };

    const resetProjectForm = () => {
        setEditingProject({
            name: '',
            startDate: '',
            endDate: '',
            teamSize: 1,
            position: '',
            description: '',
            link: ''
        });
    };

    const resetCertificateForm = () => {
        setEditingCertificate({
            name: '',
            startDate: '',
            endDate: '',
            description: ''
        });
    };

    const resetEducationForm = () => {
        setEditingEducation({
            name: '',
            major: '',
            startDate: '',
            endDate: '',
            gpa: ''
        });
    };

    const resetExperienceForm = () => {
        setEditingExperience({
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            description: ''
        });
    };

    // Popup open methods
    const openEditProjectPopup = (project: Project) => {
        setEditingProject(project);
        setShowProjectPopup(true);
    };

    const openEditCertificatePopup = (certificate: Certificate) => {
        setEditingCertificate(certificate);
        setShowCertificatePopup(true);
    };

    const openEditEducationPopup = (education: Education) => {
        setEditingEducation(education);
        setShowEducationPopup(true);
    };

    const openEditExperiencePopup = (experience: Experience) => {
        setEditingExperience(experience);
        setShowExperiencePopup(true);
    };

    const openEditGoalPopup = () => {
        setEditingGoal(resumeData.career || '');
        setShowGoalPopup(true);
    };

    const openEditHobbyPopup = () => {
        setEditingHobby(resumeData.hobby || '');
        setShowHobbyPopup(true);
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">

            <div className="fixed bottom-8 right-8 z-50">
                <button
                    onClick={() => navigate(`/generate-cv/${id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105"
                >
                    <FileDown size={20} />
                    <span>Xuất báo cáo</span>
                </button>
            </div>

            {/* Career Goals Section */}
            <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold border-b-2 border-blue-500 pb-2 flex items-center">
                        <Briefcase className="mr-2 text-blue-600" />
                        Mục Tiêu Nghề Nghiệp
                    </h2>
                    {!resumeData.career && (
                        <button
                            onClick={() => setShowGoalPopup(true)}
                            className="text-green-600 hover:bg-green-100 p-2 rounded-full"
                        >
                            <Plus />
                        </button>
                    )}
                </div>
                {resumeData.career ? (
                    <div className="flex justify-between items-center bg-gray-100 p-3 rounded">
                        <span>{resumeData.career}</span>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={openEditGoalPopup}
                                className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={handleDeleteGoal}
                                className="text-red-600 hover:bg-red-100 p-1 rounded"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <span className="text-gray-400">Giới thiệu bản thân và mục tiêu nghề nghiệp</span>
                    </div>
                )}
            </section>

            <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold border-b-2 border-blue-500 pb-2 flex items-center">
                        <Star className="mr-2 text-blue-600" />
                        Sở thích
                    </h2>
                    {!resumeData.hobby && (
                        <button
                            onClick={() => setShowHobbyPopup(true)}
                            className="text-green-600 hover:bg-green-100 p-2 rounded-full"
                        >
                            <Plus />
                        </button>
                    )}
                </div>

                {resumeData.hobby ? (
                    <div className="flex justify-between items-center bg-gray-100 p-3 rounded">
                        <span>{resumeData.hobby}</span>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={openEditHobbyPopup}
                                className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={handleDeleteHobby}
                                className="text-red-600 hover:bg-red-100 p-1 rounded"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div >
                        <span className="text-gray-400">Sở thích</span>
                    </div>
                )}
            </section>

            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold border-b-2 border-blue-500 pb-2 flex items-center">
                        <ShieldCheck className="mr-2 text-yellow-600" />
                        Chứng chỉ
                    </h2>
                    <button
                        onClick={() => {
                            resetCertificateForm();
                            setShowCertificatePopup(true);
                        }}
                        className="text-green-600 hover:bg-green-100 p-2 rounded-full"
                    >
                        <Plus />
                    </button>
                </div>

                {resumeData.certificates?.length > 0 ? (
                    resumeData.certificates.map((certificate) => (
                        <div key={certificate.id} className="mb-6 bg-gray-100 p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    {certificate.name && (
                                        <h3 className="text-xl font-semibold text-gray-800">{certificate.name}</h3>
                                    )}
                                    {(certificate.startDate || certificate.endDate) && (
                                        <p className="text-sm text-gray-600">
                                            {certificate.startDate} {certificate.startDate && certificate.endDate && '-'} {certificate.endDate}
                                        </p>
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => openEditCertificatePopup(certificate)}
                                        className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCertificate(certificate.id!)}
                                        className="text-red-600 hover:bg-red-100 p-1 rounded"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            {certificate.description && (
                                <p className="text-gray-700 mt-2 mb-2">{certificate.description}</p>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-gray-400">
                        <p>Tên khoá học/Chứng chỉ</p>
                        <p>Ngày bắt đầu - Ngày kết thúc</p>
                        <p><span className="font-semibold text-gray-700">Mô tả: </span> <span>Mô tả về khoá học của bạn</span></p>
                    </div>
                )}
            </section>

            <Divider />

            {/* Projects Section */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold border-b-2 border-blue-500 pb-2 flex items-center">
                        <Code className="mr-2 text-green-600" />
                        Dự án
                    </h2>
                    <button
                        onClick={() => {
                            resetProjectForm();
                            setShowProjectPopup(true);
                        }}
                        className="text-green-600 hover:bg-green-100 p-2 rounded-full"
                    >
                        <Plus />
                    </button>
                </div>
                {resumeData.projects?.length > 0 ? (
                    resumeData.projects?.map((project) => (
                        <div key={project.id} className="mb-6 bg-gray-100 p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    {project.name && <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>}

                                    {(project.startDate || project.endDate) && (
                                        <p className="text-sm text-gray-600">
                                            {project.startDate} {project.startDate && project.endDate && '-'} {project.endDate}
                                        </p>
                                    )}

                                    {project.position && (
                                        <p className="text-sm text-gray-600">Vị trí: {project.position}</p>
                                    )}

                                    {project.teamSize && (
                                        <p className="text-sm text-gray-600">Số lượng: {project.teamSize} người</p>
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => openEditProjectPopup(project)}
                                        className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProject(project.id!)}
                                        className="text-red-600 hover:bg-red-100 p-1 rounded"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {project.description && (
                                <p className="text-gray-700 mt-2 mb-2">{project.description}</p>
                            )}

                            {project.link && (
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline flex items-center mb-2"
                                >
                                    <LinkIcon size={16} className="mr-1" /> {project.link}
                                </a>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-gray-400">
                        <p>Tên dự án</p>
                        <p>Ngày bắt đầu - Ngày kết thúc</p>
                        <p><span className="font-semibold text-gray-700">Số lượng người tham gia: </span> <span>Số lượng người trong dự án</span></p>
                        <p><span className="font-semibold text-gray-700">Vị trí: </span> <span>Vị trí công việc</span></p>
                        <p><span className="font-semibold text-gray-700">Mô tả: </span> <span>Mô tả vai trò,trách nhiệm của bạn trong dự án</span></p>
                    </div>
                )}
            </section>

            <Divider />

            {/* Education Section */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold border-b-2 border-blue-500 pb-2 flex items-center">
                        <GraduationCap className="mr-2 text-green-600" />
                        Học vấn
                    </h2>
                    <button
                        onClick={() => {
                            resetEducationForm();
                            setShowEducationPopup(true);
                        }}
                        className="text-green-600 hover:bg-green-100 p-2 rounded-full"
                    >
                        <Plus />
                    </button>
                </div>
                {resumeData.educations?.length > 0 ? (
                    resumeData.educations?.map((education) => (
                        <div key={education.id} className="mb-6 bg-gray-100 p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    {education.name && <h3 className="text-xl font-semibold text-gray-800">{education.name}</h3>}

                                    {education.major && (
                                        <p className="text-sm text-gray-600">Ngành học: {education.major}</p>
                                    )}

                                    {(education.startDate || education.endDate) && (
                                        <p className="text-sm text-gray-600">
                                            {education.startDate} {education.startDate && education.endDate && '-'} {education.endDate}
                                        </p>
                                    )}

                                    {education.gpa && (
                                        <p className="text-sm text-gray-600">GPA: {education.gpa} </p>
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => openEditEducationPopup(education)}
                                        className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteEducation(education.id!)}
                                        className="text-red-600 hover:bg-red-100 p-1 rounded"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-400">
                        <p>Tên trường</p>
                        <p><span className="font-semibold text-gray-700">Ngành học: </span> <span>Số lượng người trong dự án</span></p>
                        <p>Ngày bắt đầu - Ngày kết thúc</p>
                        <p><span className="font-semibold text-gray-700">Mô tả: </span> <span>Mô tả chung</span></p>
                    </div>
                )}
            </section>

            <Divider />

            {/*Experience Section */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold border-b-2 border-blue-500 pb-2 flex items-center">
                        <ShieldBan className="mr-2 text-green-600" />
                        Kinh nghiệm
                    </h2>
                    <button
                        onClick={() => {
                            resetExperienceForm();
                            setShowExperiencePopup(true);
                        }}
                        className="text-green-600 hover:bg-green-100 p-2 rounded-full"
                    >
                        <Plus />
                    </button>
                </div>

                {resumeData.experiences?.length > 0 ? (
                    resumeData.experiences?.map((experience) => (
                    <div key={experience.id} className="mb-6 bg-gray-100 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                {experience.company && <h3 className="text-xl font-semibold text-gray-800">{experience.company}</h3>}

                                {experience.position && (
                                    <p className="text-sm text-gray-600">Vị trí: {experience.position}</p>
                                )}

                                {(experience.startDate || experience.endDate) && (
                                    <p className="text-sm text-gray-600">
                                        {experience.startDate} {experience.startDate && experience.endDate && '-'} {experience.endDate}
                                    </p>
                                )}

                                {experience.description && (
                                    <p className="text-sm text-gray-600">Mô tả: {experience.description} </p>
                                )}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => openEditExperiencePopup(experience)}
                                    className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDeleteExperience(experience.id!)}
                                    className="text-red-600 hover:bg-red-100 p-1 rounded"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                 ))
                ) : (
                    <div className="text-gray-400">
                        <p>Tên công ty</p>
                        <p>Ngày bắt đầu - Ngày kết thúc</p>
                        <p><span className="font-semibold text-gray-700">Vị trí công việc: </span> <span>Vị trí công việc</span></p>
                        <p><span className="font-semibold text-gray-700">Hình thức làm việc: </span> <span>Hình thức làm việc</span></p>
                        <p><span className="font-semibold text-gray-700">Mô tả: </span> <span>Mô tả về kinh nghiệm làm việc của bạn</span></p>
                    </div>
                )}
            </section>

            {/* Project Popup Component */}
            <ProjectPopup
                show={showProjectPopup}
                editingProject={editingProject}
                onClose={() => setShowProjectPopup(false)}
                onSave={editingProject.id ? handleUpdateProject : handleAddProject}
                onUpdateProject={(key, value) =>
                    setEditingProject(prev => ({ ...prev, [key]: value }))
                }
            />

            <CertificatePopup
                show={showCertificatePopup}
                editingCertificate={editingCertificate}
                onClose={() => setShowCertificatePopup(false)}
                onSave={editingCertificate.id ? handleUpdateCertificate : handleAddCertificate}
                onUpdateCertificate={(key, value) =>
                    setEditingCertificate(prev => ({ ...prev, [key]: value }))
                }
            />

            <EducationPopup
                show={showEducationPopup}
                editingEducation={editingEducation}
                onClose={() => setShowEducationPopup(false)}
                onSave={editingEducation.id ? handleUpdateEducation : handleAddEducation}
                onUpdateEducation={(key, value) =>
                    setEditingEducation(prev => ({ ...prev, [key]: value }))
                }
            />

            <ExperiencePopup
                show={showExperiencePopup}
                editingExperience={editingExperience}
                onClose={() => setShowExperiencePopup(false)}
                onSave={editingExperience.id ? handleUpdateExperience : handleAddExperience}
                onUpdateExperience={(key, value) =>
                    setEditingExperience(prev => ({ ...prev, [key]: value }))
                }
            />

            {/* Goal Popup Component */}
            <GoalPopup
                show={showGoalPopup}
                editingGoal={editingGoal}
                existingGoal={resumeData.career}
                onClose={() => setShowGoalPopup(false)}
                onSave={handleSaveGoal}
                setEditingGoal={setEditingGoal}
            />

            <HobbyPopup
                show={showHobbyPopup}
                editingHobby={editingHobby}
                existingGoal={resumeData.hobby}
                onClose={() => setShowHobbyPopup(false)}
                onSave={handleSaveHobby}
                setEditingHobby={setEditingHobby}
            />
        </div>
    );
};

export default ResumeComponent;