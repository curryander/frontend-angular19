import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@drv-ds/drv-design-system-ng';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss',
})
export class PagesComponent {}
