import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { OpenApiClientService } from '../api/openapi-client.service';
import { ProcessProgress, ResultResponse, SubDocument } from '../api/api.models';

type ProcessJobState = 'running' | 'completed' | 'error';

type ProcessJob = {
  processId: string;
  previewId?: string;
  fileName: string;
  progress: number;
  status: ProcessJobState;
  errorMessage?: string;
  previewDataUrl?: string;
  result?: ResultResponse;
};

type StapleFlowState = {
  uploadCompleted: boolean;
  processingCompleted: boolean;
  caseNumber: string;
  capturedAt: string;
  jobs: ProcessJob[];
};

export type KeyValueField = {
  key: string;
  value: string;
};

export type DisplayDocument = {
  id: string;
  title: string;
  summary: string;
  capturedAt: string;
  status: 'Neu' | 'Geprüft';
  previewDataUrl: string;
  documentExtractFields: KeyValueField[];
  insuredMasterDataFields: KeyValueField[];
};

const DEFAULT_STATE: StapleFlowState = {
  uploadCompleted: false,
  processingCompleted: false,
  caseNumber: '',
  capturedAt: '',
  jobs: [],
};

const STORAGE_KEY = 'staple_flow_state';

@Injectable({ providedIn: 'root' })
export class StapleFlowService {
  private readonly apiClient = inject(OpenApiClientService);
  private state: StapleFlowState = this.loadState();

  startFlow(): void {
    this.state = { ...DEFAULT_STATE };
    this.persistState();
  }

  resetFlow(): void {
    this.state = { ...DEFAULT_STATE };
    this.persistState();
  }

  async startServerProcessing(files: File[]): Promise<void> {
    if (files.length === 0) {
      throw new Error('Es wurde keine Datei ausgewählt.');
    }

    const processStarts = await Promise.all(
      files.map(async (file) => {
        const [startResponse, previewStartResponse] = await Promise.all([
          firstValueFrom(this.apiClient.start(file)),
          firstValueFrom(this.apiClient.startPreview(file)),
        ]);
        return {
          processId: startResponse.id,
          previewId: previewStartResponse.id,
          fileName: file.name,
          progress: 0,
          status: 'running' as ProcessJobState,
        };
      }),
    );

    const now = new Date();
    this.state.uploadCompleted = true;
    this.state.processingCompleted = false;
    this.state.jobs = processStarts;
    this.state.caseNumber = this.generateCaseNumber(now);
    this.state.capturedAt = this.formatDate(now);
    this.persistState();
  }

  async refreshResults(): Promise<void> {
    if (this.state.jobs.length === 0) {
      return;
    }

    const updates = await Promise.all(
      this.state.jobs.map(async (job) => {
        if (job.status === 'completed') {
          if (!job.previewDataUrl && job.previewId) {
            const previewDataUrl = await this.tryLoadPreview(job.previewId);
            if (previewDataUrl) {
              return { ...job, previewDataUrl };
            }
          }
          return job;
        }

        try {
          const response = await firstValueFrom(this.apiClient.getResult(job.processId));
          if (response.status === 202) {
            const progressBody = response.body as ProcessProgress;
            return {
              ...job,
              status: 'running' as ProcessJobState,
              progress: Math.max(0, Math.min(100, Number(progressBody.progress ?? 0))),
            };
          }

          if (response.status === 200) {
            const resultBody = response.body as ResultResponse;
            const previewDataUrl = job.previewId ? await this.tryLoadPreview(job.previewId) : undefined;
            return {
              ...job,
              status: 'completed' as ProcessJobState,
              progress: 100,
              previewDataUrl,
              result: resultBody,
            };
          }

          return {
            ...job,
            status: 'error' as ProcessJobState,
            errorMessage: `Unerwarteter HTTP-Status: ${response.status}`,
          };
        } catch {
          return {
            ...job,
            status: 'error' as ProcessJobState,
            errorMessage: 'Ergebnis konnte nicht geladen werden.',
          };
        }
      }),
    );

    this.state.jobs = updates;
    this.state.processingCompleted = updates.length > 0 && updates.every((job) => job.status === 'completed');
    this.persistState();
  }

  async continueProcessing(): Promise<void> {
    const processIds = this.state.jobs.map((job) => job.processId);
    await Promise.all(processIds.map((id) => firstValueFrom(this.apiClient.continueProcess(id))));
  }

  canEnterProcess(): boolean {
    return this.state.uploadCompleted;
  }

