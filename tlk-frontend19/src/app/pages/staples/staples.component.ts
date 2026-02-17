import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ButtonComponent, HeaderComponent } from '@drv-ds/drv-design-system-ng';
import { StapleFlowService } from '../../process/staple-flow.service';

type StapleDocument = {
  title: string;
  category: string;
  url: string;
  previewUrl: SafeResourceUrl;
  addedAt: string;
  pageCount: number | null;
  pageCountLoading: boolean;
};

const STAPLE_DOCUMENT_PATHS = [
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/SZ162211325091611260.pdf',
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/SZ162211325091611270.pdf',
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/SZ162211325091611280.pdf',
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/SZ162211325091611300.pdf',
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/SZ162211325091611310.pdf',
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/SZ162211325091611311.pdf',
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/SZ162211325091611320.pdf',
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/SZ162211325091611340.pdf',
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/SZ162211325091611360.pdf',
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/SZ162211325091611361.pdf',
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/SZ162211325091611370.pdf',
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/SZ162211325091611380.pdf',
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/SZ162211325091613120.pdf',
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/SZ162211325091613130.pdf',
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/SZ162211325091613131.pdf',
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/SZ162211325091613300.pdf',
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/SZ162211325091614050.pdf',
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/SZ162211325091614051.pdf',
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/leicht/SZ162211325091611260.pdf',
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/leicht/SZ162211325091611270.pdf',
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/leicht/SZ162211325091611300.pdf',
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/leicht/SZ162211325091611310.pdf',
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/leicht/SZ162211325091611360.pdf',
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/leicht/SZ162211325091611370.pdf',
  'staples-of-documents/Dateien (20) von Michael Vogel_ SZ162211325091611310/leicht/SZ162211325091614050.pdf',
];

@Component({
  selector: 'app-staples',
  imports: [ButtonComponent, HeaderComponent],
  standalone: true,
  templateUrl: './staples.component.html',
  styleUrl: './staples.component.scss',
})
export class StaplesComponent {
  private readonly initialVisibleCount = 6;
  private readonly loadStep = 3;
  private readonly defaultAddedAt = '17.07.2025';
  private readonly router = inject(Router);
  private readonly flowService = inject(StapleFlowService);
  private readonly sanitizer = inject(DomSanitizer);
  activePreviewUrl: string | null = null;
  readonly stapleDocuments: StapleDocument[] = STAPLE_DOCUMENT_PATHS.map((path, index) => {
    const fileName = path.split('/').pop() ?? `document-${index + 1}.pdf`;
    const category = path.includes('/leicht/') ? 'Leicht' : 'Standard';
    const encodedPath = `/${encodeURI(path)}`;
    return {
      title: `Staple ${index + 1}: ${fileName}`,
      category,
      url: encodedPath,
      previewUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
        `${encodedPath}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`,
      ),
      addedAt: this.defaultAddedAt,
      pageCount: null,
      pageCountLoading: false,
    };
  });
  visibleDocumentCount = this.initialVisibleCount;

  constructor() {
    this.loadVisiblePageCounts();
  }

  startStapleFlow(): void {
    this.flowService.startFlow();
    void this.router.navigate(['/upload']);
  }

  get visibleStapleDocuments(): StapleDocument[] {
    return this.stapleDocuments.slice(0, this.visibleDocumentCount);
  }

  hasMoreDocuments(): boolean {
    return this.visibleDocumentCount < this.stapleDocuments.length;
  }

  loadMoreDocuments(): void {
    this.visibleDocumentCount = Math.min(this.visibleDocumentCount + this.loadStep, this.stapleDocuments.length);
    this.loadVisiblePageCounts();
  }

  showPreview(url: string): void {
    this.activePreviewUrl = url;
  }

  isPreviewActive(url: string): boolean {
    return this.activePreviewUrl === url;
  }

  private loadVisiblePageCounts(): void {
    for (const doc of this.visibleStapleDocuments) {
      if (doc.pageCount === null && !doc.pageCountLoading) {
        void this.resolvePageCount(doc);
      }
    }
  }

  private async resolvePageCount(doc: StapleDocument): Promise<void> {
    doc.pageCountLoading = true;
    try {
      const response = await fetch(doc.url);
      if (!response.ok) {
        doc.pageCount = -1;
        return;
      }

      const buffer = await response.arrayBuffer();
      const rawText = new TextDecoder('latin1').decode(buffer);
      const matches = rawText.match(/\/Type\s*\/Page\b/g);
      doc.pageCount = matches?.length ?? -1;
    } catch {
      doc.pageCount = -1;
    } finally {
      doc.pageCountLoading = false;
    }
  }
}
