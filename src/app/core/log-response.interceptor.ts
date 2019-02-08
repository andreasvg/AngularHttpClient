
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class LogResponseInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          const elapsed = Date.now() - started;
          console.log(`Request for ${req.urlWithParams} took ${elapsed} ms.`);
        }
      })
    );
  }
}
