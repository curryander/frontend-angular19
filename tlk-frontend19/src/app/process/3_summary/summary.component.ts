import { Component, inject } from '@angular/core';
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
  TableComponent,
  type TableData,
} from '@drv-ds/drv-design-system-ng';
import { StapleFlowService } from '../staple-flow.service';

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
  private readonly router = inject(Router);
  private readonly flowService = inject(StapleFlowService);

  readonly summaryData: TableData = {
    header: [
      { label: 'Bereich' },
      { label: 'Status' },
      { label: 'Hinweis' },
    ],
    body: [
      ['Persönliche Angaben', 'Vollständig', 'Keine offenen Punkte'],
      ['Dokumentenupload', '2 Dateien', 'Geburtsurkunde und Schulbescheinigung'],
      ['Prüfung', 'Ausstehend', 'Automatische Plausibilitätsprüfung läuft bei Versand'],
      ['Kontakt', 'Optional', 'E-Mail-Adresse wurde angegeben'],
    ],
  };

  cancelFlow(): void {
    this.flowService.resetFlow();
    void this.router.navigate(['/staples']);
  }

  finishFlow(): void {
    this.flowService.resetFlow();
    void this.router.navigate(['/staples']);
  }

  backToProcess(): void {
    void this.router.navigate(['/process']);
  }
}
