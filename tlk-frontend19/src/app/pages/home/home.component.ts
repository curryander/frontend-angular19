import { Component } from '@angular/core';
import {
  ButtonComponent,
  HeaderComponent,
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
    HeaderComponent,
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
      'Bei Sammeldokumenten entstehen heute oft Medienbrueche: Daten werden aus Nachweisen in Formulare und spaeter erneut in interne Systeme uebertragen.',
  };

  readonly insightWorkflow = {
    '':
      'Nach dem Upload werden Dokumente automatisch aufbereitet, relevante Inhalte extrahiert und sinnvoll vorsortiert. Anschliessend kann jede erkannte Angabe fachlich geprueft werden.',
  };

  readonly insightBenefit = {
    '':
      'Der Gesamtprozess wird schneller und robuster: weniger Doppelarbeit, weniger Rueckfragen, bessere Antragsqualitaet und mehr Transparenz fuer alle Beteiligten.',
  };

  readonly insightRelevance = {
    '':
      'In der DRV werden je nach Antrag unterschiedliche Nachweise benoetigt. Eine automatische Vorstrukturierung beschleunigt die Bearbeitung und schafft eine bessere Grundlage fuer die Entscheidung.',
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
        'Upload direkt zum Antrag mit automatischer Analyse',
      ],
      [
        'Datenerfassung',
        'Angaben werden aus Dokumenten manuell uebertragen',
        'Relevante Felder werden automatisch vorbefuellt und koennen geprueft werden',
      ],
      [
        'Dokumentenstruktur',
        'Sortierung und Trennung erfolgen nachgelagert',
        'Automatisches Aufteilen und Zuordnen in passende Aktenbereiche',
      ],
      [
        'Bearbeitung',
        'Rueckfragen und Nacharbeit bei unklaren Unterlagen',
        'Hoehere Antragsqualitaet, weniger Doppelarbeit, schnellere Entscheidung',
      ],
    ],
  };
}
