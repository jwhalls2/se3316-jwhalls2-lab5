import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Course} from './course';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  // Change URL back when you go to NG build it.
  private courseUrl = 'http://localhost:3000/api/courseData/open';

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getCourses(): Observable<Course[]>{
    return this.http.get<Course[]>(this.courseUrl, this.noAuthHeader);
  }

  getCourseByKey(keyword: string): Observable<Course[]>{
    const url = `${this.courseUrl}/keyword/${keyword}`
    return this.http.get<Course[]>(url, this.noAuthHeader);
  }

  getFilteredCourses(subject: string, catalog_nbr: string, ssr_component: string): Observable<Course[]> {
    const url = `${this.courseUrl}/${subject}/${catalog_nbr}/${ssr_component}?`;
    return this.http.get<Course[]>(url, this.noAuthHeader);
  }

  getCoursesBySubject(subject: string): Observable<Course[]> {
    const url = `${this.courseUrl}/${subject}`;
    return this.http.get<Course[]>(url, this.noAuthHeader);
  }

  getCoursesByNumber(catalog_nbr: string): Observable<Course[]> {
    const url = `${this.courseUrl}/course_catalog/${catalog_nbr}`;
    return this.http.get<Course[]>(url, this.noAuthHeader);
  }
}
