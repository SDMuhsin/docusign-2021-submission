import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentEditorSignerComponent } from './document-editor-signer.component';

describe('DocumentEditorSignerComponent', () => {
  let component: DocumentEditorSignerComponent;
  let fixture: ComponentFixture<DocumentEditorSignerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentEditorSignerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentEditorSignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
