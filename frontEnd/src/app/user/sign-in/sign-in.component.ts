import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../shared/user.service'

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  showSucessMessage: boolean;
  serverErrorMessages: string;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  google(){
    window.location.href='https://accounts.google.com/ServiceLogin/signinchooser?elo=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin';
  }

  submitForm(form){
      
  if(form.value.email.length < 1){
    alert("Please enter an email address!");
 }
 else if(form.value.password.length < 1){
    alert("Please enter a password!");
 }
 else if(!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(form.value.email))){
    alert("Invalid Email Address");
  }
 else{
    
    this.userService.login(form.value).subscribe(res => {
        this.userService.setToken(res['token']);
        alert("Sign in successful! Redirecting!");
        this.router.navigateByUrl('/course-list');
    },
    err =>{
        this.serverErrorMessages = err.error.message;
        alert(this.serverErrorMessages);
    })
 }
}
}