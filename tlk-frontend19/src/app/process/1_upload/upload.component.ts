import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
export class UploadComponent {
  private readonly router = inject(Router);
  private readonly flowService = inject(StapleFlowService);
  private readonly maxTotalFileSizeBytes = 1024 * 1024 * 1024;
  private readonly maxDocumentCount = 1;
  private readonly insuranceNumberPattern = /^\d{2}\s(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])\d{2}\s[A-Za-z]\s\d{3}$/;

  selectedFiles: FileList | null = null;
  insuranceNumber = '';
  isConfirmationChecked = false;
  uploadError = '';
  startError = '';
  isStartingProcessing = false;
  hasInteractedWithRequiredFields = false;

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
      await this.flowService.startServerProcessing(this.selectedFileList);
      void this.router.navigate(['/process']);
    } catch {
      this.startError = 'Die Verarbeitung konnte nicht gestartet werden. Bitte versuchen Sie es erneut.';
    } finally {
      this.isStartingProcessing = false;
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
    return 'Bitte geben Sie eine gültige Versicherungsnummer an, wählen Sie genau eine PDF-Datei aus und bestätigen Sie die Erklärung.';
  }

  get isInsuranceNumberValid(): boolean {
    return this.insuranceNumberPattern.test(this.insuranceNumber.trim());
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
