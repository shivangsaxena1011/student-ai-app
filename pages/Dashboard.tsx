import React, { useEffect, useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { CheckCircle, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { Task } from '../types';
import { generateMotivation } from '../services/geminiService';

const Dashboard: React.FC = () => {
  const [motivation, setMotivation] = useState<string>("Loading motivation...");

  useEffect(() => {
    const fetchMotivation = async () => {
        const quote = await generateMotivation();
        setMotivation(quote);
    };
    fetchMotivation();
  }, []);

  // Mock Data
  const studyData = [
    { name: 'Completed', value: 75 },
    { name: 'Remaining', value: 25 },
  ];
  
  const weeklyActivity = [
    { day: 'Mon', hours: 4 },
    { day: 'Tue', hours: 6 },
    { day: 'Wed', hours: 3 },
    { day: 'Thu', hours: 8 },
    { day: 'Fri', hours: 5 },
    { day: 'Sat', hours: 2 },
    { day: 'Sun', hours: 1 },
  ];

  const upcomingTasks: Task[] = [
    { id: '1', title: 'Thermodynamics Essay', dueDate: 'Today', priority: 'High', completed: false, subject: 'Physics' },
    { id: '2', title: 'Calculus Quiz Prep', dueDate: 'Tomorrow', priority: 'High', completed: false, subject: 'Math' },
    { id: '3', title: 'Read Chapter 4', dueDate: 'Wed', priority: 'Medium', completed: false, subject: 'History' },
  ];

  const COLORS = ['#4F46E5', '#E5E7EB'];

  return (
    <div className="space-y-6">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, Alex! 👋</h1>
            <p className="text-gray-500">Here's what's happening today.</p>
        </div>
        
        {/* Motivation Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-xl shadow-lg max-w-md w-full animate-fade-in">
            <div className="flex items-start gap-3">
                <Sparkles className="flex-shrink-0 mt-1" size={18} />
                <p className="text-sm font-medium italic">"{motivation}"</p>
            </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Tasks Done" 
          value="12" 
          icon={<CheckCircle className="text-green-500" />} 
          trend="+2 this week"
        />
        <StatCard 
          title="Study Hours" 
          value="24.5" 
          icon={<Clock className="text-indigo-500" />} 
          trend="On track"
        />
        <StatCard 
          title="Flashcards" 
          value="145" 
          icon={<LayersIcon className="text-orange-500" />} 
          trend="85% mastery"
        />
        <StatCard 
          title="Deadlines" 
          value="3" 
          icon={<AlertCircle className="text-red-500" />} 
          trend="Due soon"
          urgent
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Study Activity</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                    cursor={{fill: '#F3F4F6'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="hours" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress & Quick Tasks */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4">Goal Progress</h2>
                <div className="h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                            data={studyData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                            >
                            {studyData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-bold text-gray-900">75%</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Complete</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4">Upcoming Deadlines</h2>
                <div className="space-y-3">
                    {upcomingTasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                                <div>
                                    <p className="font-medium text-sm text-gray-900">{task.title}</p>
                                    <p className="text-xs text-gray-500">{task.subject} • {task.dueDate}</p>
                                </div>
                            </div>
                            <input type="checkbox" className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon, trend, urgent }: any) => (
  <div className={`p-6 rounded-2xl shadow-sm border ${urgent ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className={`text-sm font-medium ${urgent ? 'text-red-600' : 'text-gray-500'}`}>{title}</p>
        <h3 className={`text-2xl font-bold ${urgent ? 'text-red-900' : 'text-gray-900'}`}>{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${urgent ? 'bg-white bg-opacity-60' : 'bg-gray-50'}`}>
        {icon}
      </div>
    </div>
    <p className={`text-xs ${urgent ? 'text-red-600' : 'text-green-600'}`}>{trend}</p>
  </div>
);

const LayersIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
);

export default Dashboard;