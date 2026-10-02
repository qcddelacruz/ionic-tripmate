import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HostdashboardPage } from './hostdashboard.page';

describe('HostdashboardPage', () => {
  let component: HostdashboardPage;
  let fixture: ComponentFixture<HostdashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HostdashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
