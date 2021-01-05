import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PoliciesService } from '../policies.service';
import { UserService } from '../shared/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-policies',
  templateUrl: './edit-policies.component.html',
  styleUrls: ['./edit-policies.component.css']
})
export class EditPoliciesComponent implements OnInit {
  dmca: Object;
  id: string;
  display: Boolean = false;
  obs: Boolean = false;
  firstPol: string;
  secondPol: string;
  thirdPol: string;
  currentUser = this.userService.selectedUser;
  constructor(private route: Router, private policiesService: PoliciesService, private userService: UserService) { }

  ngOnInit(): void {
    this.getPolicies();
  }

  getPolicies(){
    this.policiesService.getPolicies().subscribe(data=>{
      this.dmca=data;
    })
  }

  edit(id){
    if(!this.currentUser.admin){
      alert("You must be an admin to edit policies!");
      return;
    }
    this.id = id;
    this.display = true;
  }
  addNew(){
    if(!this.currentUser.admin){
      alert("You must be an admin to create new policies!");
      return;
    }
    this.obs = true;
  }

  newPolicy(){
    if(!this.currentUser.admin){
      alert("You must be an admin to create new policies!");
      return;
    }
    let newPol = {
      policyOne: this.firstPol,
      policyTwo: this.secondPol,
      policyThree: this.thirdPol
    }
    
      this.policiesService.addPolicies(newPol).subscribe(data => {
      window.location.reload();
    });
    
  }

  postChanges(){
    if(!this.currentUser.admin){
      alert("You must be an admin to edit policies!");
      return;
    }
    let changes = {
      policyOne: this.firstPol,
      policyTwo: this.secondPol,
      policyThree: this.thirdPol
    }

    this.policiesService.updatePolicy(this.id, changes).subscribe(data => {
      window.location.reload();
    });
  }
}
