import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
import { StapleFlowService, WorkflowPageDisplay } from '../staple-flow.service';

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
  private pollHandle: ReturnType<typeof setInterval> | null = null;

  pages: WorkflowPageDisplay[] = [];
  selectedPageIndex = 0;
  isRefreshing = false;
  isLlmStarting = false;
  apiError = '';
  llmError = '';
  llmSuccess = '';

  get headerTitle(): string {
    return `Prüfung · Vorgang ${this.flowService.getCaseNumber()} · Erfasst am ${this.flowService.getCapturedAt()}`;
  }

  get hasPages(): boolean {
    return this.pages.length > 0;
  }

  get selectedPage(): WorkflowPageDisplay | null {
    return this.pages[this.selectedPageIndex] ?? null;
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

  async ngOnInit(): Promise<void> {
    await this.refreshProcessState();
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  selectPage(index: number): void {
    this.selectedPageIndex = index;
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

  private async refreshProcessState(): Promise<void> {
    if (this.isRefreshing) {
      return;
    }

    this.isRefreshing = true;
    this.apiError = '';
    try {
      await this.flowService.refreshResults();
      this.pages = this.flowService.getPageResults();
      if (this.selectedPageIndex >= this.pages.length) {
        this.selectedPageIndex = Math.max(this.pages.length - 1, 0);
      }
    } catch {
      this.apiError = 'Ergebnisse konnten nicht vom Server geladen werden.';
    } finally {
      this.isRefreshing = false;
    }
  }
}
