import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {
  private passUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  changePassword(password: string, username: string){
    const body = {
      password: password
    }
return this.http.put<[]>(this.passUrl + `/secure/changePassword/${username}`, body);
  }
}
