import { Component, inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  ApplicationHeaderComponent,
  ButtonComponent,
  ButtonbarComponent,
  CheckboxComponent,
  ColDirective,
  GridDirective,
  ProgressnavComponent,
  ProgressnavNodeComponent,
  RowDirective,
  StatusComponent,
  TextareaComponent,
  TextinputComponent,
  UploadFieldComponent,
} from '@drv-ds/drv-design-system-ng';
import { DokumentenstapelService } from '../../api/api/dokumentenstapel.service';
import { StapleFlowService } from '../staple-flow.service';

@Component({
  selector: 'app-upload',
  imports: [
    ApplicationHeaderComponent,
    ButtonComponent,
    ButtonbarComponent,
    CheckboxComponent,
    ColDirective,
    FormsModule,
    GridDirective,
    ProgressnavComponent,
    ProgressnavNodeComponent,
    RowDirective,
    StatusComponent,
    TextareaComponent,
    TextinputComponent,
    UploadFieldComponent,
  ],
  templateUrl: './upload.component.html',
  standalone: true,
  styleUrl: './upload.component.scss',
})
export class UploadComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly flowService = inject(StapleFlowService);
  private readonly dokumentenstapelService = inject(DokumentenstapelService);
  private readonly maxTotalFileSizeBytes = 1024 * 1024 * 1024;
  private readonly maxDocumentCount = 1;

  selectedFiles: FileList | null = null;
  insuranceNumber = '12 150890 M 123';
  existingDokumentenstapelId = '';
  isConfirmationChecked = false;
  uploadError = '';
  startError = '';
  openExistingError = '';
  dokumentenstapelHintError = '';
  isStartingProcessing = false;
  isOpeningExistingProcess = false;
  isLoadingDokumentenstapelHints = false;
  hasInteractedWithRequiredFields = false;
  dokumentenstapelHints: Array<{ id: string; name: string }> = [];

  async ngOnInit(): Promise<void> {
    await this.loadDokumentenstapelHints();
  }

  cancelFlow(): void {
    this.flowService.resetFlow();
    void this.router.navigate(['/staples']);
  }

  async goToProcess(): Promise<void> {
    this.hasInteractedWithRequiredFields = true;
    this.startError = '';

    if (this.uploadError || this.isStartingProcessing) {
      return;
    }

    if (!this.selectedFileCount || !this.isConfirmationChecked || !this.isInsuranceNumberValid) {
      return;
    }

    this.isStartingProcessing = true;
    try {
      await this.flowService.startServerProcessing(this.selectedFileList, this.insuranceNumber);
      void this.router.navigate(['/process']);
    } catch {
      this.startError = 'Die Verarbeitung konnte nicht gestartet werden. Bitte versuchen Sie es erneut.';
    } finally {
      this.isStartingProcessing = false;
    }
  }

  async openExistingDokumentenstapel(): Promise<void> {
    this.openExistingError = '';
    if (this.isOpeningExistingProcess) {
      return;
    }

    const stapelId = this.existingDokumentenstapelId.trim();
    if (!stapelId) {
      this.openExistingError = 'Bitte geben Sie eine Dokumentenstapel-ID ein.';
      return;
    }

    this.isOpeningExistingProcess = true;
    try {
      await this.flowService.openExistingDokumentenstapel(stapelId);
      void this.router.navigate(['/process']);
    } catch {
      this.openExistingError = 'Dokumentenstapel konnte nicht geladen werden. Bitte ID prüfen und erneut versuchen.';
    } finally {
      this.isOpeningExistingProcess = false;
    }
  }

  onFilesSelected(files: FileList | null): void {
    this.hasInteractedWithRequiredFields = true;
    this.selectedFiles = files;
    this.validateSelection();
  }

  onConfirmationChange(value: boolean): void {
    this.hasInteractedWithRequiredFields = true;
    this.isConfirmationChecked = value;
  }

  onInsuranceNumberChange(value: string): void {
    this.hasInteractedWithRequiredFields = true;
    this.insuranceNumber = value;
  }

  onExistingDokumentenstapelIdChange(value: string): void {
    this.existingDokumentenstapelId = value;
  }

  removeSelectedFile(fileIndex: number): void {
    this.hasInteractedWithRequiredFields = true;
    const updatedFiles = this.selectedFileList.filter((_, index) => index !== fileIndex);
    this.selectedFiles = this.toFileList(updatedFiles);
    this.validateSelection();
  }

  get canContinue(): boolean {
    return (
      !this.uploadError
      && this.selectedFileCount > 0
      && this.isConfirmationChecked
      && this.isInsuranceNumberValid
      && !this.isStartingProcessing
    );
  }

  get missingRequiredError(): string {
    if (!this.hasInteractedWithRequiredFields || this.uploadError || this.canContinue) {
      return '';
    }
    return 'Bitte geben Sie eine Versicherungsnummer an, wählen Sie genau eine PDF-Datei aus und bestätigen Sie die Erklärung.';
  }

  get isInsuranceNumberValid(): boolean {
    return this.insuranceNumber.trim().length > 0;
  }

  get selectedFileList(): File[] {
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      return [];
    }

    const files: File[] = [];
    for (let index = 0; index < this.selectedFiles.length; index += 1) {
      const file = this.selectedFiles.item(index);
      if (file) {
        files.push(file);
      }
    }
    return files;
  }

  get selectedFileCount(): number {
    return this.selectedFileList.length;
  }

  get selectedFileSizeTotalMb(): string {
    const totalBytes = this.selectedFileList.reduce((sum, file) => sum + file.size, 0);
    return (totalBytes / (1024 * 1024)).toFixed(2);
  }

  private async loadDokumentenstapelHints(): Promise<void> {
    this.isLoadingDokumentenstapelHints = true;
    this.dokumentenstapelHintError = '';

    try {
      const stapel = await firstValueFrom(this.dokumentenstapelService.getDokumentenstapel());
      this.dokumentenstapelHints = stapel
        .filter((entry) => Boolean(entry.id))
        .map((entry) => ({
          id: entry.id ?? '',
          name: entry.stapelName?.trim() || entry.originalFilename?.trim() || entry.uploadFilename?.trim() || 'Ohne Bezeichnung',
        }));
    } catch {
      this.dokumentenstapelHintError = 'Die Liste der Dokumentenstapel konnte nicht geladen werden.';
      this.dokumentenstapelHints = [];
    } finally {
      this.isLoadingDokumentenstapelHints = false;
    }
  }

  private validateSelection(): void {
    this.uploadError = '';

    const files = this.selectedFileList;
    if (files.length === 0) {
      return;
    }

    const validationMessages: string[] = [];
    const invalidFiles = files
      .filter((file) => !file.name.toLowerCase().endsWith('.pdf'))
      .map((file) => file.name);
    const totalBytes = files.reduce((sum, file) => sum + file.size, 0);

    if (invalidFiles.length > 0) {
      validationMessages.push(`Nur PDF-Dateien sind erlaubt. Ungültige Datei(en): ${invalidFiles.join(', ')}`);
    }

    if (files.length > this.maxDocumentCount) {
      validationMessages.push('Es ist nur ein Dokument erlaubt.');
    }

    if (totalBytes > this.maxTotalFileSizeBytes) {
      validationMessages.push('Die Gesamtgröße aller Dokumente darf 1 GB nicht überschreiten.');
    }

    this.uploadError = validationMessages.join(' ');
  }

  private toFileList(files: File[]): FileList | null {
    if (files.length === 0) {
      return null;
    }

    const dataTransfer = new DataTransfer();
    for (const file of files) {
      dataTransfer.items.add(file);
    }
    return dataTransfer.files;
  }
}
