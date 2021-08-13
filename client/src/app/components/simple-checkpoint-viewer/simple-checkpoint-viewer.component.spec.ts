import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleCheckpointViewerComponent } from './simple-checkpoint-viewer.component';

describe('SimpleCheckpointViewerComponent', () => {
  let component: SimpleCheckpointViewerComponent;
  let fixture: ComponentFixture<SimpleCheckpointViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleCheckpointViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleCheckpointViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
