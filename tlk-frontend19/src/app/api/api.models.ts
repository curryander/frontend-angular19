export interface StartResponse {
  id?: string;
  message?: string;
  [key: string]: unknown;
}

export interface ProcessProgress {
  status?: string;
  progress?: number;
  [key: string]: unknown;
}

export interface SubDocument {
  id?: string;
  title?: string;
  [key: string]: unknown;
}

export interface ResultResponse {
  id?: string;
  progress?: ProcessProgress;
  documents?: SubDocument[];
  extractedData?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ApiError {
  message?: string;
  [key: string]: unknown;
}
