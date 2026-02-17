import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'upload',
    loadComponent: () => import('./process/1_upload/upload.component').then((m) => m.UploadComponent),
  },
  {
    path: 'summary',
    loadComponent: () => import('./process/3_summary/summary.component').then((m) => m.SummaryComponent),
  },
  {
    path: 'overview',
    loadComponent: () => import('./pages/overview/overview.component').then((m) => m.OverviewComponent),
  },
  {
    path: 'process',
    loadComponent: () => import('./process/2_processing/process.component').then((m) => m.ProcessComponent),
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
