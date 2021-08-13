import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { CheckpointComponent } from '../checkpoint/checkpoint.component';
import { EsriMapComponent } from '../esri-map/esri-map.component';

@Component({
  selector: 'app-document-editor-admin',
  templateUrl: './document-editor-admin.component.html',
  styleUrls: ['./document-editor-admin.component.css']
})
export class DocumentEditorAdminComponent implements OnChanges {
  @Output() updateParentEvent = new EventEmitter<string>();
  @Input() doc :any = {};
  @ViewChild(EsriMapComponent) esriMapComponent : EsriMapComponent;
  @ViewChild(CheckpointComponent) checkpointComponent: CheckpointComponent;
  signerData:any = [];
  signersColumnsToDisplay = ['signerName','approvalStatus','editAccess','signStatus'];//,'giveAccess'];
  constructor(private ds:DataService) { }

  ngOnChanges(): void {
    this.getSignerData();
  }
  getSignerData(){
    this.signerData = this.doc.docSigners;
  }
  changeSignerEditAccess(to:string,signer:any){
    this.ds.adminChangeSignerEditAccess(to,signer.signerEmail,this.doc._id).subscribe(
      data =>{
        console.log(data);
        this.reloadDoc()
        
      },
      err =>{
        console.log(err);
      }
    );
  }
  reloadDoc(){
    this.updateParentEvent.emit();
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
}
