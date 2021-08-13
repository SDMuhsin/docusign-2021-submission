import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDocStatusComponent } from './admin-doc-status.component';

describe('AdminDocStatusComponent', () => {
  let component: AdminDocStatusComponent;
  let fixture: ComponentFixture<AdminDocStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDocStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDocStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
