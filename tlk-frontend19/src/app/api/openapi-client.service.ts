import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultResponse, StartResponse } from './api.models';

@Injectable({
  providedIn: 'root',
})
export class OpenApiClientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8181';

  start(file: File): Observable<StartResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<StartResponse>(`${this.baseUrl}/v1/start`, formData);
  }

  startPreview(file: File): Observable<StartResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<StartResponse>(`${this.baseUrl}/v1/start-preview`, formData);
  }

  continueProcess(id: string, payload: unknown): Observable<StartResponse> {
    return this.http.post<StartResponse>(`${this.baseUrl}/v1/continue/${id}`, payload);
  }

  getResult(id: string): Observable<ResultResponse> {
    return this.http.get<ResultResponse>(`${this.baseUrl}/v1/result/${id}`);
  }

  getPreview(id: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/v1/preview/${id}`, { responseType: 'blob' });
  }
}
