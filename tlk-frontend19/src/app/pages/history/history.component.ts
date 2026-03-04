import { Component } from '@angular/core';
import {
  AccordionComponent,
  AccordionItemComponent,
  ButtonComponent,
  ContentpageComponent,
  DetailsComponent,
  MediaComponent,
  StatusComponent,
  TableComponent,
  TablistComponent,
  TabpanelComponent,
  type TableData,
  TileComponent,
} from '@drv-ds/drv-design-system-ng';

@Component({
  selector: 'app-history',
  imports: [
    ContentpageComponent,
    StatusComponent,
    ButtonComponent,
    AccordionComponent,
    AccordionItemComponent,
    TableComponent,
    MediaComponent,
    TileComponent,
    TablistComponent,
    TabpanelComponent,
    DetailsComponent,
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
  standalone: true,
})
export class HistoryComponent {
  showExtendedChronology = false;

  readonly milestoneTableData: TableData = {
    header: [
      { label: 'Jahr' },
      { label: 'Meilenstein' },
      { label: 'Historische Einordnung' },
      { label: 'Wirkung für Versicherte' },
    ],
    body: [
      ['1889', 'Invaliditäts- und Altersversicherung', 'Ausbau der Bismarckschen Sozialgesetzgebung', 'Erster staatlicher Rahmen gegen Altersarmut von Arbeitern'],
      ['1911', 'Reichsversicherungsordnung (RVO)', 'Systematische Zusammenführung von Versicherungsnormen', 'Mehr Einheitlichkeit bei Verfahren und Leistungen'],
      ['1957', 'Rentenreform (dynamische Rente)', 'Neuordnung in der jungen Bundesrepublik', 'Renten orientieren sich stärker an der Lohnentwicklung'],
      ['1992', 'SGB VI', 'Modernisierung des Rentenrechts nach Wiedervereinigung', 'Klarere Strukturen bei Rentenarten und Ansprüchen'],
      ['2005', 'Einheitliche Marke Deutsche Rentenversicherung', 'Organisationsreform der Träger', 'Bessere Orientierung und bundesweit konsistenter Auftritt'],
      ['2014', 'Neuregelungen für langjährig Versicherte', 'Anpassung an Arbeitsbiografien', 'Neue Wege in den Ruhestand unter bestimmten Voraussetzungen'],
      ['2021', 'Grundrente', 'Sozialpolitische Weiterentwicklung', 'Aufwertung niedriger Renten trotz langer Versicherungszeit'],
      ['Heute', 'Digitalisierung der Leistungen', 'Transformation von Verwaltung und Service', 'Online-Anträge, Auskunft und sichere Kommunikation'],
    ],
  };

  readonly reformTableData: TableData = {
    header: [
      { label: 'Themenfeld' },
      { label: 'Historischer Konflikt' },
      { label: 'Lösungsansatz' },
      { label: 'Langfristige Bedeutung' },
    ],
    body: [
      ['Finanzierung', 'Kapitalverluste nach Krieg und Währungsumstellung', 'Stärkere Umlageorientierung', 'System bleibt an Erwerbstätigkeit und Beitragspflicht gekoppelt'],
      ['Leistungsniveau', 'Abstand zwischen Lohn- und Renteneinkommen', 'Dynamisierung und regelmäßige Anpassung', 'Teilhabegedanke wird gestützt'],
      ['Demografie', 'Steigende Lebenserwartung', 'Mehrstufige Reformen und Beitragssatzsteuerung', 'Fortlaufende Balance zwischen Generationen'],
      ['Strukturen', 'Historisch getrennte Träger', 'Institutionelle Zusammenführung', 'Einheitlichere Kundenwege und Kommunikation'],
      ['Service', 'Papier- und Präsenzverfahren', 'Digitale Portale und medienbrucharme Prozesse', 'Schnellerer Zugang zu Informationen und Leistungen'],
    ],
  };

  readonly reunificationTableData: TableData = {
    header: [
      { label: 'Phase' },
      { label: 'Westdeutschland (alte Länder)' },
      { label: 'Ostdeutschland (neue Länder)' },
      { label: 'Rentenpolitische Folge' },
    ],
    body: [
      ['Vor 1990', 'Rentenrecht der Bundesrepublik mit gewachsenen Erwerbsbiografien', 'Eigenständiges DDR-System mit anderen Lohn- und Beitragslogiken', 'Hoher Überführungs- und Harmonisierungsbedarf nach der Einheit'],
      ['1990 bis 1992', 'Übergangsrecht und Anpassungen im bestehenden System', 'Integration von Ansprüchen und Zeiten in bundesdeutsche Verfahren', 'Komplexe Überleitung von Rechtspositionen und Daten'],
      ['1992 bis 2005', 'Anwendung SGB VI und regelmäßige Reformen', 'Schrittweise Angleichung der Rechengrößen und Leistungszugänge', 'Langfristiger Angleichungsprozess über mehrere Reformstufen'],
      ['Seit 2005', 'Einheitliche Organisationsmarke Deutsche Rentenversicherung', 'Gleiche institutionelle Marke und Prozesse, regionale Besonderheiten bleiben', 'Bessere Transparenz, dennoch anhaltender Anpassungsbedarf in einzelnen Biografien'],
      ['Heute', 'Stabile digitale Verwaltungswege', 'Höhere digitale Reichweite in Auskunft und Antrag', 'Gemeinsame Plattformen mit differenzierter Fallbearbeitung'],
    ],
  };

  readonly financeComparisonData: TableData = {
    header: [
      { label: 'Aspekt' },
      { label: 'Umlageverfahren' },
      { label: 'Kapitaldeckung' },
      { label: 'Einordnung für Deutschland' },
    ],
    body: [
      ['Finanzierungsquelle', 'Laufende Beiträge finanzieren laufende Renten', 'Ansparung von Kapital für spätere Auszahlungen', 'Gesetzliche Rente ist primär umlagefinanziert'],
      ['Abhängigkeit', 'Arbeitsmarkt, Lohnsumme, Beschäftigung', 'Kapitalmarkt, Zinsen, Renditepfade', 'Deutschland kombiniert Umlage mit zusätzlicher Vorsorge'],
      ['Stärken', 'Direkte Generationensolidarität, schnelle Mittelverwendung', 'Individuelle Vermögensbildung möglich', 'Mix kann Risiken breiter verteilen'],
      ['Risiken', 'Demografischer Druck bei weniger Beitragszahlern', 'Marktrisiken und Schwankungen', 'Politik steuert über Beitrag, Rentenformel und Förderinstrumente'],
      ['Sozialpolitische Rolle', 'Sichert Basis im Alter breit ab', 'Ergänzende Zusatzsicherung', 'Mehrsäulensystem als Leitbild'],
    ],
  };

  readonly extendedChronology: Array<{ year: string; event: string }> = [
    { year: '1883', event: 'Krankenversicherung als erster Baustein der Sozialversicherung' },
    { year: '1884', event: 'Unfallversicherung folgt als zweiter Baustein' },
    { year: '1889', event: 'Invaliditäts- und Altersversicherung beschlossen' },
    { year: '1891', event: 'Praktischer Start der Alters- und Invaliditätssicherung' },
    { year: '1911', event: 'Reichsversicherungsordnung schafft einheitlichen Rechtsrahmen' },
    { year: '1957', event: 'Rentenreform: Dynamische Rente wird politisch verankert' },
    { year: '1972', event: 'Ausbau von Leistungsansprüchen in der Bundesrepublik' },
    { year: '1990', event: 'Weg zur deutschen Einheit und Überleitungsfragen im Rentenrecht' },
    { year: '1992', event: 'SGB VI ordnet das Rechtssystem neu' },
    { year: '2001', event: 'Ergänzende private Vorsorge wird gefördert' },
    { year: '2005', event: 'Einheitliche Deutsche Rentenversicherung entsteht' },
    { year: '2021', event: 'Grundrente tritt in Kraft' },
    { year: 'Heute', event: 'Digitale Konten, Online-Verfahren und datenbasierte Services' },
  ];

  readonly glossary: Array<{ title: string; text: string }> = [
    {
      title: 'Umlageverfahren',
      text: 'Finanzierungsprinzip der gesetzlichen Rente, bei dem die laufenden Beiträge der Erwerbstätigen direkt für die aktuellen Rentenzahlungen verwendet werden.',
    },
    {
      title: 'Entgeltpunkte',
      text: 'Zentrale Rechengröße im deutschen Rentenrecht. Sie bilden das Verhältnis des eigenen beitragspflichtigen Einkommens zum Durchschnittseinkommen eines Jahres ab.',
    },
    {
      title: 'Rentenanpassung',
      text: 'Regelmäßige Anpassung der Rentenwerte, die sich unter anderem an Lohnentwicklung und gesetzlich festgelegten Dämpfungs- bzw. Sicherungsfaktoren orientiert.',
    },
    {
      title: 'Grundrente',
      text: 'Leistungsaufwertung für Versicherte mit langen Versicherungszeiten und unterdurchschnittlichem Einkommen, um niedrige Rentenansprüche sozialpolitisch zu stärken.',
    },
    {
      title: 'Rentenversicherungskonto',
      text: 'Dokumentation aller relevanten Versicherungszeiten und Beitragszeiten. Es bildet die Grundlage für korrekte Auskünfte und spätere Rentenbescheide.',
    },
    {
      title: 'Erwerbsminderungsrente',
      text: 'Rentenart für Versicherte, die aus gesundheitlichen Gründen nicht mehr oder nur noch eingeschränkt arbeiten können.',
    },
  ];

  readonly bismarckImage = {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Otto%20von%20Bismarck%20portrait%201873.jpg',
    width: 350,
    height: 500,
    alt: 'Porträt von Otto von Bismarck (1873)',
    loading: 'lazy' as const,
    lightbox: false,
  };

  readonly legalTextImage = {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Deutsches%20Reichsgesetzblatt%201911%20003%200025.png',
    width: 2720,
    height: 3352,
    alt: 'Seite aus dem Reichsgesetzblatt 1911',
    loading: 'lazy' as const,
    lightbox: false,
  };

  readonly drvBuildingImage = {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Geb%C3%A4ude%20der%20Deutschen%20Rentenversicherung%20Bund%20seen%20from%20Drachenberg%20Grunewald%202021-10-28%2037.jpg',
    width: 8368,
    height: 5584,
    alt: 'Gebäude der Deutschen Rentenversicherung Bund in Berlin',
    loading: 'lazy' as const,
    lightbox: false,
  };

  readonly reunificationImage = {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bundesarchiv%20Bild%20183-1990-1003-400%2C%20Berlin%2C%20deutsche%20Vereinigung%2C%20vor%20dem%20Reichstag.jpg',
    width: 800,
    height: 533,
    alt: 'Feier zur deutschen Einheit vor dem Reichstag 1990',
    loading: 'lazy' as const,
    lightbox: false,
  };

  toggleChronology(): void {
    this.showExtendedChronology = !this.showExtendedChronology;
  }
}




