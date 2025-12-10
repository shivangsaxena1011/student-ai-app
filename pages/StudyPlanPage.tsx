import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, GripVertical, MoreVertical, Plus, Sparkles, Loader2, X } from 'lucide-react';
import { StudyPlanItem } from '../types';
import { generateStudyPlan } from '../services/geminiService';

const StudyPlanPage: React.FC = () => {
  const [plan, setPlan] = useState<StudyPlanItem[]>([
    { id: '1', title: 'Review Physics Notes', startTime: '09:00', endTime: '10:00', type: 'study' },
    { id: '2', title: 'Coffee Break', startTime: '10:00', endTime: '10:15', type: 'break' },
    { id: '3', title: 'Calculus Problems', startTime: '10:15', endTime: '11:45', type: 'study' },
    { id: '4', title: 'History Flashcards', startTime: '13:00', endTime: '14:00', type: 'review' },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenModal, setShowGenModal] = useState(false);
  const [goalsInput, setGoalsInput] = useState('');

  const handleAutoGenerate = async () => {
    if (!goalsInput.trim()) return;
    
    setIsGenerating(true);
    const newPlan = await generateStudyPlan(goalsInput);
    if (newPlan && newPlan.length > 0) {
        setPlan(newPlan.map((item: any, i: number) => ({...item, id: `plan-${i}`})));
        setShowGenModal(false);
        setGoalsInput('');
    }
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6 relative">
      {/* Modal Overlay */}
      {showGenModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Sparkles className="text-indigo-600" size={20} />
                        Auto-Schedule
                    </h3>
                    <button onClick={() => setShowGenModal(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                <p className="text-sm text-gray-500 mb-4">Tell AI what you need to study today. Be specific about subjects and deadlines.</p>
                <textarea 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-32 focus:ring-2 focus:ring-indigo-500 outline-none resize-none mb-4"
                    placeholder="e.g., I need to study 2 hours of Organic Chemistry, finish my History essay, and review Spanish vocabulary."
                    value={goalsInput}
                    onChange={(e) => setGoalsInput(e.target.value)}
                />
                <button 
                    onClick={handleAutoGenerate}
                    disabled={isGenerating || !goalsInput.trim()}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {isGenerating ? <Loader2 className="animate-spin" size={20} /> : 'Generate Schedule'}
                </button>
            </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Study Plan</h1>
            <p className="text-gray-500">Today, {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
        </div>
        <button 
            onClick={() => setShowGenModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
            <Sparkles size={18} />
            <span>AI Auto-Schedule</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Schedule Column */}
        <div className="lg:col-span-2 space-y-4">
            {plan.length === 0 ? (
                <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                    No sessions scheduled. Click "AI Auto-Schedule" to begin.
                </div>
            ) : plan.map((item, index) => (
                <div key={item.id} className="group relative flex gap-4 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    {/* Time Column */}
                    <div className="w-16 flex flex-col items-end pt-3 text-sm text-gray-400 font-medium">
                        <span>{item.startTime}</span>
                    </div>

                    {/* Timeline Line */}
                    <div className="relative flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full mt-4 z-10 ${
                            item.type === 'break' ? 'bg-green-400 ring-4 ring-white' : 'bg-indigo-600 ring-4 ring-white'
                        }`} />
                        {index !== plan.length - 1 && (
                            <div className="absolute top-7 bottom-0 w-0.5 bg-gray-200 -mb-4" />
                        )}
                    </div>

                    {/* Card */}
                    <div className={`flex-1 p-4 rounded-xl border transition-all cursor-move ${
                        item.type === 'break' 
                            ? 'bg-green-50 border-green-100 text-green-900' 
                            : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md'
                    }`}>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <GripVertical className="text-gray-300 cursor-grab" size={20} />
                                <div>
                                    <h3 className="font-semibold">{item.title}</h3>
                                    <div className="flex items-center gap-2 text-xs opacity-70 mt-1">
                                        <Clock size={12} />
                                        <span>{item.startTime} - {item.endTime}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <MoreVertical size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
            <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl">
                <h3 className="font-bold text-lg mb-2">Daily Focus</h3>
                <p className="text-indigo-200 text-sm mb-4">Complete your high priority tasks early to free up your evening.</p>
                <div className="h-2 bg-indigo-800 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-2/3" />
                </div>
                <div className="mt-2 text-xs text-indigo-300 text-right">65% Complete</div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Suggestions</h3>
                <ul className="space-y-3">
                    <li className="flex gap-3 items-start text-sm text-gray-600">
                        <span className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
                        Take a 15m break after focused study blocks.
                    </li>
                    <li className="flex gap-3 items-start text-sm text-gray-600">
                        <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
                        Review your flashcards before bed for better retention.
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanPage;