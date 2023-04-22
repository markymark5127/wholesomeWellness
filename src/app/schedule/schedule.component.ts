import { Component,
  NgModule,
  VERSION,
  ElementRef,
  ViewChild } from '@angular/core';

declare global { interface Window { Calendly: any; } }

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})

export class ScheduleComponent {
  ngOnInit(): void {
    window.Calendly.initInlineWidget({
      url: 'https://calendly.com/wholesoulyork',
      parentElement: document.querySelector('.calendly-inline-widget'),
    });
  };


}
