import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableServicesComponent } from './available-services.component';

describe('AvailableServicesComponent', () => {
  let component: AvailableServicesComponent;
  let fixture: ComponentFixture<AvailableServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailableServicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
