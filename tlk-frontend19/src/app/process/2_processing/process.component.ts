import { Component, inject } from '@angular/core';
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
import { StapleFlowService } from '../staple-flow.service';

type KeyValueField = {
  key: string;
  value: string;
};

type DocumentItem = {
  id: string;
  title: string;
  summary: string;
  capturedAt: string;
  pages: number;
  status: 'Neu' | 'Geprüft';
  previewUrl: SafeResourceUrl;
  documentExtractFields: KeyValueField[];
  insuredMasterDataFields: KeyValueField[];
};

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
export class ProcessComponent {
  private readonly router = inject(Router);
  private readonly flowService = inject(StapleFlowService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly stapleCaseNumber = 'VS-2026-000471';
  private readonly stapleCapturedAt = '03.03.2026';

  selectedDocumentIndex = 0;

  readonly documents: DocumentItem[] = [
    {
      id: 'doc-001',
      title: 'Antrag Altersrente',
      summary: 'Antragsformular mit Angaben zu Person und Versicherungsverlauf.',
      capturedAt: '03.03.2026',
      pages: 6,
      status: 'Neu',
      previewUrl: this.createPreviewUrl(
        '/staples-of-documents/Dateien%20(20)%20von%20Michael%20Vogel_%20SZ162211325091611310/SZ162211325091611260.pdf',
      ),
      documentExtractFields: [
        { key: 'Titel', value: 'Antrag Altersrente' },
        { key: 'Zusammenfassung', value: 'Antrag mit zugehörigen Nachweisen zur Rentenprüfung.' },
        { key: 'Datum der Erfassung', value: '03.03.2026' },
        { key: 'Dokument-ID', value: 'doc-001' },
      ],
      insuredMasterDataFields: [
        { key: 'Versicherungsnummer', value: '12 345678 M 090' },
        { key: 'Versicherungsnummer verstorbener Versicherter', value: '' },
        { key: 'Familienname', value: 'Muster' },
        { key: 'Vorname', value: 'Maria' },
        { key: 'Geburtsname', value: 'Beispiel' },
        { key: 'Geburtsort', value: 'Berlin' },
        { key: 'Geburtsland', value: 'Deutschland' },
        { key: 'Staatsangehörigkeit', value: 'Deutsch' },
        { key: 'Sterbedatum', value: '' },
        { key: 'Anschrift', value: 'Musterstraße 7, 10115 Berlin' },
        { key: 'Betriebsnummer des Arbeitgebers', value: '12345678' },
        { key: 'Tag der Beschäftigungsaufnahme', value: '01.02.2020' },
      ],
    },
    {
      id: 'doc-002',
      title: 'Geburtsurkunde',
      summary: 'Nachweis zu Geburtsname, Geburtsort und Geburtsdatum.',
      capturedAt: '03.03.2026',
      pages: 1,
      status: 'Geprüft',
      previewUrl: this.createPreviewUrl(
        '/staples-of-documents/Dateien%20(20)%20von%20Michael%20Vogel_%20SZ162211325091611310/SZ162211325091611270.pdf',
      ),
      documentExtractFields: [
        { key: 'Titel', value: 'Geburtsurkunde' },
        { key: 'Zusammenfassung', value: 'Nachweis zu Personenstand und Geburtsdaten.' },
        { key: 'Datum der Erfassung', value: '03.03.2026' },
        { key: 'Dokument-ID', value: 'doc-002' },
      ],
      insuredMasterDataFields: [
        { key: 'Versicherungsnummer', value: '12 345678 M 090' },
        { key: 'Versicherungsnummer verstorbener Versicherter', value: '' },
        { key: 'Familienname', value: 'Muster' },
        { key: 'Vorname', value: 'Maria' },
        { key: 'Geburtsname', value: 'Beispiel' },
        { key: 'Geburtsort', value: 'Leipzig' },
        { key: 'Geburtsland', value: 'Deutschland' },
        { key: 'Staatsangehörigkeit', value: 'Deutsch' },
        { key: 'Sterbedatum', value: '' },
        { key: 'Anschrift', value: 'Musterstraße 7, 10115 Berlin' },
        { key: 'Betriebsnummer des Arbeitgebers', value: '12345678' },
        { key: 'Tag der Beschäftigungsaufnahme', value: '01.02.2020' },
      ],
    },
    {
      id: 'doc-003',
      title: 'Arbeitgeberbescheinigung',
      summary: 'Nachweis zu Beschäftigungsbeginn und Betriebsnummer.',
      capturedAt: '03.03.2026',
      pages: 2,
      status: 'Neu',
      previewUrl: this.createPreviewUrl(
        '/staples-of-documents/Dateien%20(20)%20von%20Michael%20Vogel_%20SZ162211325091611310/SZ162211325091611300.pdf',
      ),
      documentExtractFields: [
        { key: 'Titel', value: 'Arbeitgeberbescheinigung' },
        { key: 'Zusammenfassung', value: 'Bestätigung des Arbeitgebers zur Beschäftigung.' },
        { key: 'Datum der Erfassung', value: '03.03.2026' },
        { key: 'Dokument-ID', value: 'doc-003' },
      ],
      insuredMasterDataFields: [
        { key: 'Versicherungsnummer', value: '12 345678 M 090' },
        { key: 'Versicherungsnummer verstorbener Versicherter', value: '' },
        { key: 'Familienname', value: 'Muster' },
        { key: 'Vorname', value: 'Maria' },
        { key: 'Geburtsname', value: 'Beispiel' },
        { key: 'Geburtsort', value: 'Berlin' },
        { key: 'Geburtsland', value: 'Deutschland' },
        { key: 'Staatsangehörigkeit', value: 'Deutsch' },
        { key: 'Sterbedatum', value: '' },
        { key: 'Anschrift', value: 'Musterstraße 7, 10115 Berlin' },
        { key: 'Betriebsnummer des Arbeitgebers', value: '87654321' },
        { key: 'Tag der Beschäftigungsaufnahme', value: '15.05.2021' },
      ],
    },
  ];

  get headerTitle(): string {
    return `Prüfung · Vorgang ${this.stapleCaseNumber} · Erfasst am ${this.stapleCapturedAt}`;
  }

  get selectedDocument(): DocumentItem {
    return this.documents[this.selectedDocumentIndex] ?? this.documents[0];
  }

  get selectedDocumentExtractFields(): KeyValueField[] {
    return this.selectedDocument.documentExtractFields;
  }

  get selectedInsuredMasterDataFields(): KeyValueField[] {
    return this.selectedDocument.insuredMasterDataFields;
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

  goToSummary(): void {
    this.flowService.completeProcessing();
    void this.router.navigate(['/summary']);
  }

  private createPreviewUrl(path: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `${path}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`,
    );
  }
}
