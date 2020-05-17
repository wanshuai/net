import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, BehaviorSubject, from } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { Slot, Magic, Minutes, Res } from '../common/params';
import { StorageService } from './storage.service';

const httpOptions = {
  headers: new HttpHeaders()
    .set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8')
};

@Injectable({
  providedIn: 'root'
})
export class ConjureService {

  private url: string = "http://api.net.gfuzy.com"
  private data: Magic
  data$: BehaviorSubject<Magic> =  new BehaviorSubject(<Magic>{});

  constructor( 
    private http: HttpClient,
    private storage: StorageService
  ) { 
    this.data$.subscribe(res=>{this.data=res;})
  }

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
      .toPromise()
      .then((res) => {
        if(res.status===200){
          this.data$.next(<Magic>res.data)
        }
        return res
      })
    return from(rst);
  }

  add(data: string): Observable<Res> {
    let rst = this.http.post<Res>(this.url+"/add", data, httpOptions)
      .pipe(
        retry(2),
        catchError((error) => this.handleError(error))
      )
      .toPromise()
      .then((res) => {
        if(res.status===200){
          this.data.slot.unshift(<Slot>res.data)
          this.data$.next(this.data)
        }
        return res
      })
    return from(rst);
  }

  edit(data: string, index: number): Observable<Res> {
    let rst = this.http.post<Res>(this.url+"/edit", data, httpOptions)
      .pipe(
        retry(2),
        catchError((error) => this.handleError(error))
      )
      .toPromise()
      .then((res) => {
        if(res.status===200){
          let item = this.data.slot.findIndex((val)=>{return val.item == index})
          let data = <Minutes>res.data
    
          this.data.minutes = data.total
          this.data.slot[item].minutes = data.new
          this.data$.next(this.data)
        }
        return res
      })
    return from(rst);
  }

  getData(): Observable<Res> {
    let rst = this.http.post<Res>(this.url+"/magic", "order="+this.storage.get("order"), httpOptions)
      .pipe(
        retry(2),
        catchError((error) => this.handleError(error))
      )
      .toPromise()
      .then((res) => {
        if(res.status===200){
          this.data$.next(<Magic>res.data)
        }
        return res
      })
    return from(rst);
  }

  delete(data: string, index: number): Observable<Res> {
    let rst = this.http.post<Res>(this.url+"/delete", data, httpOptions)
      .pipe(
        retry(2),
        catchError((error) => this.handleError(error))
      )
      .toPromise()
      .then((res) => {
        if(res.status===200){
          this.data.slot = this.data.slot.filter(list=>list.item!=index)
          let data = <Minutes>res.data
          this.data.minutes = data.total
          this.data$.next(this.data)
        }
        return res
      });
    return from(rst);
  }
}
