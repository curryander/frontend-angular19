import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ButtonComponent } from '@drv-ds/drv-design-system-ng';
import { firstValueFrom } from 'rxjs';
import { DokumentenstapelService } from '../../api/api/dokumentenstapel.service';
import { Dokumentenstapel } from '../../api/model/dokumentenstapel';
import { StapleFlowService } from '../../process/staple-flow.service';

type RawStapleEntry = string | Dokumentenstapel;

type StapleDocument = {
  id: string;
  vorgangId: string;
  title: string;
  category: string;
  downloadUrl: string | null;
  previewUrl: SafeResourceUrl | null;
  addedAt: string;
  createdAtRaw: string;
  pageCount: number | null;
  status: string;
  previewLoading: boolean;
  previewError: string;
};

@Component({
  selector: 'app-staples',
  imports: [ButtonComponent],
  standalone: true,
  templateUrl: './staples.component.html',
  styleUrl: './staples.component.scss',
})
export class StaplesComponent implements OnInit, OnDestroy {
  private readonly initialVisibleCount = 6;
  private readonly loadStep = 3;
  private readonly router = inject(Router);
  private readonly flowService = inject(StapleFlowService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly dokumentenstapelService = inject(DokumentenstapelService);
  private readonly objectUrls = new Map<string, string>();

  activePreviewId: string | null = null;
  readonly stapleDocuments: StapleDocument[] = [];
  visibleDocumentCount = this.initialVisibleCount;
  documentsLoading = false;
  documentsError = '';

  ngOnInit(): void {
    void this.loadStaples();
  }

  ngOnDestroy(): void {
    this.objectUrls.forEach((url) => URL.revokeObjectURL(url));
    this.objectUrls.clear();
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
  }

  async showPreview(doc: StapleDocument): Promise<void> {
    this.activePreviewId = doc.id;
    if (doc.previewUrl) {
      return;
    }

    doc.previewLoading = true;
    doc.previewError = '';

    try {
      const stapelUpload = await firstValueFrom(
        this.dokumentenstapelService.getDokumentenstapelUpload(doc.id),
      ) as Dokumentenstapel;
      const uploadSource = this.resolveUploadSource(doc.id, stapelUpload);
      if (!uploadSource) {
        doc.previewError = 'Keine Vorschau verfügbar.';
        this.activePreviewId = null;
        return;
      }

      doc.title = stapelUpload.stapelName || stapelUpload.uploadFilename || stapelUpload.originalFilename || doc.title;
      doc.pageCount = stapelUpload.seitenAnzahl ?? doc.pageCount;
      doc.downloadUrl = uploadSource;
      doc.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `${uploadSource}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`,
      );
    } catch {
      doc.previewError = 'Vorschau konnte nicht geladen werden.';
      this.activePreviewId = null;
    } finally {
      doc.previewLoading = false;
    }
  }

  isPreviewActive(docId: string): boolean {
    return this.activePreviewId === docId;
  }

  private async loadStaples(): Promise<void> {
    this.documentsLoading = true;
    this.documentsError = '';

    try {
      const stapel = await firstValueFrom(this.dokumentenstapelService.getDokumentenstapel()) as unknown as RawStapleEntry[];
      const mappedStaples = [...stapel].map((entry) => this.mapStaple(entry));

      this.stapleDocuments.splice(0, this.stapleDocuments.length, ...mappedStaples);
      this.stapleDocuments.sort((a, b) => this.toTimestamp(b.createdAtRaw) - this.toTimestamp(a.createdAtRaw));
      this.visibleDocumentCount = Math.min(this.initialVisibleCount, this.stapleDocuments.length);
    } catch {
      this.documentsError = 'Dokumentenstapel konnten nicht geladen werden.';
    } finally {
      this.documentsLoading = false;
    }
  }

  private mapStaple(stapel: RawStapleEntry): StapleDocument {
    if (typeof stapel === 'string') {
      return {
        id: stapel,
        vorgangId: '',
        title: `Dokumentenstapel ${stapel}`,
        category: 'DOKUMENTENSTAPEL',
        downloadUrl: null,
        previewUrl: null,
        addedAt: '-',
        createdAtRaw: '',
        pageCount: null,
        status: 'UNBEKANNT',
        previewLoading: false,
        previewError: '',
      };
    }

    const fallbackTitle = stapel.originalFilename || stapel.uploadFilename || stapel.id || 'Unbenannter Stapel';

    return {
      id: stapel.id ?? '',
      vorgangId: stapel.vorgangId ?? '',
      title: stapel.stapelName || fallbackTitle,
      category: stapel.status || 'UNBEKANNT',
      downloadUrl: null,
      previewUrl: null,
      addedAt: this.formatDate(stapel.createdAt),
      createdAtRaw: stapel.createdAt ?? '',
      pageCount: stapel.seitenAnzahl ?? null,
      status: stapel.status || 'UNBEKANNT',
      previewLoading: false,
      previewError: '',
    };
  }

  private resolveUploadSource(stapelId: string, stapel: Dokumentenstapel): string | null {
    if (!stapel.uploadPdf) {
      return null;
    }

    const existingUrl = this.objectUrls.get(stapelId);
    if (existingUrl) {
      return existingUrl;
    }

    const binary = atob(stapel.uploadPdf);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    const blob = new Blob([bytes], { type: 'application/pdf' });
    const objectUrl = URL.createObjectURL(blob);
    this.objectUrls.set(stapelId, objectUrl);
    return objectUrl;
  }

  private toTimestamp(dateValue: string | undefined): number {
    if (!dateValue) {
      return 0;
    }

    const timestamp = Date.parse(dateValue);
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  private formatDate(dateValue: string | undefined): string {
    if (!dateValue) {
      return '-';
    }

    const timestamp = Date.parse(dateValue);
    if (Number.isNaN(timestamp)) {
      return '-';
    }

    return new Intl.DateTimeFormat('de-DE').format(new Date(timestamp));
  }
}
