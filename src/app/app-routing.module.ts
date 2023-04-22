import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutMeComponent } from './about-me/about-me.component';
import { ContactComponent } from './contact/contact.component';
import { FormComponent } from './form/form.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { AvailableServicesComponent } from './available-services/available-services.component';

const routes: Routes = [
  { path: 'aboutMe', component: AboutMeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'form', component: FormComponent},
  { path: 'schedule', component: ScheduleComponent},
  { path: 'availableServices', component: AvailableServicesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
