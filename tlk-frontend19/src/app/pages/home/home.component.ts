import { Component } from '@angular/core';
import {
  ButtonComponent,
  PictogramComponent,
  StatusComponent,
  SummaryComponent,
  TableComponent,
  type TableData,
} from '@drv-ds/drv-design-system-ng';

@Component({
  selector: 'app-home',
  imports: [
    ButtonComponent,
    PictogramComponent,
    StatusComponent,
    SummaryComponent,
    TableComponent,

  ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly insightProblem = {
    '':
      'Bei Sammeldokumenten entstehen heute oft Medienbrüche: Daten werden aus Nachweisen in Formulare und später erneut in interne Systeme übertragen.',
  };

  readonly insightWorkflow = {
    '':
      'Nach dem Hochladen werden Dokumente automatisch aufbereitet, relevante Inhalte extrahiert und sinnvoll vorsortiert. Anschließend kann jede erkannte Angabe fachlich geprüft werden.',
  };

  readonly insightBenefit = {
    '':
      'Der Gesamtprozess wird schneller und robuster: weniger Doppelarbeit, weniger Rückfragen, bessere Antragsqualität und mehr Transparenz für alle Beteiligten.',
  };

  readonly insightRelevance = {
    '':
      'In der DRV werden je nach Antrag unterschiedliche Nachweise benötigt. Eine automatische Vorstrukturierung beschleunigt die Bearbeitung und schafft eine bessere Grundlage für die Entscheidung.',
  };

  readonly processTable: TableData = {
    header: [
      { label: 'Schritt' },
      { label: 'Heute' },
      { label: 'Mit der Anwendung' },
    ],
    body: [
      [
        'Dokumentenaufnahme',
        'Unterlagen werden als Sammeldokument eingereicht',
        'Hochladen direkt zum Antrag mit automatischer Analyse',
      ],
      [
        'Datenerfassung',
        'Angaben werden aus Dokumenten manuell übertragen',
        'Relevante Felder werden automatisch vorbefüllt und können geprüft werden',
      ],
      [
        'Dokumentenstruktur',
        'Sortierung und Trennung erfolgen nachgelagert',
        'Automatisches Aufteilen und Zuordnen in passende Aktenbereiche',
      ],
      [
        'Bearbeitung',
        'Rückfragen und Nacharbeit bei unklaren Unterlagen',
        'Höhere Antragsqualität, weniger Doppelarbeit, schnellere Entscheidung',
      ],
    ],
  };
}



