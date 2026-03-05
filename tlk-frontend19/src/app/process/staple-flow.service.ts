import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../api/api/api.service';
import { PageExtractResponse, PageInfo, VorgangWorkflowStatusResponse } from '../api/model/models';

type WorkflowPageResult = {
  pageId: string;
  pageNo: number;
  status: string;
  errorMessage: string;
  markdown: string;
  doclingJson: string;
  extractLoaded: boolean;
};

type StapleFlowState = {
  uploadCompleted: boolean;
  processingCompleted: boolean;
  caseNumber: string;
  capturedAt: string;
  insuranceNumber: string;
  vorgangId: string;
  stapelId: string;
  workflowStatus: string;
  pagesTotal: number;
  pagesDone: number;
  pagesFailed: number;
  llmTriggered: boolean;
  pages: WorkflowPageResult[];
};

export type WorkflowPageDisplay = WorkflowPageResult & {
  hasExtract: boolean;
};

const DEFAULT_STATE: StapleFlowState = {
  uploadCompleted: false,
  processingCompleted: false,
  caseNumber: '',
  capturedAt: '',
  insuranceNumber: '',
  vorgangId: '',
  stapelId: '',
  workflowStatus: '',
  pagesTotal: 0,
  pagesDone: 0,
  pagesFailed: 0,
  llmTriggered: false,
  pages: [],
};

const STORAGE_KEY = 'staple_flow_state';

@Injectable({ providedIn: 'root' })
export class StapleFlowService {
  private readonly apiClient = inject(ApiService);
  private state: StapleFlowState = this.loadState();

  startFlow(): void {
    this.state = { ...DEFAULT_STATE };
    this.persistState();
  }

  resetFlow(): void {
    this.state = { ...DEFAULT_STATE };
    this.persistState();
  }

  async startServerProcessing(files: File[], insuranceNumber: string): Promise<void> {
    if (files.length === 0) {
      throw new Error('Es wurde keine Datei ausgewählt.');
    }

    const file = files[0];
    const now = new Date();
    const trimmedInsuranceNumber = insuranceNumber.trim();
    const stapelName = trimmedInsuranceNumber ? `VSNR-${trimmedInsuranceNumber}` : file.name;
    const createResponse = await firstValueFrom(
      this.apiClient.createVorgangWithUpload(trimmedInsuranceNumber, file, true, stapelName),
    );

    this.state.uploadCompleted = true;
    this.state.processingCompleted = false;
    this.state.caseNumber = this.generateCaseNumber(now);
    this.state.capturedAt = this.formatDate(now);
    this.state.insuranceNumber = trimmedInsuranceNumber;
    this.state.vorgangId = createResponse.vorgangId;
    this.state.stapelId = createResponse.stapelId;
    this.state.workflowStatus = '';
    this.state.pagesTotal = 0;
    this.state.pagesDone = 0;
    this.state.pagesFailed = 0;
    this.state.llmTriggered = false;
    this.state.pages = [];
    this.persistState();
  }

  async refreshResults(): Promise<void> {
    if (!this.state.vorgangId || !this.state.stapelId) {
      return;
    }

    const workflow = await firstValueFrom(this.apiClient.getVorgangWorkflowStatus(this.state.vorgangId));
    const pages = await firstValueFrom(this.apiClient.getDokumentenstapelPages(this.state.stapelId));
    const sortedPages = [...pages].sort((a, b) => a.pageNo - b.pageNo);

    const pagesWithExtracts = await Promise.all(
      sortedPages.map((page) => this.loadPageResult(page)),
    );

    this.state.workflowStatus = workflow.status;
    this.state.pagesTotal = workflow.pagesTotal;
    this.state.pagesDone = workflow.pagesDone;
    this.state.pagesFailed = workflow.pagesFailed;
    this.state.pages = pagesWithExtracts;
    this.state.processingCompleted = this.isWorkflowCompleted(workflow, pagesWithExtracts);
    this.persistState();
  }

  async triggerLlmProcessing(): Promise<void> {
    if (!this.state.stapelId) {
      throw new Error('Es ist kein Dokumentenstapel vorhanden.');
    }

    await firstValueFrom(this.apiClient.triggerDokumentenstapelStep1(this.state.stapelId));
    this.state.llmTriggered = true;
    this.persistState();
  }

  canEnterProcess(): boolean {
    return this.state.uploadCompleted;
  }

  canEnterSummary(): boolean {
    return this.state.uploadCompleted && this.state.processingCompleted;
  }

