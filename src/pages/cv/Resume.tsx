import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Plus, Edit, Trash2, X, Code, Link as LinkIcon } from 'lucide-react';

interface Project {
    id?: number;
    name: string;
    description: string;
    technologies: string[];
    link?: string;
}

interface Resume {
    id?: number;
    career?: string;
    projects: Project[];
}

const Resume: React.FC = () => {
    const [resumeData, setResumeData] = useState<Resume>({
        career: undefined,
        projects: []
    });

    const [showProjectPopup, setShowProjectPopup] = useState(false);
    const [editingProject, setEditingProject] = useState<Project>({
        name: '',
        description: '',
        technologies: [],
        link: ''
    });
    const [techInput, setTechInput] = useState('');
    const [showGoalPopup, setShowGoalPopup] = useState(false);
    const [editingGoal, setEditingGoal] = useState('');

    // Fetch existing resume
    // Fetch existing resume
    useEffect(() => {
        const fetchResume = async () => {
            try {
                const response = await axios.get('http://localhost:8080/resumes');
                console.log(response.data);

                // Ensure we have a valid response structure
                if (response.data && response.data.length > 0) {
                    // Map the API response to our Resume interface
                    const apiResume = response.data[0];
                    setResumeData({
                        id: apiResume.id,
                        career: apiResume.career,
                        projects: apiResume.projects || []
                    });
                }
            } catch (error) {
                console.error('Error fetching resume:', error);
            }
        };

        fetchResume();
    }, []);

    // Save entire resume (used for both career goal and projects)
    const saveResume = async (updatedResume: Resume) => {
        try {
            let response;
            if (updatedResume.id) {
                // Update existing resume
                response = await axios.put(
                    `http://localhost:8080/resumes/${updatedResume.id}`,
                    updatedResume
                );
            } else {
                // Create new resume
                response = await axios.post('http://localhost:8080/resumes', updatedResume);
            }
            setResumeData(response.data);
        } catch (error) {
            console.error('Error saving resume:', error);
        }
    };

    // Project Management Methods
    const handleAddProject = () => {
        if (editingProject.name.trim() && editingProject.description.trim()) {
            const newProject = {
                ...editingProject,
                id: Date.now() // Temporary client-side ID
            };

            const updatedProjects = [...resumeData.projects, newProject];

            saveResume({
                ...resumeData,
                projects: updatedProjects
            });

            // Reset project popup
            setShowProjectPopup(false);
            setEditingProject({
                name: '',
                description: '',
                technologies: [],
                link: ''
            });
        }
    };

    const handleEditProject = (projectToEdit: Project) => {
        setEditingProject(projectToEdit);
        setShowProjectPopup(true);
    };

    const handleUpdateProject = () => {
        const updatedProjects = resumeData.projects.map(project =>
            project.id === editingProject.id ? editingProject : project
        );

        saveResume({
            ...resumeData,
            projects: updatedProjects
        });

        // Reset project popup
        setShowProjectPopup(false);
        setEditingProject({
            name: '',
            description: '',
            technologies: [],
            link: ''
        });
    };

    const handleDeleteProject = (projectId: number) => {
        const updatedProjects = resumeData.projects.filter(p => p.id !== projectId);

        saveResume({
            ...resumeData,
            projects: updatedProjects
        });
    };

    const handleAddTechnology = () => {
        if (techInput.trim()) {
            setEditingProject(prev => ({
                ...prev,
                technologies: [...prev.technologies, techInput.trim()]
            }));
            setTechInput('');
        }
    };

    const handleRemoveTechnology = (techToRemove: string) => {
        setEditingProject(prev => ({
            ...prev,
            technologies: prev.technologies.filter(tech => tech !== techToRemove)
        }));
    };

    // Career Goal Methods
    const handleSaveGoal = () => {
        if (editingGoal.trim()) {
            saveResume({
                ...resumeData,
                career: editingGoal
            });

            setShowGoalPopup(false);
            setEditingGoal('');
        }
    };

    const handleDeleteGoal = () => {
        saveResume({
            ...resumeData,
            career: undefined
        });
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
                                onClick={() => {
                                    setEditingGoal(resumeData.career || '');
                                    setShowGoalPopup(true);
                                }}
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

            {/* Projects Section */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold border-b-2 border-blue-500 pb-2 flex items-center">
                        <Code className="mr-2 text-green-600" />
                        Dự Án
                    </h2>
                    <button
                        onClick={() => {
                            setEditingProject({
                                name: '',
                                description: '',
                                technologies: [],
                                link: ''
                            });
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
                            <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEditProject(project)}
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
                        <p className="text-gray-700 mb-2">{project.description}</p>
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
                        {/* <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech) => (
                                <span
                                    key={tech}
                                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div> */}
                    </div>
                ))}
            </section>

            {/* Project Popup */}
            {showProjectPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">
                                {editingProject.id ? 'Chỉnh Sửa Dự Án' : 'Thêm Dự Án Mới'}
                            </h3>
                            <button
                                onClick={() => setShowProjectPopup(false)}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <X />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                value={editingProject.name}
                                onChange={(e) => setEditingProject(prev => ({
                                    ...prev,
                                    name: e.target.value
                                }))}
                                className="w-full p-2 border rounded"
                                placeholder="Tên dự án"
                            />
                            <textarea
                                value={editingProject.description}
                                onChange={(e) => setEditingProject(prev => ({
                                    ...prev,
                                    description: e.target.value
                                }))}
                                className="w-full p-2 border rounded"
                                placeholder="Mô tả dự án"
                                rows={3}
                            />
                            <input
                                type="text"
                                value={editingProject.link}
                                onChange={(e) => setEditingProject(prev => ({
                                    ...prev,
                                    link: e.target.value
                                }))}
                                className="w-full p-2 border rounded"
                                placeholder="Đường link dự án (tùy chọn)"
                            />

                            <div>
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={techInput}
                                        onChange={(e) => setTechInput(e.target.value)}
                                        className="w-full p-2 border rounded-l"
                                        placeholder="Nhập công nghệ"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleAddTechnology();
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={handleAddTechnology}
                                        className="bg-blue-500 text-white px-4 rounded-r"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {/* {editingProject.technologies.map((tech) => (
                                        <span
                                            key={tech}
                                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center"
                                        >
                                            {tech}
                                            <button
                                                onClick={() => handleRemoveTechnology(tech)}
                                                className="ml-1 text-red-500"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))} */}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                onClick={() => setShowProjectPopup(false)}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={editingProject.id ? handleUpdateProject : handleAddProject}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Goal Popup */}
            {showGoalPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">
                                {resumeData.career ? 'Chỉnh Sửa Mục Tiêu' : 'Thêm Mục Tiêu Mới'}
                            </h3>
                            <button
                                onClick={() => setShowGoalPopup(false)}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <X />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={editingGoal}
                            onChange={(e) => setEditingGoal(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Nhập mục tiêu nghề nghiệp"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowGoalPopup(false)}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSaveGoal}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Resume; 