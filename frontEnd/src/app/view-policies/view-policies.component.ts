import { PolicyService } from '../policy.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-policies',
  templateUrl: './view-policies.component.html',
  styleUrls: ['./view-policies.component.css']
})
export class ViewPolicyComponent implements OnInit {
  policies: Object;
  constructor(private route: Router, private policyService:PolicyService) { }

  ngOnInit(): void {
    this.getDmca();
  }

  getDmca(){
    this.policyService.getPolicies().subscribe(data=>{
      console.log(data);
      this.policies = data;
    })
  }

}
