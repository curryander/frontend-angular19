import { HttpErrorResponse, HttpEvent, HttpEventType, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { tap } from 'rxjs/operators';

export const httpLoggingInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isDevMode()) {
    return next(req);
  }

  const startedAt = performance.now();
  console.groupCollapsed(`[HTTP] ${req.method} ${req.urlWithParams}`);
  console.log('Request', {
    method: req.method,
    url: req.urlWithParams,
    headers: req.headers.keys().reduce<Record<string, string | null>>((acc, key) => {
      acc[key] = req.headers.get(key);
      return acc;
    }, {}),
    body: req.body,
  });
  console.groupEnd();

  return next(req).pipe(
    tap({
      next: (event: HttpEvent<unknown>) => {
        if (event.type !== HttpEventType.Response) {
          return;
        }

        const response = event as HttpResponse<unknown>;
        const durationMs = Math.round(performance.now() - startedAt);
        console.groupCollapsed(`[HTTP] ${req.method} ${req.urlWithParams} -> ${response.status} (${durationMs} ms)`);
        console.log('Response', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          body: response.body,
        });
        console.groupEnd();
      },
      error: (error: unknown) => {
        const durationMs = Math.round(performance.now() - startedAt);
        const httpError = error as HttpErrorResponse;
        console.groupCollapsed(`[HTTP] ${req.method} ${req.urlWithParams} -> ERROR (${durationMs} ms)`);
        console.error('Response Error', {
          status: httpError.status,
          statusText: httpError.statusText,
          url: httpError.url,
          message: httpError.message,
          error: httpError.error,
        });
        console.groupEnd();
      },
    }),
  );
};
