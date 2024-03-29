import { Component, OnInit } from '@angular/core';
import { Course } from '../course';
import { CoursesService } from '../courses.service';
import { Schedule } from '../schedule';
import { SchedulesService } from '../schedules.service';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  schedules: Schedule[];
  courses: Course[] = [];
  currentUser = this.userService.selectedUser;
  constructor(
    private coursesService: CoursesService,
    private schedulesService: SchedulesService,
    private userService: UserService) { }

  ngOnInit(): void {
  }

  getSchedules(): void {
    this.schedulesService.getSchedules()
    .subscribe(schedules => this.schedules = schedules);

    const ssr_component = "LEC";

    for(var i = 0; i < 10; i++){
      if(this.schedules.length == 0){
        return;
      } else if(this.schedules.length ==i){
        return;
      }
      for(var j = 0; j < this.schedules[i].subject.length; j++){
        if(this.schedules[i].subject.length == 0){
          continue;
        }
        this.coursesService.getFilteredCourses(this.schedules[i].subject[j], this.schedules[i].course_code[j], ssr_component).subscribe(courses => {
          console.log(courses[0]);
          this.courses.push(courses[0]);
         
        }, err => {
          alert("Could not find specified course! Check your search requirements!")
        })
      }
    }
  }
}