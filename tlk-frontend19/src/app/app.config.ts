import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {CONFIG_TOKEN, DEFAULT_CONFIG_PRODUCTIVE} from '@drv-ds/drv-design-system-ng';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: CONFIG_TOKEN,
      useValue: {
        DEFAULT_CONFIG_PRODUCTIVE,
        spritePath: './assets/img/sprite.svg'
      }
    }
  ]
};
