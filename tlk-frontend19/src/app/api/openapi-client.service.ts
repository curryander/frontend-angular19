import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ProcessProgress, ResultResponse, StartResponse } from './api.models';

@Injectable({
  providedIn: 'root',
})
export class OpenApiClientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8181';

  start(file: File): Observable<StartResponse> {
    return this.http.post<StartResponse>(`${this.baseUrl}/v1/start`, file, {
      headers: { 'Content-Type': 'application/pdf' },
    });
  }

  startPreview(file: File): Observable<StartResponse> {
    return this.http.post<StartResponse>(`${this.baseUrl}/v1/start-preview`, file, {
      headers: { 'Content-Type': 'application/pdf' },
    });
  }

  continueProcess(id: string): Observable<Record<string, unknown>> {
    return this.http.post<Record<string, unknown>>(`${this.baseUrl}/v1/continue/${id}`, {});
  }

  getResult(id: string): Observable<HttpResponse<ProcessProgress | ResultResponse>> {
    return this.http.get<ProcessProgress | ResultResponse>(`${this.baseUrl}/v1/result/${id}`, {
      observe: 'response',
    });
  }

  getPreview(id: string): Observable<Record<string, unknown>> {
    return this.http.get<Record<string, unknown>>(`${this.baseUrl}/v1/preview/${id}`);
  }
}
