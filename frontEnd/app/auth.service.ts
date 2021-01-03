import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Users } from './Users';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private SERVER_URL = environment.SERVER_URL;
  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  constructor(private http: HttpClient, private router:Router) { }

  loginUser(createBody){
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json');
    return this.http.post<Users[]>(this.SERVER_URL + '/login', createBody, this.noAuthHeader)
  }

  getUserProfile() {
    return this.http.get<Users[]>(this.SERVER_URL + '/secure/user-detail');
  }

  setAdmin(check:string){
    localStorage.setItem('admin',check);
  }

  getAdmin(){
    return localStorage.getItem('admin');
  }
  checkAdmin(){
    let admin = this.getAdmin();
    if(admin=="true"){
      return true;
    }
    return false;
  }

  setToken(token:string){
    localStorage.setItem('token',token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken(){
    localStorage.removeItem('token');
  }

  getUserPayload(){
    let token = this.getToken();
    if(token){
      let userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else{
      return null;
    }
  }

  isLoggedIn(){
    let userPayload = this.getUserPayload();
    if(userPayload){
      return userPayload.exp > Date.now()/1000
    }
    else{
      return false;
    } 
  }

  getAllUsers(){
    return this.http.get<[]>(this.SERVER_URL + '/secure/users');
  }

  getUser(username:string){
    const url = `${this.SERVER_URL}/secure/user/${username}`;
    return this.http.get<String>(url);
  }

  editUser(username:string, updatedBody){
    const url = `${this.SERVER_URL}/secure/user/${username}`;

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json');

    return this.http.put<[]>(url, updatedBody);
  }

  changePassword(username:string, editBody){
    const url = `${this.SERVER_URL}/secure/changePassword/${username}`;
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json');
    return this.http.put<Users[]>(url, editBody)

  }

  


}