  canTriggerLlmProcessing(): boolean {
    return this.state.uploadCompleted && Boolean(this.state.stapelId);
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

  getInsuranceNumber(): string {
    return this.state.insuranceNumber;
  }

  getWorkflowStatus(): string {
    return this.state.workflowStatus || 'WARTET_AUF_ERGEBNISSE';
  }

  getWorkflowProgressPercent(): number {
    if (this.state.pagesTotal <= 0) {
      return 0;
    }
    return Math.round((this.state.pagesDone / this.state.pagesTotal) * 100);
  }

  getPageResults(): WorkflowPageDisplay[] {
    return this.state.pages.map((page) => ({
      ...page,
      hasExtract: Boolean(page.markdown || page.doclingJson),
    }));
  }

  getSummaryRows(): string[][] {
    const pageResults = this.getPageResults();
    const extractedCount = pageResults.filter((page) => page.hasExtract).length;
    const errorCount = pageResults.filter((page) => Boolean(page.errorMessage)).length;

    return [
      ['Dokumentenupload', this.state.uploadCompleted ? 'Abgeschlossen' : 'Offen', this.state.vorgangId || 'Noch kein Vorgang angelegt'],
      ['Workflow-Status', this.getWorkflowStatus(), `Fortschritt: ${this.getWorkflowProgressPercent()} %`],
      ['Seiten verarbeitet', `${this.state.pagesDone}/${this.state.pagesTotal}`, `${this.state.pagesFailed} fehlgeschlagen`],
      ['Extrakte geladen', `${extractedCount}/${pageResults.length}`, extractedCount > 0 ? 'Prüfungsergebnisse verfügbar' : 'Noch keine Extrakte'],
      ['LLM-Verarbeitung', this.state.llmTriggered ? 'Gestartet' : 'Nicht gestartet', this.state.stapelId || 'Keine Stapel-ID'],
      ['Fehler', `${errorCount}`, errorCount > 0 ? 'Einzelne Seiten konnten nicht extrahiert werden' : 'Keine Fehler gemeldet'],
    ];
  }

  private async loadPageResult(page: PageInfo): Promise<WorkflowPageResult> {
    if (!this.shouldLoadExtract(page.status)) {
      return {
        pageId: page.pageId,
        pageNo: page.pageNo,
        status: page.status,
        errorMessage: this.readNullableString(page.errorMessage),
        markdown: '',
        doclingJson: '',
        extractLoaded: false,
      };
    }

    try {
      const extract = await firstValueFrom(this.apiClient.getPageExtract(page.pageId));
      return {
        pageId: page.pageId,
        pageNo: page.pageNo,
        status: page.status,
        errorMessage: this.readNullableString(page.errorMessage),
        markdown: extract.markdown,
        doclingJson: this.stringifyDoclingJson(extract),
        extractLoaded: true,
      };
    } catch {
      return {
        pageId: page.pageId,
        pageNo: page.pageNo,
        status: page.status,
        errorMessage: this.readNullableString(page.errorMessage) || 'Extrakt konnte noch nicht geladen werden.',
        markdown: '',
        doclingJson: '',
        extractLoaded: false,
      };
    }
  }

  private shouldLoadExtract(status: string): boolean {
    const normalized = status.toUpperCase();
    return normalized.includes('DONE')
      || normalized.includes('EXTRACT')
      || normalized.includes('READY')
      || normalized.includes('SUCCESS');
  }

  private stringifyDoclingJson(extract: PageExtractResponse): string {
    try {
      return JSON.stringify(extract.doclingJson, null, 2);
    } catch {
      return '';
    }
  }

  private readNullableString(value: unknown): string {
    if (!value) {
      return '';
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'object') {
      const record = value as Record<string, unknown>;
      const possibleValue = record['value'];
      if (typeof possibleValue === 'string') {
        return possibleValue;
      }
    }

    return '';
  }

  private isWorkflowCompleted(workflow: VorgangWorkflowStatusResponse, pages: WorkflowPageResult[]): boolean {
    if (workflow.pagesTotal > 0 && workflow.pagesDone + workflow.pagesFailed >= workflow.pagesTotal) {
      return true;
    }

    const normalizedWorkflowStatus = workflow.status.toUpperCase();
    if (
      normalizedWorkflowStatus.includes('DONE')
      || normalizedWorkflowStatus.includes('COMPLETED')
      || normalizedWorkflowStatus.includes('FINISHED')
      || normalizedWorkflowStatus.includes('SUCCESS')
    ) {
      return true;
    }

    return pages.length > 0
      && pages.every((page) => page.extractLoaded || Boolean(page.errorMessage));
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
        insuranceNumber: parsed.insuranceNumber ?? '',
        vorgangId: parsed.vorgangId ?? '',
        stapelId: parsed.stapelId ?? '',
        workflowStatus: parsed.workflowStatus ?? '',
        pagesTotal: Number(parsed.pagesTotal ?? 0),
        pagesDone: Number(parsed.pagesDone ?? 0),
        pagesFailed: Number(parsed.pagesFailed ?? 0),
        llmTriggered: Boolean(parsed.llmTriggered),
        pages: Array.isArray(parsed.pages) ? parsed.pages : [],
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
}
