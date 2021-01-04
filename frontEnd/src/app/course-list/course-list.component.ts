import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { CoursesService } from '../courses.service';
import {Course} from '../course';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  //We will use this with courses.service to retrieve the list of courses from the backend.
  courses: Course[];
  subject: string;
  catalog_nbr: string;
  ssr_component: string;
  keyword: string;

  constructor(private location: Location,
    private coursesService: CoursesService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getCourses();
  }

  getCourses(): void {
    this.coursesService.getCourses()
    .subscribe(courses => this.courses = courses);
  }

  getCourseByKey(keyword: string): void{
    if(keyword.length < 4){
      alert("Please use keywords that are at least 4 characters in length!");
      return;
    }
    const key = keyword.toUpperCase();
    this.coursesService.getCourseByKey(key)
    .subscribe(courses => {
      this.courses = courses},
      err => {
        alert("No course found that match specified keyword!")
      });
  }

  getFilteredCourses(subject: string, catalog_nbr: string, ssr_component: string): void{
    const sub = subject.toUpperCase();
    const cat = catalog_nbr.toUpperCase();
    const comp = ssr_component;

    console.log(sub.length);
    console.log(cat.length)

    if(sub.length < 1 && cat.length > 1){
      this.getCoursesByNumber(cat);
      return;
    }
    if(sub.length > 1 && cat.length < 1){
      this.getCoursesBySubject(sub);
      return;
    }

    if(sub.length > 8 || cat.length > 5 || comp.length > 3){
      alert("Search guidelines are invalid! Ensure: Subject = 8 characters maximum, course code = 5 characters maximum, and component = 3 characters maximum!");
      return;
    }
    this.coursesService.getFilteredCourses(sub, cat, comp)
    .subscribe(courses => {
      this.courses = courses
    }, err => {
      alert("Could not find specified course! Check your search requirements!")
    });
  }

  getCoursesBySubject(subject: string): void{
    const sub = subject;
    if(sub.length > 8){
      alert("Subjects are 8 characters maximum! Please fill boxes with valid search parameters!");
      return;
    }
    this.coursesService.getCoursesBySubject(sub)
    .subscribe(courses => this.courses = courses);
  }

  getCoursesByNumber(catalog_nbr: string): void{
    const cat = catalog_nbr;
    if(cat.length > 5){
      alert("Course Codes are 5 characters maximum! Please fill boxes with valid search parameters!");
      return;
    }
    this.coursesService.getCoursesByNumber(cat)
    .subscribe(courses => this.courses = courses);
  }

  displayAll(): void {
    this.getCourses();
  }
}
