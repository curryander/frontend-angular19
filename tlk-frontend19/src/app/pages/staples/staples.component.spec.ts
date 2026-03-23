import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { DokumentenstapelService } from '../../api/api/dokumentenstapel.service';
import { StapleFlowService } from '../../process/staple-flow.service';

import { StaplesComponent } from './staples.component';

describe('StaplesComponent', () => {
  let component: StaplesComponent;
  let fixture: ComponentFixture<StaplesComponent>;
  let dokumentenstapelService: jasmine.SpyObj<DokumentenstapelService>;
  let stapleFlowService: jasmine.SpyObj<StapleFlowService>;

  beforeEach(async () => {
    dokumentenstapelService = jasmine.createSpyObj<DokumentenstapelService>('DokumentenstapelService', [
      'getDokumentenstapel',
      'getDokumentenstapelUpload',
    ]);
    stapleFlowService = jasmine.createSpyObj<StapleFlowService>('StapleFlowService', ['startFlow']);

    dokumentenstapelService.getDokumentenstapel.and.returnValue(of([]));
    dokumentenstapelService.getDokumentenstapelUpload.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [StaplesComponent],
      providers: [
        provideRouter([]),
        { provide: DokumentenstapelService, useValue: dokumentenstapelService },
        { provide: StapleFlowService, useValue: stapleFlowService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StaplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load preview from dokumentenstapel upload response', async () => {
    dokumentenstapelService.getDokumentenstapel.and.returnValue(of(['stapel-1'] as unknown as never[]));
    dokumentenstapelService.getDokumentenstapelUpload.and.returnValue(of({
      id: 'stapel-1',
      stapelName: 'Upload Stapel',
      seitenAnzahl: 4,
      uploadPdf: 'JVBERi0xLjQK',
    }));

    const freshFixture = TestBed.createComponent(StaplesComponent);
    const freshComponent = freshFixture.componentInstance;
    freshFixture.detectChanges();
    await freshFixture.whenStable();

    await freshComponent.showPreview(freshComponent.stapleDocuments[0]);

    expect(dokumentenstapelService.getDokumentenstapelUpload).toHaveBeenCalledWith('stapel-1');
    expect(freshComponent.activePreviewId).toBe('stapel-1');
    expect(freshComponent.stapleDocuments[0].title).toBe('Upload Stapel');
    expect(freshComponent.stapleDocuments[0].pageCount).toBe(4);
    expect(freshComponent.stapleDocuments[0].downloadUrl?.startsWith('blob:')).toBeTrue();
  });

  it('should build gallery items from dokumentenstapel ids', async () => {
    dokumentenstapelService.getDokumentenstapel.and.returnValue(of(['stapel-1', 'stapel-2'] as unknown as never[]));
    const freshFixture = TestBed.createComponent(StaplesComponent);
    const freshComponent = freshFixture.componentInstance;
    freshFixture.detectChanges();
    await freshFixture.whenStable();

    expect(freshComponent.stapleDocuments.map((doc) => doc.id)).toEqual(['stapel-1', 'stapel-2']);
    expect(freshComponent.stapleDocuments[0].title).toBe('Dokumentenstapel stapel-1');
  });
});
