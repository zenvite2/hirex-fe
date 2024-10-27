import React, { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import CareerGoalPopup from './CareerGoalPopup';
import useAppDispatch from '../../hooks/useAppDispatch';
import { careergoalGet } from '../../services/careergoalApi';
import { toast } from 'react-toastify';

interface CareerGoal {
  id?: number;
  position: string;
  salary: number;
  jobType: number;
}

const ResumePage: React.FC = () => {

  const dispatch = useAppDispatch();
  const [isCareerGoalEditPopupOpen, setIsCareerGoalEditPopupOpen] = useState(false);
  const [careerGoalData, setCareerGoalData] = useState<CareerGoal | null>(null);
  

  useEffect(() => {
    fetchCareerGoalData();
  }, []);

  const fetchCareerGoalData = async () => {
    try {
      const result = await dispatch(careergoalGet());

      if (careergoalGet.fulfilled.match(result) && result.payload?.response?.success) {
        setCareerGoalData(result.payload.response.data);
      } else {
        toast.error('Không thể tải thông tin mục tiêu nghề nghiệp');
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra khi tải thông tin mục tiêu nghề nghiệp');
    }
  };

  const handleSaveCareerGoalData = (updatedCareerGoal: CareerGoal) => {
    setCareerGoalData(updatedCareerGoal);
  };

  const formatSalary = (salary: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(salary);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-3xl">

        
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
              <p><span className="font-semibold">Vị trí mong muốn: </span> {careerGoalData?.position}</p>
              <p><span className="font-semibold">Mức lương mong muốn: </span> {careerGoalData?.salary ? formatSalary(careerGoalData.salary) : ''}</p>
              <p><span className="font-semibold">Loại công việc: </span> {careerGoalData?.jobType}</p>
            </div>
          </div>
        </header>

        <CareerGoalPopup
          isOpen={isCareerGoalEditPopupOpen}
          onClose={() => setIsCareerGoalEditPopupOpen(false)}
          onSave={handleSaveCareerGoalData}
          careergoal={careerGoalData}
        />
      </div>
    </div>

  );
};

export default ResumePage;