import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { DocumentEditorAdminComponent } from '../document-editor-admin/document-editor-admin.component';
import { DocumentEditorSignerComponent } from '../document-editor-signer/document-editor-signer.component';
@Component({
  selector: 'app-document-editor-router',
  templateUrl: './document-editor-router.component.html',
  styleUrls: ['./document-editor-router.component.css']
})
export class DocumentEditorRouterComponent implements OnInit {
  currentMode:string = "signer";
  myDocuments:any = [];
  currentDocument:number = -1;
  
  constructor(private ds:DataService) {
    this.getDocuments();
   }
  onModeChange(){
    console.log("Mode change");
    this.getDocuments();
    this.currentDocument = -1;
  }
  getDocuments(){
    console.log("Getting user's documents");
    let by = this.currentMode == 'admin' ? 'admin_email' : 'signer_email';
    console.log('by : ',by)
    this.ds.getDocuments( by).subscribe(
      data =>{
        console.log(data);
        this.myDocuments = data;
      },
      err => {  
        console.log(err);
      }
    );
  }
  onDocChange(){
    console.log("Document change : ", this.currentDocument);
  }
  ngOnInit(): void {
  }

}
