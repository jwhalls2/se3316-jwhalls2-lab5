import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {Schedule} from './schedule';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {

  //Change URL back when you want to NG build.
  private scheduleUrl = 'http://localhost:3000/api/schedules';
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      if(operation == 'getSchedule' || operation == 'deleteSchedule'){

        alert("Invalid! Schedule with that name does not exist!");
      
      };
  
      // Let the app keep running by returning an empty result.
      return;
    };
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getSchedules(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(this.scheduleUrl);
  }

  getSchedule(schedule_name: string): Observable<Schedule[]>{
    const url = `${this.scheduleUrl}/${schedule_name}`;
    return this.http.get<Schedule[]>(url).pipe(
      catchError(this.handleError<Schedule[]>('getSchedule', []))
    );

    
  }

  deleteSchedule(delete_schedule_name: string): Observable<Schedule[]>{
    const url = `${this.scheduleUrl}/${delete_schedule_name}`;
    return this.http.delete<Schedule[]>(url).pipe(
      catchError(this.handleError<Schedule[]>('deleteSchedule', []))
    );
  }

  deleteAllSchedules(): Observable<Schedule[]>{
    return this.http.delete<Schedule[]>(this.scheduleUrl);
  }

  createSchedule(newSchedule: Schedule){
    return this.http.post<Schedule>(this.scheduleUrl, newSchedule, this.httpOptions);
  }

  updateSchedule(updatedSchedule: Schedule){
    return this.http.put<Schedule>(this.scheduleUrl, updatedSchedule, this.httpOptions);
  }
}


