import { Component } from '@angular/core';
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
  TableComponent,
  type TableData,
} from '@drv-ds/drv-design-system-ng';

@Component({
  selector: 'app-summary',
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
    TableComponent,
  ],
  templateUrl: './summary.component.html',
  standalone: true,
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  readonly summaryData: TableData = {
    header: [
      { label: 'Bereich' },
      { label: 'Status' },
      { label: 'Hinweis' },
    ],
    body: [
      ['Persoenliche Angaben', 'Vollstaendig', 'Keine offenen Punkte'],
      ['Dokumentenupload', '2 Dateien', 'Geburtsurkunde und Schulbescheinigung'],
      ['Pruefung', 'Ausstehend', 'Automatische Plausibilitaetspruefung laeuft bei Versand'],
      ['Kontakt', 'Optional', 'E-Mail-Adresse wurde angegeben'],
    ],
  };
}
