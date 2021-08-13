import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentEditorRouterComponent } from './document-editor-router.component';

describe('DocumentEditorRouterComponent', () => {
  let component: DocumentEditorRouterComponent;
  let fixture: ComponentFixture<DocumentEditorRouterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentEditorRouterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentEditorRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
