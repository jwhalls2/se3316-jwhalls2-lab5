import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PoliciesService {
  private policyUrl = environment.apiBaseUrl;
  
  constructor(private router:Router, private http: HttpClient) { }

  getPolicies(){
    return this.http.get(this.policyUrl + '/policy');
  }

  addPolicies(data){
    return this.http.post(this.policyUrl + '/policy',data);
  }

  updatePolicy(id, data){
    return this.http.put(this.policyUrl+'/policy/'+id, data)
  }
}
