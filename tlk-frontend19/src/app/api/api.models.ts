export interface StartResponse {
  id: string;
}

export interface ProcessProgress {
  progress: number;
}

export interface SubDocument {
  documentData: string;
  category: string;
  firstName?: string;
  surname?: string;
  vsnr?: string;
  birthDate?: string;
  summary?: string;
  additionalFields?: Record<string, unknown>;
}

export interface ResultResponse {
  id: string;
  firstName?: string;
  surname?: string;
  summary?: string;
  vsnr?: string;
  birthDate?: string;
  documents: SubDocument[];
}

export interface ApiError {
  code: 'BAD_REQUEST' | 'NOT_FOUND' | 'SERVER_ERROR';
  message: string;
}
