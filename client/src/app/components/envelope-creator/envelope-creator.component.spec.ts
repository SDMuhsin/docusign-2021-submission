import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvelopeCreatorComponent } from './envelope-creator.component';

describe('EnvelopeCreatorComponent', () => {
  let component: EnvelopeCreatorComponent;
  let fixture: ComponentFixture<EnvelopeCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvelopeCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvelopeCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
