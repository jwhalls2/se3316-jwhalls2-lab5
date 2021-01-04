import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseListComponent } from './course-list/course-list.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { UserComponent } from './user/user.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { AuthGuard } from './auth/auth.guard';
import { ReviewsComponent } from './reviews/reviews/reviews.component'
import { AdminComponent } from './admin/admin/admin.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

export const routes: Routes = [
  { path: 'course-list', component: CourseListComponent },
  {path: 'signup', component: UserComponent,
children: [{path: '', component: SignUpComponent}]},
{path: 'signin', component: UserComponent,
children: [{path: '', component: SignInComponent}]},
  { path: 'schedules', component: SchedulesComponent, canActivate: [AuthGuard] },
  { path: 'home-page', component: HomePageComponent },
  { path: 'reviews', component: ReviewsComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'changePassword', component: ChangePasswordComponent },
  { path: '', redirectTo: '/home-page', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }