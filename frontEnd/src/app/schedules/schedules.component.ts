import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { SchedulesService } from '../schedules.service';
import {Schedule} from '../schedule';
import { ActivatedRoute } from '@angular/router';
import {Course} from '../course';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnInit {

  schedules: Schedule[];
  newSchedule: Schedule;
  updatedSchedule: Schedule;
  currentUser = this.userService.selectedUser;
  
  publicDef: string;
  scheduleName: string;
  schedule_name: string;
  delete_schedule_name: string;
  editScheduleName: string;
  editScheduleNumber: number;
  subjectCode0: string;
  courseCode: string;
  addCourses: Course[] = [];

  constructor(private location: Location,
    private userService: UserService,
    private schedulesService: SchedulesService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getSchedules();
  }

  getSchedules(): void {
    console.log(this.currentUser);
    this.schedulesService.getSchedules()
    .subscribe(schedules => this.schedules = schedules);
  }

  getSchedule(schedule_name: string): void{
    const name = schedule_name.replace(/<[^>]*>?/gm, '');
    
    this.schedulesService.getSchedule(name, this.currentUser.username)
    .subscribe(schedules => {      
      this.schedules = schedules},
      err => {
        alert("Could not find the requested schedule!");
      });
    
  }

  deleteSchedule(delete_schedule_name: string): void{
    const name = delete_schedule_name.replace(/<[^>]*>?/gm, '');

    this.schedulesService.deleteSchedule(name, this.currentUser.username).subscribe();
  }

  deleteAllSchedules(): void {
    this.schedulesService.deleteAllSchedules(this.currentUser.username).subscribe();
  }

  createSchedule(scheduleName: string, publicDef: string): void{
    scheduleName = scheduleName.trim();
    scheduleName = scheduleName.replace(/<[^>]*>?/gm, '');
    if(scheduleName.length > 15 || scheduleName.length < 1){
      alert("Please choose a valid name for your new Schedule!");
      return;
    }
    const newSchedule = {
      name: scheduleName,
      subject: [],
      course_code: [],
      public: false,
      user: this.currentUser.username
    }
    if(publicDef.length < 1){
      alert("Please type 'public' or 'private' to choose for your schedule!")
      return;
    } else if(publicDef == "public"){
      newSchedule.public = true;
    } else if(publicDef != "private"){
      alert("Please type 'public' or 'private' to choose for your schedule!");
      return;
    }

    this.schedulesService.createSchedule(newSchedule)
    .subscribe(newSchedule => {
      alert("Successfully created!");
      this.schedules.push(newSchedule);
  });
}

//Could not figure out how to find the name of dynamically created inputs.
//This was my workaround.
updateSchedule(editScheduleName: string, editScheduleNumber: number,
  subjectCode0 : string, subjectCode1 : string,
  subjectCode2 : string, subjectCode3 : string,
  subjectCode4 : string, subjectCode5 : string,
  subjectCode6 : string, subjectCode7 : string,
  courseCode0 : string, courseCode1 : string,
  courseCode2 : string, courseCode3 : string,
  courseCode4 : string, courseCode5 : string,
  courseCode6 : string, courseCode7 : string, 
  publicUpdate: string, description: string): void{
    

  if(editScheduleName.length > 15 || editScheduleName.length < 1){
    alert("Please choose a valid schedule name!");
    return;
  }
  if(editScheduleNumber > 8 || editScheduleNumber < 1){
    alert("Please choose a valid number of courses!");
    return;
  }  

  const updatedSchedule = {
    name: editScheduleName,
    subject: [],
    course_code: [],
    public: false,
    user: this.currentUser.username,
    description: description
  }
  if(publicUpdate != "public" && publicUpdate != "private"){
    alert("Please type 'public' or 'private' to choose for your schedule!");
    return;
  } else if(publicUpdate == "public"){
    updatedSchedule.public = true;
  }

  console.log(editScheduleNumber);
  switch(Math.round(editScheduleNumber)){
    case 1: {
      if(subjectCode0.length < 1 || subjectCode0.length > 8
        || courseCode0.length < 1 || courseCode0.length > 6){
        alert("Please ensure all course pairs are filled out!");
        return;
      }
      updatedSchedule.subject.push(subjectCode0);
      updatedSchedule.course_code.push(courseCode0);
      console.log(updatedSchedule);
      break;
    }
    case 2: {
      if(subjectCode0.length < 1 || subjectCode0.length > 8
        || courseCode0.length < 1 || courseCode0.length > 6
        || subjectCode1.length < 1 || subjectCode1.length > 8
        || courseCode1.length < 1 || courseCode1.length > 6){
        alert("Please ensure all course pairs are filled out!");
        return;
      }
      updatedSchedule.subject.push(subjectCode0);
      updatedSchedule.course_code.push(courseCode0);
      updatedSchedule.subject.push(subjectCode1);
      updatedSchedule.course_code.push(courseCode1);
      console.log(updatedSchedule);
      break;
    }
    case 3: {
      if(subjectCode0.length < 1 || subjectCode0.length > 8
        || courseCode0.length < 1 || courseCode0.length > 6
        || subjectCode1.length < 1 || subjectCode1.length > 8
        || courseCode1.length < 1 || courseCode1.length > 6
        || subjectCode2.length < 1 || subjectCode2.length > 8
        || courseCode2.length < 1 || courseCode2.length > 6){
        alert("Please ensure all course pairs are filled out!");
        return;
      }
      updatedSchedule.subject.push(subjectCode0);
      updatedSchedule.course_code.push(courseCode0);
      updatedSchedule.subject.push(subjectCode1);
      updatedSchedule.course_code.push(courseCode1);
      updatedSchedule.subject.push(subjectCode2);
      updatedSchedule.course_code.push(courseCode2);
      console.log(updatedSchedule);
      break;
    }
    case 4: {
      if(subjectCode0.length < 1 || subjectCode0.length > 8
        || courseCode0.length < 1 || courseCode0.length > 6
        || subjectCode1.length < 1 || subjectCode1.length > 8
        || courseCode1.length < 1 || courseCode1.length > 6
        || subjectCode2.length < 1 || subjectCode2.length > 8
        || courseCode2.length < 1 || courseCode2.length > 6
        || subjectCode3.length < 1 || subjectCode3.length > 8
        || courseCode3.length < 1 || courseCode3.length > 6){
        alert("Please ensure all course pairs are filled out!");
        return;
      }
      updatedSchedule.subject.push(subjectCode0);
      updatedSchedule.course_code.push(courseCode0);
      updatedSchedule.subject.push(subjectCode1);
      updatedSchedule.course_code.push(courseCode1);
      updatedSchedule.subject.push(subjectCode2);
      updatedSchedule.course_code.push(courseCode2);
      updatedSchedule.subject.push(subjectCode3);
      updatedSchedule.course_code.push(courseCode3);
      console.log(updatedSchedule);
      break;
    }
    case 5: {
      if(subjectCode0.length < 1 || subjectCode0.length > 8
        || courseCode0.length < 1 || courseCode0.length > 6
        || subjectCode1.length < 1 || subjectCode1.length > 8
        || courseCode1.length < 1 || courseCode1.length > 6
        || subjectCode2.length < 1 || subjectCode2.length > 8
        || courseCode2.length < 1 || courseCode2.length > 6
        || subjectCode3.length < 1 || subjectCode3.length > 8
        || courseCode3.length < 1 || courseCode3.length > 6
        || subjectCode4.length < 1 || subjectCode4.length > 8
        || courseCode4.length < 1 || courseCode4.length > 6){
        alert("Please ensure all course pairs are filled out!");
        return;
      }
      updatedSchedule.subject.push(subjectCode0);
      updatedSchedule.course_code.push(courseCode0);
      updatedSchedule.subject.push(subjectCode1);
      updatedSchedule.course_code.push(courseCode1);
      updatedSchedule.subject.push(subjectCode2);
      updatedSchedule.course_code.push(courseCode2);
      updatedSchedule.subject.push(subjectCode3);
      updatedSchedule.course_code.push(courseCode3);
      updatedSchedule.subject.push(subjectCode4);
      updatedSchedule.course_code.push(courseCode4);
      console.log(updatedSchedule);
      break;
    }
    case 6: {
      if(subjectCode0.length < 1 || subjectCode0.length > 8
        || courseCode0.length < 1 || courseCode0.length > 6
        || subjectCode1.length < 1 || subjectCode1.length > 8
        || courseCode1.length < 1 || courseCode1.length > 6
        || subjectCode2.length < 1 || subjectCode2.length > 8
        || courseCode2.length < 1 || courseCode2.length > 6
        || subjectCode3.length < 1 || subjectCode3.length > 8
        || courseCode3.length < 1 || courseCode3.length > 6
        || subjectCode4.length < 1 || subjectCode4.length > 8
        || courseCode4.length < 1 || courseCode4.length > 6
        || subjectCode5.length < 1 || subjectCode5.length > 8
        || courseCode5.length < 1 || courseCode5.length > 6){
        alert("Please ensure all course pairs are filled out!");
        return;
      }
      updatedSchedule.subject.push(subjectCode0);
      updatedSchedule.course_code.push(courseCode0);
      updatedSchedule.subject.push(subjectCode1);
      updatedSchedule.course_code.push(courseCode1);
      updatedSchedule.subject.push(subjectCode2);
      updatedSchedule.course_code.push(courseCode2);
      updatedSchedule.subject.push(subjectCode3);
      updatedSchedule.course_code.push(courseCode3);
      updatedSchedule.subject.push(subjectCode4);
      updatedSchedule.course_code.push(courseCode4);
      updatedSchedule.subject.push(subjectCode5);
      updatedSchedule.course_code.push(courseCode5);
      console.log(updatedSchedule);
      break;
    }
    case 7: {
      if(subjectCode0.length < 1 || subjectCode0.length > 8
        || courseCode0.length < 1 || courseCode0.length > 6
        || subjectCode1.length < 1 || subjectCode1.length > 8
        || courseCode1.length < 1 || courseCode1.length > 6
        || subjectCode2.length < 1 || subjectCode2.length > 8
        || courseCode2.length < 1 || courseCode2.length > 6
        || subjectCode3.length < 1 || subjectCode3.length > 8
        || courseCode3.length < 1 || courseCode3.length > 6
        || subjectCode4.length < 1 || subjectCode4.length > 8
        || courseCode4.length < 1 || courseCode4.length > 6
        || subjectCode5.length < 1 || subjectCode5.length > 8
        || courseCode5.length < 1 || courseCode5.length > 6
        || subjectCode6.length < 1 || subjectCode6.length > 8
        || courseCode6.length < 1 || courseCode6.length > 6){
        alert("Please ensure all course pairs are filled out!");
        return;
      }
      updatedSchedule.subject.push(subjectCode0);
      updatedSchedule.course_code.push(courseCode0);
      updatedSchedule.subject.push(subjectCode1);
      updatedSchedule.course_code.push(courseCode1);
      updatedSchedule.subject.push(subjectCode2);
      updatedSchedule.course_code.push(courseCode2);
      updatedSchedule.subject.push(subjectCode3);
      updatedSchedule.course_code.push(courseCode3);
      updatedSchedule.subject.push(subjectCode4);
      updatedSchedule.course_code.push(courseCode4);
      updatedSchedule.subject.push(subjectCode5);
      updatedSchedule.course_code.push(courseCode5);
      updatedSchedule.subject.push(subjectCode6);
      updatedSchedule.course_code.push(courseCode6);
      console.log(updatedSchedule);
      break;
    }
    case 8: {
      if(subjectCode0.length < 1 || subjectCode0.length > 8
        || courseCode0.length < 1 || courseCode0.length > 6
        || subjectCode1.length < 1 || subjectCode1.length > 8
        || courseCode1.length < 1 || courseCode1.length > 6
        || subjectCode2.length < 1 || subjectCode2.length > 8
        || courseCode2.length < 1 || courseCode2.length > 6
        || subjectCode3.length < 1 || subjectCode3.length > 8
        || courseCode3.length < 1 || courseCode3.length > 6
        || subjectCode4.length < 1 || subjectCode4.length > 8
        || courseCode4.length < 1 || courseCode4.length > 6
        || subjectCode5.length < 1 || subjectCode5.length > 8
        || courseCode5.length < 1 || courseCode5.length > 6
        || subjectCode6.length < 1 || subjectCode6.length > 8
        || courseCode6.length < 1 || courseCode6.length > 6
        || subjectCode7.length < 1 || subjectCode7.length > 8
        || courseCode7.length < 1 || courseCode7.length > 6){
        alert("Please ensure all course pairs are filled out!");
        return;
      }
      updatedSchedule.subject.push(subjectCode0);
      updatedSchedule.course_code.push(courseCode0);
      updatedSchedule.subject.push(subjectCode1);
      updatedSchedule.course_code.push(courseCode1);
      updatedSchedule.subject.push(subjectCode2);
      updatedSchedule.course_code.push(courseCode2);
      updatedSchedule.subject.push(subjectCode3);
      updatedSchedule.course_code.push(courseCode3);
      updatedSchedule.subject.push(subjectCode4);
      updatedSchedule.course_code.push(courseCode4);
      updatedSchedule.subject.push(subjectCode5);
      updatedSchedule.course_code.push(courseCode5);
      updatedSchedule.subject.push(subjectCode6);
      updatedSchedule.course_code.push(courseCode6);
      updatedSchedule.subject.push(subjectCode7);
      updatedSchedule.course_code.push(courseCode7);
      console.log(updatedSchedule);
      break;
    }
    default:{
      console.log("Breaking!");
      break;
    }
  }

  this.schedulesService.updateSchedule(updatedSchedule)
  .subscribe(res => {
    alert("Successfully created!");
  },
  err => {
    alert(err.error.message);
  });
}
}
