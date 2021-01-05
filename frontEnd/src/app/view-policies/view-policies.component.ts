import { Component, OnInit } from '@angular/core';
import { PoliciesService } from '../policies.service';
import { UserService } from '../shared/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-policies',
  templateUrl: './view-policies.component.html',
  styleUrls: ['./view-policies.component.css']
})
export class ViewPoliciesComponent implements OnInit {

  policies: object;
  constructor(private policiesService: PoliciesService, private userService: UserService) { }

  ngOnInit(): void {
    this.getPolicies();
  }

  getPolicies(){
    this.policiesService.getPolicies().subscribe(data=>{
      console.log(data);
      this.policies = data;
    })
  }

}
