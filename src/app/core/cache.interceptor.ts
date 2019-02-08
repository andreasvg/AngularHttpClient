
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { HttpCacheService } from 'app/services/http-cache.service';
import { tap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class CacheInterceptor implements HttpInterceptor {
  constructor(private cache: HttpCacheService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const cachedItem = this.cache.get(req.url);
    if (cachedItem) {
      return of(cachedItem);
    }

    // item not in the cache, fetch from server:
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cache.put(req.url, event);
        }
      })
    )
  }
}
