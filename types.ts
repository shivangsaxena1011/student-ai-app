export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  subject: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  nextReview: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
  attachments?: FileAttachment[];
}

export interface FileAttachment {
  name: string;
  mimeType: string;
  data: string; // Base64
}

export interface StudySession {
  subject: string;
  durationMinutes: number;
  date: string;
}

export interface StudyPlanItem {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: 'study' | 'break' | 'review';
}
