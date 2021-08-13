import { Component, OnInit, Input, OnChanges, ViewChild, EventEmitter, Output } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { loadModules } from "esri-loader";
import { EsriMapComponent } from '../esri-map/esri-map.component';
import { CheckpointComponent } from '../checkpoint/checkpoint.component';

@Component({
  selector: 'app-document-editor-signer',
  templateUrl: './document-editor-signer.component.html',
  styleUrls: ['./document-editor-signer.component.css']
})
export class DocumentEditorSignerComponent implements OnChanges {
  @Input() doc :any = {};
  @Output() reloadDocEvent= new EventEmitter();
  @ViewChild(EsriMapComponent) esriMapComponent : EsriMapComponent;
  @ViewChild(CheckpointComponent) checkpointComponent: CheckpointComponent;
  meteDataDisplayColumns = ['signerName','signerApprovalStatus'];
  

  myData:any = {signerName:"",signerEmail:"",signerEditAccess:"",signerApprovalStatus:false,requestingAccess:false};
  myDataLoaded:boolean = false;
  constructor(private ds:DataService) { 
    this.getMyData();
  }

  ngOnChanges(): void {
    this.getMyData();
  }

  getMyData(){
    console.log("doc change");
    this.ds.authCheck().subscribe(
      data =>{
        let flag = 0;
        for(let i = 0; i < this.doc.docSigners.length; i++){
          if(this.doc.docSigners[i].signerEmail == data["email"]){
            flag = 1;
            this.myData = this.doc.docSigners[i];
          }
        }
        if(flag){
          this.myDataLoaded = true;
        }
      },
      err =>{
        console.log(err);
      }
    );
  }


  reloadDoc(){
    this.reloadDocEvent.emit();
  }
  requestEditAccess(){
    console.log("Requesting edit access for document : ", this.myData._id);
    this.ds.signerRequestEditAccess(this.doc._id).subscribe(
      data =>{
        console.log(data);
        this.reloadDoc();

      },
      err =>{
        console.log(err);
      }
    );
  }

  loadMapPrintWidget(){
    console.log("LOAD PRINT WIDGET : LOADING : SIGNER COMP");
    this.esriMapComponent.printMap();
  }

  mapPrintWidgetLoaded(){
    console.log("LOAD PRINT WIDGET : PRINT WIDGET LOADED : SIGNER COMP");
    this.checkpointComponent.printMapWidgetLoaded();
  }

  mapExported(url:string){
    this.checkpointComponent.mapExported(url);
  }

  toggleApprovalStatus(){
    if(this.myData.signerApprovalStatus == 'PENDING'){
      this.ds.toggleApproval(this.doc._id,'APPROVED').subscribe(
        data =>{
          console.log(data);
          this.reloadDoc();
        },
        err =>{
          console.log(err);
          this.reloadDoc();
        }
      );
    }
    else{
      this.ds.toggleApproval(this.doc._id,'PENDING').subscribe(
        data =>{
          this.reloadDoc();
        },
        err =>{
          console.log(err);
        }
      );
    }
  }

  sign(){
    this.ds.sign(this.doc._id).subscribe(
      data =>{
        console.log(data);
        window.location.href = data["redirectUrl"];
      },
      err =>{
        console.log(err);
      }
    )
  }
}
