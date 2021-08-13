import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentEditorAdminComponent } from './document-editor-admin.component';

describe('DocumentEditorAdminComponent', () => {
  let component: DocumentEditorAdminComponent;
  let fixture: ComponentFixture<DocumentEditorAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentEditorAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentEditorAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
