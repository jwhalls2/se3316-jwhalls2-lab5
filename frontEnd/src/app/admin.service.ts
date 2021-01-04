import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private adminUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getReviews(username: string){
    
    return this.http.get<[]>(this.adminUrl + `/admin/reviews/${username}`);
  }

  editReview(reviewData: any){
    console.log(reviewData);
    return this.http.put<[]>(this.adminUrl + `/admin/reviews`, reviewData);
  }
}
