import React, { useState } from 'react';
import { UploadCloud, FileText, X, Check } from 'lucide-react';

const UploadPage: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    setUploading(true);
    // Simulate upload
    setTimeout(() => {
        setUploading(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        setFiles([]);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Lecture Notes</h1>
      <p className="text-gray-500 mb-8">Supported formats: PDF, DOCX, JPG, PNG (Max 50MB)</p>

      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all ${
            isDragging 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-6">
            <UploadCloud className="text-indigo-600" size={32} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Drag & drop files here</h3>
        <p className="text-gray-500 mb-6">or</p>
        <label className="inline-block">
            <input type="file" multiple className="hidden" onChange={handleFileInput} accept=".pdf,.docx,.jpg,.png" />
            <span className="px-6 py-3 bg-indigo-600 text-white rounded-xl cursor-pointer hover:bg-indigo-700 transition-colors font-medium">
                Browse Files
            </span>
        </label>
      </div>

      {files.length > 0 && (
          <div className="mt-8 space-y-3">
            {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                            <FileText size={20} />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))}
                        className="text-gray-400 hover:text-red-500"
                    >
                        <X size={20} />
                    </button>
                </div>
            ))}

            <button 
                onClick={handleUpload}
                disabled={uploading}
                className={`w-full py-4 mt-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                    uploading ? 'bg-indigo-400' : success ? 'bg-green-500' : 'bg-gray-900 hover:bg-gray-800'
                }`}
            >
                {uploading ? (
                    <>Processing...</>
                ) : success ? (
                    <><Check /> Uploaded Successfully!</>
                ) : (
                    <>Process Files with AI</>
                )}
            </button>
          </div>
      )}
    </div>
  );
};

export default UploadPage;