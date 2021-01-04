import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserService } from '../../shared/user.service'

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  showSucessMessage: boolean;
  serverErrorMessages: string;

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  google(){
    window.location.href='https://accounts.google.com/ServiceLogin/signinchooser?elo=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin';
  }

  submitForm(form){
      
    const name = form.value.name.replace(/<[^>]*>?/gm, '');
    const password = form.value.password.replace(/<[^>]*>?/gm, '');
    const username = form.value.username.replace(/<[^>]*>?/gm, '');
  if(name.length < 1){
    alert("Please enter your full name");
 }

 else if(name.length<=5){
  alert("Please enter a name greather than 5 characters.");
}

   else if(password.length < 1){
    alert("Please enter a password!");
 }

  else if(password.length<=6){
    alert("Please enter a password of at least 6 characters!")
 }

 else if(username.length < 1){
   alert("Please enter a username!");
 }

 else if(form.value.email == ""){
  alert("Please enter an email address!");
}

else if(!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(form.value.email))){
  alert("Invalid Email Address");
}  else{
    
  this.userService.postUser(form.value).subscribe(
      res => {
          alert("Account added!");
      },
      err => {
          alert("Could not create account! Username or email may be in use!")
      }
  )
}  
  }



}