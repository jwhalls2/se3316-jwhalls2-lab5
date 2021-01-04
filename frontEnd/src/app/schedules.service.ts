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
  private token = localStorage.getItem("token");
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
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
    const url = `${this.scheduleUrl}/open`;
    return this.http.get<Schedule[]>(url);
  }

  getSchedule(schedule_name: string, username: string): Observable<Schedule[]>{
    const url = `${this.scheduleUrl}/secure/${schedule_name}/${username}`;
    return this.http.get<Schedule[]>(url);

    
  }

  deleteSchedule(delete_schedule_name: string, username: string): Observable<Schedule[]>{
    const url = `${this.scheduleUrl}/secure/${delete_schedule_name}/${username}`;
    return this.http.delete<Schedule[]>(url).pipe(
      catchError(this.handleError<Schedule[]>('deleteSchedule', []))
    );
  }

  deleteAllSchedules(username: string): Observable<Schedule[]>{
    const url = `${this.scheduleUrl}/secure/${username}`
    return this.http.delete<Schedule[]>(url);
  }

  createSchedule(newSchedule: Schedule){
    const url = `${this.scheduleUrl}/secure`
    return this.http.post<Schedule>(url, newSchedule, this.httpOptions);
  }

  updateSchedule(updatedSchedule: Schedule){
    const url = `${this.scheduleUrl}/secure`
    return this.http.put<Schedule>(url, updatedSchedule, this.httpOptions);
  }
}


