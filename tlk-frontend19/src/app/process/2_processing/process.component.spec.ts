import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessComponent } from './process.component';
import { StapleFlowService } from '../staple-flow.service';

describe('ProcessComponent', () => {
  let component: ProcessComponent;
  let fixture: ComponentFixture<ProcessComponent>;
  let flowService: jasmine.SpyObj<StapleFlowService>;

  beforeEach(async () => {
    flowService = jasmine.createSpyObj<StapleFlowService>('StapleFlowService', [
      'getCaseNumber',
      'getCapturedAt',
      'getWorkflowStatus',
      'getWorkflowProgressPercent',
      'canEnterSummary',
      'canTriggerLlmProcessing',
      'refreshResults',
      'getPageResults',
      'getSidebarPages',
      'getVorgangResults',
      'getPagePdfObjectUrl',
      'clearPagePdfObjectUrls',
      'resetFlow',
      'triggerLlmProcessing',
    ]);

    flowService.getCaseNumber.and.returnValue('VS-2026-123456');
    flowService.getCapturedAt.and.returnValue('25.03.2026');
    flowService.getWorkflowStatus.and.returnValue('IN_PROGRESS');
    flowService.getWorkflowProgressPercent.and.returnValue(50);
    flowService.canEnterSummary.and.returnValue(false);
    flowService.canTriggerLlmProcessing.and.returnValue(false);
    flowService.refreshResults.and.resolveTo();
    flowService.getPageResults.and.returnValue([]);
    flowService.getSidebarPages.and.resolveTo([]);
    flowService.getVorgangResults.and.returnValue({
      vorgangId: 'vorgang-1',
      vorgangStatus: 'IN_PROGRESS',
      stapelId: 'stapel-1',
      stapelName: 'Stapel 1',
      stapelStatus: 'IN_PROGRESS',
    });
    flowService.getPagePdfObjectUrl.and.resolveTo('blob:test');

    await TestBed.configureTestingModule({
      imports: [ProcessComponent],
      providers: [{ provide: StapleFlowService, useValue: flowService }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to markdown extraction output', () => {
    component.pages = [
      {
        pageId: 'page-1',
        pageNo: 1,
        status: 'DONE',
        errorMessage: '',
        text: 'plain text',
        markdown: '# markdown',
        doclingJson: '{\n  "value": true\n}',
        extractLoaded: true,
        hasExtract: true,
      },
    ];
    component.sidebarPages = [
      {
        pageId: 'page-1',
        pageNo: 1,
        status: 'DONE',
        errorMessage: '',
        usable: true,
      },
    ];

    expect(component.selectedExtractionView).toBe('markdown');
    expect(component.selectedExtractionContent).toBe('# markdown');
  });

  it('should switch between text, markdown and json extraction outputs', () => {
    component.pages = [
      {
        pageId: 'page-1',
        pageNo: 1,
        status: 'DONE',
        errorMessage: '',
        text: 'plain text',
        markdown: '# markdown',
        doclingJson: '{\n  "value": true\n}',
        extractLoaded: true,
        hasExtract: true,
      },
    ];
    component.sidebarPages = [
      {
        pageId: 'page-1',
        pageNo: 1,
        status: 'DONE',
        errorMessage: '',
        usable: true,
      },
    ];

    component.setExtractionView('text');
    expect(component.selectedExtractionContent).toBe('plain text');

    component.setExtractionView('json');
    expect(component.selectedExtractionContent).toBe('{\n  "value": true\n}');

    component.setExtractionView('markdown');
    expect(component.selectedExtractionContent).toBe('# markdown');
  });
});
