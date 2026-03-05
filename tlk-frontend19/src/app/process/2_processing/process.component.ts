import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  ApplicationHeaderComponent,
  ButtonComponent,
  ButtonbarComponent,
  ColDirective,
  GridDirective,
  ProgressnavComponent,
  ProgressnavNodeComponent,
  RowDirective,
  StatusComponent,
} from '@drv-ds/drv-design-system-ng';
import { DisplayDocument, KeyValueField, StapleFlowService } from '../staple-flow.service';

@Component({
  selector: 'app-process',
  imports: [
    ApplicationHeaderComponent,
    ButtonComponent,
    ButtonbarComponent,
    ColDirective,
    FormsModule,
    GridDirective,
    ProgressnavComponent,
    ProgressnavNodeComponent,
    RowDirective,
    StatusComponent,
  ],
  templateUrl: './process.component.html',
  standalone: true,
  styleUrl: './process.component.scss',
})
export class ProcessComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly flowService = inject(StapleFlowService);
  private readonly sanitizer = inject(DomSanitizer);
  private pollHandle: ReturnType<typeof setInterval> | null = null;

  documents: DisplayDocument[] = [];
  selectedDocumentIndex = 0;
  isRefreshing = false;
  apiError = '';
  continueError = '';

  get headerTitle(): string {
    return `Prüfung · Vorgang ${this.flowService.getCaseNumber()} · Erfasst am ${this.flowService.getCapturedAt()}`;
  }

  get selectedDocument(): DisplayDocument | null {
    return this.documents[this.selectedDocumentIndex] ?? null;
  }

  get selectedDocumentPreviewUrl(): SafeResourceUrl | null {
    const selected = this.selectedDocument;
    if (!selected?.previewDataUrl) {
      return null;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(selected.previewDataUrl);
  }

  get selectedDocumentExtractFields(): KeyValueField[] {
    return this.selectedDocument?.documentExtractFields ?? [];
  }

  get selectedInsuredMasterDataFields(): KeyValueField[] {
    return this.selectedDocument?.insuredMasterDataFields ?? [];
  }

  get hasDocuments(): boolean {
    return this.documents.length > 0;
  }

  get progressText(): string {
    const jobs = this.flowService.getJobs();
    if (jobs.length === 0) {
      return 'Noch keine Verarbeitung gestartet.';
    }

    if (this.flowService.canEnterSummary()) {
      return 'Verarbeitung abgeschlossen. Die Ergebnisse sind verfügbar.';
    }

    return `Verarbeitung läuft: ${this.flowService.getAverageProgress()} %`;
  }

  get canGoToSummary(): boolean {
    return this.flowService.canEnterSummary();
  }

  async ngOnInit(): Promise<void> {
    await this.refreshProcessState();
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  selectDocument(index: number): void {
    this.selectedDocumentIndex = index;
  }

  cancelFlow(): void {
    this.flowService.resetFlow();
    void this.router.navigate(['/staples']);
  }

  backToUpload(): void {
    void this.router.navigate(['/upload']);
  }

  async goToSummary(): Promise<void> {
    this.continueError = '';
    if (!this.canGoToSummary) {
      this.continueError = 'Die Verarbeitung ist noch nicht abgeschlossen.';
      return;
    }

    try {
      await this.flowService.continueProcessing();
      void this.router.navigate(['/summary']);
    } catch {
      this.continueError = 'Weiterverarbeitung durch den Server fehlgeschlagen.';
    }
  }

  private startPolling(): void {
    this.stopPolling();
    this.pollHandle = setInterval(() => {
      void this.refreshProcessState();
      if (this.flowService.canEnterSummary()) {
        this.stopPolling();
      }
    }, 3000);
  }

  private stopPolling(): void {
    if (!this.pollHandle) {
      return;
    }
    clearInterval(this.pollHandle);
    this.pollHandle = null;
  }

  private async refreshProcessState(): Promise<void> {
    if (this.isRefreshing) {
      return;
    }

    this.isRefreshing = true;
    this.apiError = '';
    try {
      await this.flowService.refreshResults();
      this.documents = this.flowService.getDisplayDocuments();
      if (this.selectedDocumentIndex >= this.documents.length) {
        this.selectedDocumentIndex = Math.max(this.documents.length - 1, 0);
      }
    } catch {
      this.apiError = 'Ergebnisse konnten nicht vom Server geladen werden.';
    } finally {
      this.isRefreshing = false;
    }
  }
}
