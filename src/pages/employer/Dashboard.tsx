import React, { ReactNode } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChevronRight, Info } from 'lucide-react';

// Chart data
const chartData = [
  { month: 'Tháng 1', value: 0 },
  { month: 'Tháng 3', value: 1 },
  { month: 'Tháng 5', value: 0 },
  { month: 'Tháng 7', value: 0 },
  { month: 'Tháng 9', value: 0 },
  { month: 'Tháng 11', value: 0 },
];

// Define the type for children
interface CardProps {
  children: ReactNode;
  className?: string;
}

// Card component
const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
    {children}
  </div>
);

// StatCard component
const StatCard: React.FC<{ title: string; value: number; linkText: string }> = ({
  title,
  value,
  linkText,
}) => (
  <Card className="flex-1">
    <div className="flex items-center justify-between pb-2">
      <h3 className="text-sm font-medium">{title}</h3>
      <Info className="h-4 w-4 text-gray-400" />
    </div>
    <div className="text-2xl font-bold">{value}</div>
    <p className="text-xs text-blue-500 mt-1">
      {linkText} <ChevronRight className="h-3 w-3 inline" />
    </p>
  </Card>
);

// RecruitmentDashboard component
const RecruitmentDashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Trang chủ / Bảng tin</h1>
          <div className="grid grid-cols-4 gap-4">
            <StatCard title="Tin tuyển dụng" value={5} linkText="Xem chi tiết" />
            <StatCard title="Tin chờ duyệt" value={0} linkText="Xem chi tiết" />
            <StatCard title="Bài viết" value={0} linkText="Xem chi tiết" />
            <StatCard title="Ứng viên đã nộp CV" value={2} linkText="Xem chi tiết" />
          </div>
        </div>
        <Card>
          <h2 className="text-lg font-semibold mb-4">Ứng viên ứng tuyển</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </main>
    </div>
  );
};

export default RecruitmentDashboard;
