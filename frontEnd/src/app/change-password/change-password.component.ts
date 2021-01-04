import { Component, OnInit } from '@angular/core';
import { ChangePasswordService } from '../change-password.service';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  currentUser = this.userService.selectedUser;

  constructor(private userService: UserService, private changePasswordService: ChangePasswordService) { }

  ngOnInit(): void {
  }


  changePassword(newPass: string){
    if(newPass.length < 6){
      alert("Please enter a longer password!");
      return;
    }

    this.changePasswordService.changePassword(newPass, this.currentUser.username).subscribe();
  }
}
