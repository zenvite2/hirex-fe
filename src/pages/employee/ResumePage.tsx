import React from 'react';
import Header from "../../components/layout/Header";
import ResumeContent from './ResumeContent';

const ResumePage: React.FC = () => {
  return (
    <div>
      <Header activeTab="ho-so" />
      <ResumeContent />
    </div>
  );
};

export default ResumePage;