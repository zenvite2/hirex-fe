import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit, Trash2, Code, ShieldCheck, Star, Link as LinkIcon } from 'lucide-react';

import { Project, Resume, Certificate } from './types';
import { fetchResume, saveResume } from './api';
import ProjectPopup from './ProjectPopup';
import GoalPopup from './GoalPopup';
import HobbyPopup from './HobbyPopup';
import CertificatePopup from './CertificatePopup';

const ResumeComponent: React.FC = () => {
    const [resumeData, setResumeData] = useState<Resume>({
        career: undefined,
        hobby: undefined,
        certificates: [],
        projects: []
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

    const [showCertificatePopup, setShowPCertificatePopup] = useState(false);
    const [editingCertificate, setEditingCertificate] = useState<Certificate>({
        name: '',
        startDate: '',
        endDate: '',
        description: '',
    });

    const [showGoalPopup, setShowGoalPopup] = useState(false);
    const [editingGoal, setEditingGoal] = useState('');

    const [showHobbyPopup, setShowHobbyPopup] = useState(false);
    const [editingHobby, setEditingHobby] = useState('');

    // Fetch existing resume on component mount
    useEffect(() => {
        const loadResume = async () => {
            try {
                const fetchedResume = await fetchResume();
                if (fetchedResume) {
                    setResumeData({
                        id: fetchedResume.id,
                        career: fetchedResume.career,
                        hobby: fetchedResume.hobby,
                        certificates: fetchedResume.certificates || [],
                        projects: fetchedResume.projects || []
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
                setShowPCertificatePopup(false);
                resetCertificateForm();
            } catch (error) {
                console.error('Failed to save certificate', error);
            }
        }
    };

    const handleUpdateCertificate = async () => {
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

    // Popup open methods
    const openEditProjectPopup = (project: Project) => {
        setEditingProject(project);
        setShowProjectPopup(true);
    };

    const openEditCertificatePopup = (certificate: Certificate) => {
        setEditingCertificate(certificate);
        setShowProjectPopup(true);
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

                {resumeData.career && (
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

                {resumeData.hobby && (
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
                            setShowPCertificatePopup(true);
                        }}
                        className="text-green-600 hover:bg-green-100 p-2 rounded-full"
                    >
                        <Plus />
                    </button>
                </div>

                {resumeData.certificates?.map((certificate) => (
                    <div key={certificate.id} className="mb-6 bg-gray-100 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                {certificate.name && <h3 className="text-xl font-semibold text-gray-800">{certificate.name}</h3>}

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
                ))}
            </section>

            {/* Projects Section */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold border-b-2 border-blue-500 pb-2 flex items-center">
                        <Code className="mr-2 text-green-600" />
                        Dự Án
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

                {resumeData.projects?.map((project) => (
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
                ))}
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
                onClose={() => setShowPCertificatePopup(false)}
                onSave={editingCertificate.id ? handleUpdateProject : handleAddCertificate}
                onUpdateCertificate={(key, value) =>
                    setEditingCertificate(prev => ({ ...prev, [key]: value }))
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