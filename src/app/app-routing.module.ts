import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutMeComponent } from './about-me/about-me.component';
import { ContactComponent } from './contact/contact.component';
import { FormComponent } from './form/form.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { AvailableServicesComponent } from './available-services/available-services.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'aboutMe', component: AboutMeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'form', component: FormComponent},
  { path: 'schedule', component: ScheduleComponent},
  { path: 'availableServices', component: AvailableServicesComponent},
  { path: 'home', component: HomeComponent},
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',   redirectTo: '/home', pathMatch: 'full' },
  { path: 'aboutMe',   redirectTo: '/aboutMe', pathMatch: 'full' },
  { path: 'contact',   redirectTo: '/contact', pathMatch: 'full' },
  { path: 'schedule',   redirectTo: '/schedule', pathMatch: 'full' },
  { path: 'availableServices',   redirectTo: '/schedule', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
