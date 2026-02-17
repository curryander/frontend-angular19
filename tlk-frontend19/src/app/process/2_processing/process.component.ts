import { Component } from '@angular/core';
import {
  AccordionComponent,
  AccordionItemComponent,
  ApplicationHeaderComponent,
  ButtonComponent,
  ButtonbarComponent,
  ColDirective,
  GridDirective,
  ProgressnavComponent,
  ProgressnavNodeComponent,
  RowDirective,
  StatusComponent,
} from '@drv-ds/drv-design-system-ng';

@Component({
  selector: 'app-process',
  imports: [
    AccordionComponent,
    AccordionItemComponent,
    ApplicationHeaderComponent,
    ButtonComponent,
    ButtonbarComponent,
    ColDirective,
    GridDirective,
    ProgressnavComponent,
    ProgressnavNodeComponent,
    RowDirective,
    StatusComponent,
  ],
  templateUrl: './process.component.html',
  standalone: true,
  styleUrl: './process.component.scss',
})
export class ProcessComponent {}
