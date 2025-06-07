export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  messages: Message[];
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIResponse {
  text: string;
  isError: boolean;
  actions?: AIAction[];
}

export interface AIAction {
  type: 'NAVIGATE' | 'ADD_PET' | 'SCHEDULE_APPOINTMENT' | 'SHOW_PET_INFO' | 'SHOW_REMINDER';
  payload: any;
}

export interface AIConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export interface PetInfo {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  lastCheckup?: Date;
  medicalHistory?: MedicalRecord[];
  medications?: Medication[];
  dietaryNeeds?: string;
  allergies?: string[];
  owner: string;
}

export interface MedicalRecord {
  id: string;
  date: Date;
  description: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  vetId: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  notes?: string;
}

export interface SpeechConfig {
  voice: string;
  rate: number;
  pitch: number;
}

export type AIProcessingStatus = 'idle' | 'processing' | 'speaking' | 'listening' | 'error'; 