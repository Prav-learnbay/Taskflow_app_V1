export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  department: string;
  services: string[];
  zone: string;
  siteName: string;
  taskOwner: string;
  city: string;
  notes: TaskNote[];
  attachments: TaskAttachment[];
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface TaskNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
}

