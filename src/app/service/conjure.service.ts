import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { Res } from '../common/params';

const httpOptions = {
  headers: new HttpHeaders()
    .set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8'),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class ConjureService {

  private url: string = "http://api.net.gfuzy.com"

  constructor( 
    private http: HttpClient,
  ) { }

  private handleError(error: HttpErrorResponse): Observable<Res> {
    // if (error.error instanceof ErrorEvent) {
    //   // A client-side or network error occurred. Handle it accordingly.
    //   console.error('An error occurred:', error.error.message);
    // } else {
    //   // The backend returned an unsuccessful response code.
    //   // The response body may contain clues as to what went wrong,
    //   console.error(
    //     `Backend returned code ${error.status}, ` +
    //     `body was: ${error.error}`);
    // }
    // return an observable with a user-facing error message
    return of({
      status: 0,
      msg: '网络故障，请稍后重试！',
      data: {}
    });
  };

  start(data: string): Observable<Res> {
    let rst = this.http.post<Res>(this.url+"/start", data, httpOptions)
      .pipe(
        retry(2),
        catchError((error) => this.handleError(error))
      )
    return from(rst);
  }

  add(data: string): Observable<Res> {
    let rst = this.http.post<Res>(this.url+"/add", data, httpOptions)
      .pipe(
        retry(2),
        catchError((error) => this.handleError(error))
      )
    return from(rst);
  }

  edit(data: string): Observable<Res> {
    let rst = this.http.post<Res>(this.url+"/edit", data, httpOptions)
      .pipe(
        retry(2),
        catchError((error) => this.handleError(error))
      )
    return from(rst);
  }

  getData(data: string): Observable<Res> {
    let rst = this.http.post<Res>(this.url+"/magic", data, httpOptions)
      .pipe(
        retry(2),
        catchError((error) => this.handleError(error))
      )
    return from(rst);
  }

  delete(data: string): Observable<Res> {
    let rst = this.http.post<Res>(this.url+"/delete", data, httpOptions)
      .pipe(
        retry(2),
        catchError((error) => this.handleError(error))
      )
    return from(rst);
  }
}
