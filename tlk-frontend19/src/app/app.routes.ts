import { Routes } from '@angular/router';
import { processStepGuard, summaryStepGuard } from './process/staple-flow.guards';

export const routes: Routes = [
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
    path: '',
    loadComponent: () => import('./pages/pages.component').then((m) => m.PagesComponent),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'staples',
        loadComponent: () => import('./pages/staples/staples.component').then((m) => m.StaplesComponent),
      },
      {
        path: 'history',
        loadComponent: () => import('./pages/history/history.component').then((m) => m.HistoryComponent),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];


