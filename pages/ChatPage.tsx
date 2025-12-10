import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, Image as ImageIcon, Bot, User, StopCircle } from 'lucide-react';
import { createChatSession, sendMessageStream } from '../services/geminiService';
import { Message, FileAttachment } from '../types';

const ChatPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi there! I'm your AI study coach. Upload your notes or ask me anything to get started! 🚀",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  
  // Refs
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatSessionRef = useRef<any>(null); // Keep chat session persistent

  useEffect(() => {
    // Initialize chat session on mount
    chatSessionRef.current = createChatSession();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setAttachments(prev => [...prev, {
            name: file.name,
            mimeType: file.type,
            data: event.target?.result as string
          }]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    const userMsgId = Date.now().toString();
    const newUserMsg: Message = {
      id: userMsgId,
      role: 'user',
      text: input,
      timestamp: new Date(),
      attachments: [...attachments]
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setAttachments([]);
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
        chatSessionRef.current = createChatSession();
      }

      // Create a placeholder for the bot response
      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        text: '',
        timestamp: new Date(),
        isStreaming: true
      }]);

      const stream = await sendMessageStream(
        chatSessionRef.current, 
        newUserMsg.text, 
        newUserMsg.attachments
      );
      
      let fullText = '';
      
      for await (const chunk of stream) {
        // Correct way to access text from chunk (property, not method)
        const chunkText = chunk.text || ''; 
        fullText += chunkText;
        
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId 
            ? { ...msg, text: fullText }
            : msg
        ));
      }

      setMessages(prev => prev.map(msg => 
        msg.id === botMsgId 
          ? { ...msg, isStreaming: false }
          : msg
      ));

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Sorry, I encountered an error connecting to the brain. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">AI Study Coach</h2>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([])} // Simple clear
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          Clear Chat
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
              msg.role === 'user' ? 'bg-gray-800 text-white' : 'bg-indigo-600 text-white'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[80%] space-y-2`}>
              <div className={`p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-gray-900 text-white rounded-tr-sm' 
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm'
              }`}>
                {/* Attachments Preview */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {msg.attachments.map((att, idx) => (
                      <div key={idx} className="relative group">
                         {att.mimeType.startsWith('image/') ? (
                           <img src={att.data} alt={att.name} className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
                         ) : (
                           <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-xs text-center p-2">
                             {att.name}
                           </div>
                         )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Text Content - Simple formatting for breaks */}
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {msg.text || (msg.isStreaming && <span className="animate-pulse">Thinking...</span>)}
                </div>
              </div>

              {/* Action Buttons for AI Responses */}
              {msg.role === 'model' && !msg.isStreaming && msg.text.length > 50 && (
                <div className="flex gap-2">
                   <button className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 text-gray-600 transition-colors">
                     Create Flashcards
                   </button>
                   <button className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 text-gray-600 transition-colors">
                     Add to Study Plan
                   </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        {attachments.length > 0 && (
             <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                {attachments.map((att, i) => (
                    <div key={i} className="relative inline-block">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center overflow-hidden">
                            {att.mimeType.startsWith('image/') 
                                ? <img src={att.data} className="w-full h-full object-cover" />
                                : <span className="text-[10px] break-all p-1">{att.name}</span>
                            }
                        </div>
                        <button 
                            onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                        >
                            <StopCircle size={10} />
                        </button>
                    </div>
                ))}
            </div>
        )}
        
        <div className="flex gap-2">
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                title="Upload Image/File"
            >
                <Paperclip size={20} />
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileSelect}
                accept="image/*,application/pdf"
            />
            
            <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your notes or study plan..."
                className="flex-1 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-3 outline-none transition-all"
                disabled={isLoading}
            />
            
            <button 
                onClick={handleSend}
                disabled={isLoading || (!input.trim() && attachments.length === 0)}
                className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                    isLoading || (!input.trim() && attachments.length === 0)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                }`}
            >
                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={20} />}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;