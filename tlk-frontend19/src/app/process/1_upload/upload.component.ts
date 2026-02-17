import { Component, inject } from '@angular/core';
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
  SelectBoxComponent,
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
    GridDirective,
    ProgressnavComponent,
    ProgressnavNodeComponent,
    RowDirective,
    SelectBoxComponent,
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

  readonly documentTypeOptions = [
    { label: 'Bitte waehlen', value: '' },
    { label: 'Geburtsurkunde', value: 'birth-certificate' },
    { label: 'Schulbescheinigung', value: 'school-certificate' },
    { label: 'Studienbescheinigung', value: 'study-certificate' },
    { label: 'Sonstiger Nachweis', value: 'other' },
  ];

  cancelFlow(): void {
    this.flowService.resetFlow();
    void this.router.navigate(['/staples']);
  }

  goToProcess(): void {
    this.flowService.completeUpload();
    void this.router.navigate(['/process']);
  }
}
