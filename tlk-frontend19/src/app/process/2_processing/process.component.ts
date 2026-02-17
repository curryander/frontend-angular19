import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
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
import { StapleFlowService } from '../staple-flow.service';

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
export class ProcessComponent {
  private readonly router = inject(Router);
  private readonly flowService = inject(StapleFlowService);

  cancelFlow(): void {
    this.flowService.resetFlow();
    void this.router.navigate(['/staples']);
  }

  backToUpload(): void {
    void this.router.navigate(['/upload']);
  }

  goToSummary(): void {
    this.flowService.completeProcessing();
    void this.router.navigate(['/summary']);
  }
}
