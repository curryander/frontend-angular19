import { Routes } from '@angular/router';
import { processStepGuard, summaryStepGuard } from './process/staple-flow.guards';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'staples',
    loadComponent: () => import('./pages/staples/staples.component').then((m) => m.StaplesComponent),
  },
  {
    path: 'upload',
    loadComponent: () => import('./process/1_upload/upload.component').then((m) => m.UploadComponent),
  },
  {
    path: 'process',
    canActivate: [processStepGuard],
    loadComponent: () => import('./process/2_processing/process.component').then((m) => m.ProcessComponent),
  },
  {
    path: 'summary',
    canActivate: [summaryStepGuard],
    loadComponent: () => import('./process/3_summary/summary.component').then((m) => m.SummaryComponent),
  },
  {
    path: 'overview',
    loadComponent: () => import('./pages/overview/overview.component').then((m) => m.OverviewComponent),
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
