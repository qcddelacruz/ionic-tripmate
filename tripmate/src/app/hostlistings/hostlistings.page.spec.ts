import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HostlistingsPage } from './hostlistings.page';

describe('HostlistingsPage', () => {
  let component: HostlistingsPage;
  let fixture: ComponentFixture<HostlistingsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HostlistingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
