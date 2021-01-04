import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private url = environment.apiBaseUrl;
  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  constructor(private http: HttpClient, private router:Router) { }

  getPolicies(){
    return this.http.get(this.url + '/policy');
  }

  addPolicies(data){
    return this.http.post(this.url + '/policy',data);
  }

  updatePolicy(id, data){
    return this.http.put(this.url+'/policy/'+id, data)
  }


}
