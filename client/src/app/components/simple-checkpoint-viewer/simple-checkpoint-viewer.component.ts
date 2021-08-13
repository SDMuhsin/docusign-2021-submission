import { Component, Input, NgModuleRef, OnChanges, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import {NgbModal, ModalDismissReasons,NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { AstMemoryEfficientTransformer } from '@angular/compiler';

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header w-100">
      <h4 class="w-100 modal-title">Viewing checkpoint : {{checkpointIndex}}</h4>
      
      <p class = "w-100"> <small>Created by {{created.by}} on {{created.on}}</small></p>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
    <div class = "w-100 d-flex justify-content-center align-items-center">
      <img style = "height:1000px;max-width:1000px"src = "{{'data:image/png;base64,' + currentBase64String}}" />
    </div>
    </div>
    <div class="modal-footer">
    <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Set as primary</button>
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})
export class NgbdModalContent {
  @Input() currentBase64String:string;
  @Input() created:any;
  @Input() checkpointIndex:number;
  
  constructor(public activeModal: NgbActiveModal) {
    
  }
}

@Component({
  selector: 'app-simple-checkpoint-viewer',
  templateUrl: './simple-checkpoint-viewer.component.html',
  styleUrls: ['./simple-checkpoint-viewer.component.css']
})
export class SimpleCheckpointViewerComponent implements OnChanges {
  @Input() doc:any;
  history:any = []
  showImage:boolean = false;
  currentBase64String:string = "";
  currentCheckpointId:string = "";
  @Input() editAccess:boolean;
  closeResult = '';
  constructor(private ds:DataService,private modalService: NgbModal) { }
  open() {
    const modalRef = this.modalService.open(NgbdModalContent,{size:'xl'});
    modalRef.componentInstance.currentBase64String = this.currentBase64String;
    modalRef.componentInstance.checkpointIndex = this.numberFromId(this.currentCheckpointId)
    modalRef.componentInstance.created = this.history[this.numberFromId(this.currentCheckpointId)].created;
  }



  ngOnChanges(): void {
    this.history = this.doc.history;
  }
  numberFromId(id:string){
    for(let i = 0; i < this.history.length; i++){
      if(this.history[i].checkpoint_id == id){
        return i;
      }
    }
    return -1;
  }
  showCheckpointImg(checkpoint_id:string){
    this.ds.loadCheckpointImg(checkpoint_id).subscribe(
      data =>{
        console.log("B64 loaded!");
        console.log(Object.keys(data));
        
        this.currentBase64String = data["img_b64"];

        this.open();
        this.showImage = true;
        
      },
      err =>{
        console.log(err);
      }
    );
  }

}
