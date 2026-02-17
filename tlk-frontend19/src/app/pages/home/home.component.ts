import { Component } from '@angular/core';
import {
  AccordionComponent,
  AccordionItemComponent,
  ButtonComponent,
  HeaderComponent,
  StatusComponent,
  TableComponent,
  type TableData,
} from '@drv-ds/drv-design-system-ng';

@Component({
  selector: 'app-home',
  imports: [
    AccordionComponent,
    AccordionItemComponent,
    ButtonComponent,
    HeaderComponent,
    StatusComponent,
    TableComponent,

  ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.scss',
})
export class HomeComponent {
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
