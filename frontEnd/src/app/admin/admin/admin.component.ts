import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/admin.service';
import { UserService } from '../../shared/user.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  currentUser = this.userService.selectedUser;
  reviewsArray = new Array;

  constructor(private userService: UserService, private adminService: AdminService) { }

  ngOnInit(): void {
  }


  getReviews(){
    this.adminService.getReviews(this.currentUser.username).subscribe(data => {this.reviewsArray = data}, err => {
      alert(err.error.message);
    });
    console.log("Reviews array: " + this.reviewsArray);
  }

  editReview(reviewTitle: string, hiddenValue: string){

    let hiddenUpdate;
    if(hiddenValue == "yes"){
      hiddenUpdate = true;
    } else{
      hiddenUpdate = false;
    }
    const editReviewData = {
      user: this.currentUser.username,
      title: reviewTitle,
      hidden: hiddenUpdate
    }
    this.adminService.editReview(editReviewData).subscribe(data => {this.reviewsArray = data}, err => {
      alert("Error!");
    });

  }

  changeUser(username: string, activateInput: string, admin: string){

    let activePass = false;
    let administrator;
    if(activateInput == "true"){
      activePass = true;
    } else{
      activePass = false;
    }

    if(admin == "true"){
      administrator = true;
    } else{
      administrator = false;
    }

    const userData = {
      adminName: this.currentUser.username,
      username: username,
      activated: activePass,
      admin: administrator
    }
    console.log(userData);
    this.adminService.changeUser(userData).subscribe();
    alert("Changed user!");

  }
}
