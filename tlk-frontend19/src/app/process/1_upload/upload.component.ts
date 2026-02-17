import { Component } from '@angular/core';
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
  readonly documentTypeOptions = [
    { label: 'Bitte waehlen', value: '' },
    { label: 'Geburtsurkunde', value: 'birth-certificate' },
    { label: 'Schulbescheinigung', value: 'school-certificate' },
    { label: 'Studienbescheinigung', value: 'study-certificate' },
    { label: 'Sonstiger Nachweis', value: 'other' },
  ];
}
