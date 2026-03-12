import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { CONFIG_TOKEN, DEFAULT_CONFIG_PRODUCTIVE } from '@drv-ds/drv-design-system-ng';
import { httpLoggingInterceptor } from './core/http-logging.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpLoggingInterceptor])),
    {
      provide: CONFIG_TOKEN,
      useValue: {
        DEFAULT_CONFIG_PRODUCTIVE,
        spritePath: './assets/img/sprite.svg'
      }
    }
  ]
};
