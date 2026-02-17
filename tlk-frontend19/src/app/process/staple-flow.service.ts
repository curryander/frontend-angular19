import { Injectable } from '@angular/core';

type StapleFlowState = {
  uploadCompleted: boolean;
  processingCompleted: boolean;
};

const DEFAULT_STATE: StapleFlowState = {
  uploadCompleted: false,
  processingCompleted: false,
};

const STORAGE_KEY = 'staple_flow_state';

@Injectable({ providedIn: 'root' })
export class StapleFlowService {
  private state: StapleFlowState = this.loadState();

  startFlow(): void {
    this.state = { ...DEFAULT_STATE };
    this.persistState();
  }

  resetFlow(): void {
    this.state = { ...DEFAULT_STATE };
    this.persistState();
  }

  completeUpload(): void {
    this.state.uploadCompleted = true;
    this.state.processingCompleted = false;
    this.persistState();
  }

  completeProcessing(): void {
    if (!this.state.uploadCompleted) {
      return;
    }

    this.state.processingCompleted = true;
    this.persistState();
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
}
