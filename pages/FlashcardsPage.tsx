import React, { useState } from 'react';
import { RotateCw, Check, X, ChevronLeft, ChevronRight, Plus, Sparkles, FileText, Loader2 } from 'lucide-react';
import { Flashcard } from '../types';
import { generateFlashcards, summarizeNotes } from '../services/geminiService';

const mockFlashcards: Flashcard[] = [
  { id: '1', front: 'What is the Second Law of Thermodynamics?', back: 'Entropy of an isolated system always increases.', difficulty: 'medium', nextReview: '2023-10-10' },
  { id: '2', front: 'Integral of 1/x', back: 'ln|x| + C', difficulty: 'easy', nextReview: '2023-10-10' },
  { id: '3', front: 'Capital of Australia', back: 'Canberra', difficulty: 'hard', nextReview: '2023-10-10' },
];

const FlashcardsPage: React.FC = () => {
  // Review State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState<Flashcard[]>(mockFlashcards);
  
  // Generator State
  const [inputTopic, setInputTopic] = useState('');
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState('');
  const [showTools, setShowTools] = useState(false);

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
        if (cards.length > 0) setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
        if (cards.length > 0) setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  const handleGenerateCards = async () => {
    if (!inputTopic && !inputText) return;
    setIsGenerating(true);
    const newCards = await generateFlashcards(inputTopic, inputText);
    
    if (newCards && newCards.length > 0) {
        // Map backend response to Flashcard type if needed, though schema matches well
        const formattedCards = newCards.map((c: any, i: number) => ({
            id: `gen-${Date.now()}-${i}`,
            front: c.front,
            back: c.back,
            difficulty: c.difficulty || 'medium',
            nextReview: new Date().toISOString()
        }));
        setCards(formattedCards);
        setCurrentIndex(0);
        setIsFlipped(false);
    }
    setIsGenerating(false);
  };

  const handleSummarize = async () => {
    if (!inputText) return;
    setIsSummarizing(true);
    const text = await summarizeNotes(inputText);
    setSummary(text);
    setIsSummarizing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Flashcard Review</h1>
        <button 
            onClick={() => setShowTools(!showTools)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showTools ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
        >
            <Sparkles size={18} />
            <span>{showTools ? 'Hide Tools' : 'AI Study Tools'}</span>
        </button>
      </div>

      {/* AI Tools Section */}
      {showTools && (
          <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm animate-fade-in grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Plus size={18} className="text-indigo-600" /> 
                    Generate Content
                </h3>
                <input 
                    type="text" 
                    placeholder="Topic (e.g. Biochemistry)" 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={inputTopic}
                    onChange={(e) => setInputTopic(e.target.value)}
                />
                <textarea 
                    placeholder="Paste your notes here to generate cards or a summary..." 
                    className="w-full p-3 h-32 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <div className="flex gap-3">
                    <button 
                        onClick={handleGenerateCards}
                        disabled={isGenerating || (!inputText && !inputTopic)}
                        className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        {isGenerating ? <Loader2 className="animate-spin" size={18} /> : 'Create Cards'}
                    </button>
                    <button 
                        onClick={handleSummarize}
                        disabled={isSummarizing || !inputText}
                        className="flex-1 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                         {isSummarizing ? <Loader2 className="animate-spin" size={18} /> : 'Summarize'}
                    </button>
                </div>
            </div>

            {/* Summary Output */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 h-full max-h-[400px] overflow-y-auto">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                    <FileText size={18} className="text-orange-500" /> 
                    Notes Summary
                </h3>
                {summary ? (
                    <div className="prose prose-sm text-gray-600 whitespace-pre-wrap">
                        {summary}
                    </div>
                ) : (
                    <div className="h-32 flex items-center justify-center text-gray-400 text-sm italic">
                        Summary will appear here...
                    </div>
                )}
            </div>
          </div>
      )}

      {/* Flashcard Deck */}
      {cards.length > 0 ? (
        <>
            <div className="relative h-96 w-full max-w-2xl mx-auto perspective-1000 group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                <div className={`relative w-full h-full text-center transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`} style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden bg-white border border-gray-200 rounded-3xl shadow-sm flex flex-col items-center justify-center p-12">
                    <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-4">Question</span>
                    <p className="text-2xl font-medium text-gray-800">{currentCard.front}</p>
                    <p className="absolute bottom-6 text-gray-400 text-sm">Click to flip</p>
                </div>

                {/* Back */}
                <div className="absolute w-full h-full backface-hidden bg-indigo-600 text-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-12" style={{ transform: 'rotateY(180deg)' }}>
                    <span className="text-sm font-semibold text-indigo-200 uppercase tracking-wide mb-4">Answer</span>
                    <p className="text-2xl font-medium">{currentCard.back}</p>
                </div>

                </div>
            </div>

            <div className="flex items-center justify-center gap-8">
                <button onClick={handlePrev} className="p-4 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
                    <ChevronLeft size={24} />
                </button>

                <div className="flex gap-4">
                    <button onClick={handleNext} className="flex flex-col items-center gap-1 p-4 w-24 rounded-2xl bg-red-50 border border-red-100 hover:bg-red-100 transition-colors group">
                        <X className="text-red-500 group-hover:scale-110 transition-transform" />
                        <span className="text-xs text-red-600 font-medium">Hard</span>
                    </button>
                    <button onClick={handleNext} className="flex flex-col items-center gap-1 p-4 w-24 rounded-2xl bg-green-50 border border-green-100 hover:bg-green-100 transition-colors group">
                        <Check className="text-green-500 group-hover:scale-110 transition-transform" />
                        <span className="text-xs text-green-600 font-medium">Easy</span>
                    </button>
                </div>

                <button onClick={handleNext} className="p-4 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
                    <ChevronRight size={24} />
                </button>
            </div>

            <div className="text-center text-gray-400 text-sm">
                Card {currentIndex + 1} of {cards.length}
            </div>
        </>
      ) : (
          <div className="text-center py-20 text-gray-500 bg-white rounded-3xl border border-dashed border-gray-200">
              <p>No flashcards loaded.</p>
              <button onClick={() => setShowTools(true)} className="text-indigo-600 font-medium mt-2">Generate some!</button>
          </div>
      )}
    </div>
  );
};

export default FlashcardsPage;