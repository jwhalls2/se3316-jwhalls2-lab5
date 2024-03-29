import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  
  private reviewUrl = environment.apiBaseUrl;
  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  constructor(private http: HttpClient) { }

  addNewReview(createBody){
    return this.http.post<[]>(this.reviewUrl + '/secure/review', createBody);
  }

  getAllReviews(){
    return this.http.get<[]>(this.reviewUrl + '/open/allReviews', this.noAuthHeader);
  }

  getReview(title:string){
    const url = `${this.reviewUrl}/secure/review/${title}`;
    return this.http.get<String>(url);
  }

  editReview(title:string, updatedBody){
    const url = `${this.reviewUrl}/secure/review/${title}`;
    return this.http.put<[]>(url, updatedBody);
  }




}
