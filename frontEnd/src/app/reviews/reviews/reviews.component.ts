import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../review.service';
import { UserService } from '../../shared/user.service';



@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {

  
  currentUser = this.userService.selectedUser;

  constructor(private userService: UserService, private reviewService:ReviewService) { }

  ngOnInit(): void {
  }

  submitReview(title: string, courseId: string, rating: string, hiddenVal: string, comment: string){

    console.log(this.currentUser);
    let hiddenSend;
    if(hiddenVal == "yes"){
      hiddenSend = true;
    } else{
      hiddenSend = false;
    }

    const formData = {title:title, courseId:courseId,rating:rating, comment:comment, createdBy:this.currentUser.username, hidden: hiddenSend}

   if(title==null||title==""){
     alert("Please enter a title for the course Review");
   }

   else if(courseId==null||courseId==""){
    alert("Please enter the subject and course number for the course you want to review");
   }

  else if(rating==null||rating==""){
    alert("Please enter a rating for the course.");
  }

  else if(comment==null||comment==""){
    alert("Please enter some comments for the course.");
  }
  else{
    this.reviewService.addNewReview(formData).subscribe(data=>console.log(data));
    alert(`Your review was successfully submitted.`);
    
 }
  }
}