  canEnterSummary(): boolean {
    return this.state.uploadCompleted && this.state.processingCompleted;
  }

  hasCompletedUpload(): boolean {
    return this.state.uploadCompleted;
  }

  getCaseNumber(): string {
    return this.state.caseNumber || 'VS-UNBEKANNT';
  }

  getCapturedAt(): string {
    return this.state.capturedAt || this.formatDate(new Date());
  }

  getJobs(): ReadonlyArray<ProcessJob> {
    return this.state.jobs;
  }

  getAverageProgress(): number {
    if (this.state.jobs.length === 0) {
      return 0;
    }

    const total = this.state.jobs.reduce((sum, job) => sum + job.progress, 0);
    return Math.round(total / this.state.jobs.length);
  }

  getDisplayDocuments(): DisplayDocument[] {
    const documents: DisplayDocument[] = [];

    for (const job of this.state.jobs) {
      const result = job.result;
      if (!result) {
        continue;
      }

      const subDocuments = result.documents;
      if (subDocuments.length === 0) {
        documents.push(
          this.toDisplayDocument({
            processId: job.processId,
            documentIndex: 0,
            subDocument: undefined,
            result,
            jobStatus: job.status,
            jobPreviewDataUrl: job.previewDataUrl,
          }),
        );
        continue;
      }

      subDocuments.forEach((subDocument, index) => {
        documents.push(
          this.toDisplayDocument({
            processId: job.processId,
            documentIndex: index,
            subDocument,
            result,
            jobStatus: job.status,
            jobPreviewDataUrl: job.previewDataUrl,
          }),
        );
      });
    }

    return documents;
  }

  getSummaryRows(): string[][] {
    const jobs = this.state.jobs;
    const completedCount = jobs.filter((job) => job.status === 'completed').length;
    const errorCount = jobs.filter((job) => job.status === 'error').length;
    const documentCount = this.getDisplayDocuments().length;

    return [
      ['Dokumentenupload', `${jobs.length} Datei(en)`, jobs.length > 0 ? 'Upload an API gestartet' : 'Kein Upload vorhanden'],
      ['Prüfung', `${this.getAverageProgress()} %`, this.state.processingCompleted ? 'Abgeschlossen' : 'Läuft oder ausstehend'],
      ['Ergebnisse', `${documentCount} Dokument(e)`, documentCount > 0 ? 'Extrahierte Daten verfügbar' : 'Noch keine Daten'],
      ['Fehler', `${errorCount}`, errorCount > 0 ? 'Bitte API-Protokoll prüfen' : 'Keine Fehler gemeldet'],
      ['Abgeschlossene Vorgänge', `${completedCount}/${jobs.length || 0}`, 'Status je Dokumentenstapel'],
    ];
  }

  private toDisplayDocument(args: {
    processId: string;
    documentIndex: number;
    subDocument?: SubDocument;
    result: ResultResponse;
    jobStatus: ProcessJobState;
    jobPreviewDataUrl?: string;
  }): DisplayDocument {
    const { processId, documentIndex, subDocument, result, jobStatus, jobPreviewDataUrl } = args;
    const additionalFields = this.toKeyValueFields(subDocument?.additionalFields);
    const category = subDocument?.category ?? 'SONSTIGE';
    const title = this.translateCategory(category);
    const summary = subDocument?.summary ?? result.summary ?? 'Keine Zusammenfassung vorhanden.';
    const previewDataUrl =
      this.toPdfDataUrl(subDocument?.documentData) || jobPreviewDataUrl || this.findPreviewDataUrl(result) || '';

    return {
      id: `${processId}-${documentIndex + 1}`,
      title,
      summary,
      capturedAt: this.getCapturedAt(),
      status: jobStatus === 'completed' ? 'Geprüft' : 'Neu',
      previewDataUrl,
      documentExtractFields: [
        { key: 'Titel', value: title },
        { key: 'Kategorie', value: category },
        { key: 'Zusammenfassung', value: summary },
        { key: 'Datum der Erfassung', value: this.getCapturedAt() },
        { key: 'Dokument-ID', value: `${processId}-${documentIndex + 1}` },
        ...additionalFields,
      ],
      insuredMasterDataFields: [
        { key: 'Versicherungsnummer', value: String(subDocument?.vsnr ?? result.vsnr ?? '') },
        { key: 'Versicherungsnummer verstorbener Versicherter', value: '' },
        { key: 'Familienname', value: subDocument?.surname ?? result.surname ?? '' },
        { key: 'Vorname', value: subDocument?.firstName ?? result.firstName ?? '' },
        { key: 'Geburtsname', value: '' },
        { key: 'Geburtsort', value: '' },
        { key: 'Geburtsland', value: '' },
        { key: 'Staatsangehörigkeit', value: '' },
        { key: 'Sterbedatum', value: '' },
        { key: 'Anschrift', value: '' },
        { key: 'Betriebsnummer des Arbeitgebers', value: '' },
        { key: 'Tag der Beschäftigungsaufnahme', value: this.formatOptionalDate(subDocument?.birthDate ?? result.birthDate) },
      ],
    };
  }

