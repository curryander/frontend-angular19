import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
import {
  StapleFlowService,
  WorkflowPageDisplay,
  WorkflowSidebarPageDisplay,
  WorkflowVorgangDisplay,
} from '../staple-flow.service';

@Component({
  selector: 'app-process',
  imports: [
    ApplicationHeaderComponent,
    ButtonComponent,
    ButtonbarComponent,
    ColDirective,
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
  private isResizingSplit = false;
  private previewRequestCounter = 0;
  private readonly minSplitPercent = 25;
  private readonly maxSplitPercent = 75;
  @ViewChild('compareGrid') compareGridRef?: ElementRef<HTMLElement>;

  readonly extractionViews = ['text', 'markdown', 'json'] as const;
  sidebarPages: WorkflowSidebarPageDisplay[] = [];
  pages: WorkflowPageDisplay[] = [];
  selectedPageIndex = 0;
  selectedPagePreviewUrl: SafeResourceUrl | null = null;
  isPreviewLoading = false;
  previewError = '';
  selectedExtractionView: (typeof this.extractionViews)[number] = 'markdown';
  splitPercent = 42;
  isRefreshing = false;
  isLlmStarting = false;
  apiError = '';
  llmError = '';
  llmSuccess = '';

  get headerTitle(): string {
    return `Prüfung · Vorgang ${this.flowService.getCaseNumber()} · Erfasst am ${this.flowService.getCapturedAt()}`;
  }

  get hasPages(): boolean {
    return this.sidebarPages.length > 0;
  }

  get selectedPage(): WorkflowPageDisplay | null {
    const selectedSidebarPage = this.sidebarPages[this.selectedPageIndex];
    if (!selectedSidebarPage) {
      return null;
    }
    return this.pages.find((page) => page.pageNo === selectedSidebarPage.pageNo) ?? null;
  }

  get selectedSidebarPage(): WorkflowSidebarPageDisplay | null {
    return this.sidebarPages[this.selectedPageIndex] ?? null;
  }

  get compareGridTemplateColumns(): string {
    const left = this.splitPercent;
    const right = 100 - this.splitPercent;
    return `minmax(18rem, ${left}fr) 0.625rem minmax(24rem, ${right}fr)`;
  }

  get vorgangData(): WorkflowVorgangDisplay {
    return this.flowService.getVorgangResults();
  }

  get progressText(): string {
    const status = this.flowService.getWorkflowStatus();
    const progress = this.flowService.getWorkflowProgressPercent();
    if (!this.hasPages && progress === 0) {
      return 'Verarbeitung wurde gestartet. Ergebnisse werden geladen.';
    }
    return `Workflow-Status: ${status} (${progress} %)`;
  }

  get canGoToSummary(): boolean {
    return this.flowService.canEnterSummary();
  }

  get canStartLlm(): boolean {
    return this.flowService.canTriggerLlmProcessing() && !this.isLlmStarting;
  }

  get selectedExtractionContent(): string {
    const page = this.selectedPage;
    if (!page) {
      return '';
    }

    switch (this.selectedExtractionView) {
      case 'text':
        return page.text;
      case 'json':
        return page.doclingJson;
      case 'markdown':
      default:
        return page.markdown;
    }
  }

  async ngOnInit(): Promise<void> {
    await this.refreshProcessState();
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.stopPolling();
    this.stopResizeListening();
    this.flowService.clearPagePdfObjectUrls();
  }

  selectPage(index: number): void {
    this.selectedPageIndex = index;
    void this.refreshSelectedPagePreview();
  }

  onDividerPointerDown(event: PointerEvent): void {
    if (window.matchMedia('(max-width: 64.0425rem)').matches) {
      return;
    }

    this.isResizingSplit = true;
    this.updateSplitFromClientX(event.clientX);
    window.addEventListener('pointermove', this.onResizePointerMove);
    window.addEventListener('pointerup', this.onResizePointerUp);
  }

  cancelFlow(): void {
    this.flowService.resetFlow();
    void this.router.navigate(['/staples']);
  }

  backToUpload(): void {
    void this.router.navigate(['/upload']);
  }

  goToSummary(): void {
    if (!this.canGoToSummary) {
      return;
    }
    void this.router.navigate(['/summary']);
  }

  setExtractionView(view: (typeof this.extractionViews)[number]): void {
    this.selectedExtractionView = view;
  }

  getExtractionViewLabel(view: (typeof this.extractionViews)[number]): string {
    switch (view) {
      case 'text':
        return 'Text';
      case 'json':
        return 'JSON';
      case 'markdown':
      default:
        return 'Markdown';
    }
  }

  async startLlmProcessing(): Promise<void> {
    if (!this.canStartLlm) {
      return;
    }

    this.isLlmStarting = true;
    this.llmError = '';
    this.llmSuccess = '';
    try {
      await this.flowService.triggerLlmProcessing();
      this.llmSuccess = 'LLM-Verarbeitung wurde gestartet.';
      await this.refreshProcessState();
    } catch {
      this.llmError = 'LLM-Verarbeitung konnte nicht gestartet werden.';
    } finally {
      this.isLlmStarting = false;
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

  private readonly onResizePointerMove = (event: PointerEvent): void => {
    if (!this.isResizingSplit) {
      return;
    }
    this.updateSplitFromClientX(event.clientX);
  };

  private readonly onResizePointerUp = (): void => {
    this.isResizingSplit = false;
    this.stopResizeListening();
  };

  private stopResizeListening(): void {
    window.removeEventListener('pointermove', this.onResizePointerMove);
    window.removeEventListener('pointerup', this.onResizePointerUp);
  }

  private updateSplitFromClientX(clientX: number): void {
    const container = this.compareGridRef?.nativeElement;
    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    if (rect.width <= 0) {
      return;
    }

    const ratio = ((clientX - rect.left) / rect.width) * 100;
    this.splitPercent = Math.min(this.maxSplitPercent, Math.max(this.minSplitPercent, ratio));
  }

  private async refreshProcessState(): Promise<void> {
    if (this.isRefreshing) {
      return;
    }

    this.isRefreshing = true;
    this.apiError = '';
    try {
      this.sidebarPages = await this.flowService.getSidebarPages();
      if (this.selectedPageIndex >= this.sidebarPages.length) {
        this.selectedPageIndex = Math.max(this.sidebarPages.length - 1, 0);
      }
    } catch {
      this.sidebarPages = [];
      this.apiError = 'Seiten konnten nicht vom Server geladen werden.';
    }

    try {
      await this.flowService.refreshResults();
      this.pages = this.flowService.getPageResults();
      await this.refreshSelectedPagePreview();
    } catch {
      this.pages = [];
      await this.refreshSelectedPagePreview();
      if (!this.apiError) {
        this.apiError = 'Ergebnisse konnten nicht vom Server geladen werden.';
      }
    } finally {
      this.isRefreshing = false;
    }
  }

  private async refreshSelectedPagePreview(): Promise<void> {
    const pageId = this.selectedSidebarPage?.pageId;
    if (!pageId) {
      this.selectedPagePreviewUrl = null;
      this.previewError = '';
      this.isPreviewLoading = false;
      return;
    }

    const requestId = ++this.previewRequestCounter;
    this.isPreviewLoading = true;
    this.previewError = '';

    try {
      const objectUrl = await this.flowService.getPagePdfObjectUrl(pageId);
      if (requestId !== this.previewRequestCounter) {
        return;
      }
      this.selectedPagePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
    } catch {
      if (requestId !== this.previewRequestCounter) {
        return;
      }
      this.selectedPagePreviewUrl = null;
      this.previewError = 'PDF-Vorschau konnte nicht geladen werden.';
    } finally {
      if (requestId === this.previewRequestCounter) {
        this.isPreviewLoading = false;
      }
    }
  }
}
