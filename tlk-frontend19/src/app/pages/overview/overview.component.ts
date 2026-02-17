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
  TileComponent, HeaderComponent,
} from '@drv-ds/drv-design-system-ng';

@Component({
  selector: 'app-overview',
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
    HeaderComponent,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  standalone: true,
})
export class OverviewComponent {
  showExtendedChronology = false;

  readonly milestoneTableData: TableData = {
    header: [
      { label: 'Jahr' },
      { label: 'Meilenstein' },
      { label: 'Historische Einordnung' },
      { label: 'Wirkung fuer Versicherte' },
    ],
    body: [
      ['1889', 'Invaliditaets- und Altersversicherung', 'Ausbau der Bismarckschen Sozialgesetzgebung', 'Erster staatlicher Rahmen gegen Altersarmut von Arbeitern'],
      ['1911', 'Reichsversicherungsordnung (RVO)', 'Systematische Zusammenfuehrung von Versicherungsnormen', 'Mehr Einheitlichkeit bei Verfahren und Leistungen'],
      ['1957', 'Rentenreform (dynamische Rente)', 'Neuordnung in der jungen Bundesrepublik', 'Renten orientieren sich staerker an der Lohnentwicklung'],
      ['1992', 'SGB VI', 'Modernisierung des Rentenrechts nach Wiedervereinigung', 'Klarere Strukturen bei Rentenarten und Anspruechen'],
      ['2005', 'Einheitliche Marke Deutsche Rentenversicherung', 'Organisationsreform der Traeger', 'Bessere Orientierung und bundesweit konsistenter Auftritt'],
      ['2014', 'Neuregelungen fuer langjaehrig Versicherte', 'Anpassung an Arbeitsbiografien', 'Neue Wege in den Ruhestand unter bestimmten Voraussetzungen'],
      ['2021', 'Grundrente', 'Sozialpolitische Weiterentwicklung', 'Aufwertung niedriger Renten trotz langer Versicherungszeit'],
      ['Heute', 'Digitalisierung der Leistungen', 'Transformation von Verwaltung und Service', 'Online-Antraege, Auskunft und sichere Kommunikation'],
    ],
  };

  readonly reformTableData: TableData = {
    header: [
      { label: 'Themenfeld' },
      { label: 'Historischer Konflikt' },
      { label: 'Loesungsansatz' },
      { label: 'Langfristige Bedeutung' },
    ],
    body: [
      ['Finanzierung', 'Kapitalverluste nach Krieg und Waehrungsumstellung', 'Staerkere Umlageorientierung', 'System bleibt an Erwerbstaetigkeit und Beitragspflicht gekoppelt'],
      ['Leistungsniveau', 'Abstand zwischen Lohn- und Renteneinkommen', 'Dynamisierung und regelmaessige Anpassung', 'Teilhabegedanke wird gestuetzt'],
      ['Demografie', 'Steigende Lebenserwartung', 'Mehrstufige Reformen und Beitragssatzsteuerung', 'Fortlaufende Balance zwischen Generationen'],
      ['Strukturen', 'Historisch getrennte Traeger', 'Institutionelle Zusammenfuehrung', 'Einheitlichere Kundenwege und Kommunikation'],
      ['Service', 'Papier- und Praesenzverfahren', 'Digitale Portale und medienbrucharme Prozesse', 'Schnellerer Zugang zu Informationen und Leistungen'],
    ],
  };

  readonly reunificationTableData: TableData = {
    header: [
      { label: 'Phase' },
      { label: 'Westdeutschland (alte Laender)' },
      { label: 'Ostdeutschland (neue Laender)' },
      { label: 'Rentenpolitische Folge' },
    ],
    body: [
      ['Vor 1990', 'Rentenrecht der Bundesrepublik mit gewachsenen Erwerbsbiografien', 'Eigenstaendiges DDR-System mit anderen Lohn- und Beitragslogiken', 'Hoher Ueberfuehrungs- und Harmonisierungsbedarf nach der Einheit'],
      ['1990 bis 1992', 'Uebergangsrecht und Anpassungen im bestehenden System', 'Integration von Anspruechen und Zeiten in bundesdeutsche Verfahren', 'Komplexe Ueberleitung von Rechtspositionen und Daten'],
      ['1992 bis 2005', 'Anwendung SGB VI und regelmaessige Reformen', 'Schrittweise Angleichung der Rechengroessen und Leistungszugaenge', 'Langfristiger Angleichungsprozess ueber mehrere Reformstufen'],
      ['Seit 2005', 'Einheitliche Organisationsmarke Deutsche Rentenversicherung', 'Gleiche institutionelle Marke und Prozesse, regionale Besonderheiten bleiben', 'Bessere Transparenz, dennoch anhaltender Anpassungsbedarf in einzelnen Biografien'],
      ['Heute', 'Stabile digitale Verwaltungswege', 'Hoehere digitale Reichweite in Auskunft und Antrag', 'Gemeinsame Plattformen mit differenzierter Fallbearbeitung'],
    ],
  };