  private toPdfDataUrl(base64Pdf?: string): string {
    if (!base64Pdf) {
      return '';
    }
    return `data:application/pdf;base64,${base64Pdf}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`;
  }

  private findPreviewDataUrl(result: ResultResponse): string {
    const fromDocuments = result.documents
      .map((document) => this.toPdfDataUrl(document.documentData))
      .find((value) => Boolean(value));
    return fromDocuments ?? '';
  }

  private async tryLoadPreview(previewId: string): Promise<string | undefined> {
    try {
      const previewResponse = await firstValueFrom(this.apiClient.getPreview(previewId));
      const base64Value = this.findBase64Pdf(previewResponse);
      if (!base64Value) {
        return undefined;
      }
      return this.toPdfDataUrl(base64Value) || undefined;
    } catch {
      return undefined;
    }
  }

  private findBase64Pdf(value: unknown): string | undefined {
    if (typeof value === 'string') {
      const normalized = value.trim();
      if (normalized.length > 50 && !normalized.startsWith('{') && !normalized.startsWith('[')) {
        return normalized;
      }
      return undefined;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        const nested = this.findBase64Pdf(item);
        if (nested) {
          return nested;
        }
      }
      return undefined;
    }

    if (value && typeof value === 'object') {
      const map = value as Record<string, unknown>;
      const directKeys = ['documentData', 'pdf', 'preview', 'data', 'content'];
      for (const key of directKeys) {
        const candidate = this.findBase64Pdf(map[key]);
        if (candidate) {
          return candidate;
        }
      }
      for (const nestedValue of Object.values(map)) {
        const nested = this.findBase64Pdf(nestedValue);
        if (nested) {
          return nested;
        }
      }
    }

    return undefined;
  }

  private toKeyValueFields(values?: Record<string, unknown>): KeyValueField[] {
    if (!values) {
      return [];
    }

    return Object.entries(values).map(([key, value]) => ({
      key: this.toGermanLabel(key),
      value: String(value ?? ''),
    }));
  }

  private toGermanLabel(key: string): string {
    const mapping: Record<string, string> = {
      customerNumber: 'Kundennummer',
      caseNumber: 'Aktenzeichen',
      dateOfReceipt: 'Eingangsdatum',
    };
    return mapping[key] ?? key;
  }

  private translateCategory(category: string): string {
    const categories: Record<string, string> = {
      AUSWEIS: 'Ausweis',
      GEBURTSURKUNDE: 'Geburtsurkunde',
      STERBEURKUNDE: 'Sterbeurkunde',
      ZEUGNIS: 'Zeugnis',
      STEUERBESCHEID: 'Steuerbescheid',
      KRANKENKASSENBESCHEINIGUNG: 'Krankenkassenbescheinigung',
      SONSTIGE: 'Sonstige Unterlagen',
    };
    return categories[category] ?? 'Dokument';
  }

  private loadState(): StapleFlowState {
    if (typeof window === 'undefined') {
      return { ...DEFAULT_STATE };
    }

    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_STATE };
    }

    try {
      const parsed = JSON.parse(raw) as Partial<StapleFlowState>;
      return {
        uploadCompleted: Boolean(parsed.uploadCompleted),
        processingCompleted: Boolean(parsed.processingCompleted),
        caseNumber: parsed.caseNumber ?? '',
        capturedAt: parsed.capturedAt ?? '',
        jobs: Array.isArray(parsed.jobs) ? parsed.jobs : [],
      };
    } catch {
      return { ...DEFAULT_STATE };
    }
  }

  private persistState(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  private generateCaseNumber(date: Date): string {
    const year = date.getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    return `VS-${year}-${random}`;
  }

  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('de-DE').format(date);
  }

  private formatOptionalDate(raw?: string): string {
    if (!raw) {
      return '';
    }

    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) {
      return raw;
    }
    return this.formatDate(parsed);
  }
}
