// import React, { useState, useEffect } from 'react';
// import { Pencil, Plus, Trash2 } from 'lucide-react';
// import useAppDispatch from '../../hooks/useAppDispatch';
// import { getEmployees } from '../../services/employeeApi';

// import { skillGetAll } from '../../services/skillApi';
// import { toast } from 'react-toastify';

// interface Skill {
//   id?: number;
//   name: string;
// }
// const ResumePage: React.FC = () => {

//   const dispatch = useAppDispatch();

//   const [skills, setSkills] = useState<Skill[]>([]);
//   const [isSkillPopupOpen, setIsSkillPopupOpen] = useState(false);
//   const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

//   const Divider = () => <hr className="my-8 border-t border-gray-300" />;

//   const fetchSkills = async () => {
//     try {
//       const result = await dispatch(skillGetAll());
//       if (skillGetAll.fulfilled.match(result)) {
//         const skillsData = result.payload.response.data.map((item: any) => ({
//           id: item.id,
//           name: item.name, 
//         }));
//         setSkills(skillsData);
//       }
//     } catch (error) {
//       console.error('Failed to fetch skills:', error);
//       toast.error('Failed to fetch skills. Please try again.');
//     }
//   };

//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  
//   const handleSave = (skills: Skill[]) => {
//     setSelectedSkills(skills);
//   };


//   return (
//     <div className="bg-gray-100 min-h-screen py-8">
//       <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-3xl">

//         {/* Skills section */}
//         <section className="mb-8">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold text-orange-600">Kỹ năng</h2>
//             <button
//               onClick={() => {
//                 setEditingSkill(null);
//                 setIsSkillPopupOpen(true);
//               }}
//               className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
//             >
//               <Plus size={20} />
//             </button>
//           </div>
//           {skills.length > 0 ? (
//             skills.map((skill) => (
//               <div key={skill.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
//                 <div>
//                   <p className="font-semibold">{skill.name}</p>                  
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => {
//                       setEditingSkill(skill);
//                       setIsSkillPopupOpen(true);
//                     }}
//                     className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
//                   >
//                     <Pencil size={16} />
//                   </button>
//                   <button
//                     className="text-red-500 hover:text-red-700 transition-colors duration-200"
//                   >
//                     <E size={16} />
//                   </button>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">Chưa có thông tin kỹ năng</p>
//           )}
//         </section>

//         {/* Popups */}

//         <SkillPopup
//           isOpen={isOpen}
//           onClose={() => setIsOpen(false)}
//           onSave={handleSave}
//           initialSkills={selectedSkills}
//         />


//       </div>
//     </div>

//   );
// };

export default {};