  readonly financeComparisonData: TableData = {
    header: [
      { label: 'Aspekt' },
      { label: 'Umlageverfahren' },
      { label: 'Kapitaldeckung' },
      { label: 'Einordnung fuer Deutschland' },
    ],
    body: [
      ['Finanzierungsquelle', 'Laufende Beitraege finanzieren laufende Renten', 'Ansparung von Kapital fuer spaetere Auszahlungen', 'Gesetzliche Rente ist primaer umlagefinanziert'],
      ['Abhaengigkeit', 'Arbeitsmarkt, Lohnsumme, Beschaeftigung', 'Kapitalmarkt, Zinsen, Renditepfade', 'Deutschland kombiniert Umlage mit zusaetzlicher Vorsorge'],
      ['Staerken', 'Direkte Generationensolidaritaet, schnelle Mittelverwendung', 'Individuelle Vermoegensbildung moeglich', 'Mix kann Risiken breiter verteilen'],
      ['Risiken', 'Demografischer Druck bei weniger Beitragszahlern', 'Marktrisiken und Schwankungen', 'Politik steuert ueber Beitrag, Rentenformel und Foerderinstrumente'],
      ['Sozialpolitische Rolle', 'Sichert Basis im Alter breit ab', 'Ergaenzende Zusatzsicherung', 'Mehrsaeulensystem als Leitbild'],
    ],
  };

  readonly extendedChronology: Array<{ year: string; event: string }> = [
    { year: '1883', event: 'Krankenversicherung als erster Baustein der Sozialversicherung' },
    { year: '1884', event: 'Unfallversicherung folgt als zweiter Baustein' },
    { year: '1889', event: 'Invaliditaets- und Altersversicherung beschlossen' },
    { year: '1891', event: 'Praktischer Start der Alters- und Invaliditaetssicherung' },
    { year: '1911', event: 'Reichsversicherungsordnung schafft einheitlichen Rechtsrahmen' },
    { year: '1957', event: 'Rentenreform: Dynamische Rente wird politisch verankert' },
    { year: '1972', event: 'Ausbau von Leistungsanspruechen in der Bundesrepublik' },
    { year: '1990', event: 'Weg zur deutschen Einheit und Ueberleitungsfragen im Rentenrecht' },
    { year: '1992', event: 'SGB VI ordnet das Rechtssystem neu' },
    { year: '2001', event: 'Ergaenzende private Vorsorge wird gefoerdert' },
    { year: '2005', event: 'Einheitliche Deutsche Rentenversicherung entsteht' },
    { year: '2021', event: 'Grundrente tritt in Kraft' },
    { year: 'Heute', event: 'Digitale Konten, Online-Verfahren und datenbasierte Services' },
  ];

  readonly glossary: Array<{ title: string; text: string }> = [
    {
      title: 'Umlageverfahren',
      text: 'Finanzierungsprinzip der gesetzlichen Rente, bei dem die laufenden Beitraege der Erwerbstaetigen direkt fuer die aktuellen Rentenzahlungen verwendet werden.',
    },
    {
      title: 'Entgeltpunkte',
      text: 'Zentrale Rechengroesse im deutschen Rentenrecht. Sie bilden das Verhaeltnis des eigenen beitragspflichtigen Einkommens zum Durchschnittseinkommen eines Jahres ab.',
    },
    {
      title: 'Rentenanpassung',
      text: 'Regelmaessige Anpassung der Rentenwerte, die sich unter anderem an Lohnentwicklung und gesetzlich festgelegten Daempfungs- bzw. Sicherungsfaktoren orientiert.',
    },
    {
      title: 'Grundrente',
      text: 'Leistungsaufwertung fuer Versicherte mit langen Versicherungszeiten und unterdurchschnittlichem Einkommen, um niedrige Rentenansprueche sozialpolitisch zu staerken.',
    },
    {
      title: 'Rentenversicherungskonto',
      text: 'Dokumentation aller relevanten Versicherungszeiten und Beitragszeiten. Es bildet die Grundlage fuer korrekte Auskuenfte und spaetere Rentenbescheide.',
    },
    {
      title: 'Erwerbsminderungsrente',
      text: 'Rentenart fuer Versicherte, die aus gesundheitlichen Gruenden nicht mehr oder nur noch eingeschraenkt arbeiten koennen.',
    },
  ];

  readonly bismarckImage = {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Otto%20von%20Bismarck%20portrait%201873.jpg',
    width: 350,
    height: 500,
    alt: 'Portraet von Otto von Bismarck (1873)',
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
    alt: 'Gebaeude der Deutschen Rentenversicherung Bund in Berlin',
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
