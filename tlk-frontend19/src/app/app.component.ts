import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FooterComponent} from '@drv-ds/drv-design-system-ng';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tlk-frontend19';
}
