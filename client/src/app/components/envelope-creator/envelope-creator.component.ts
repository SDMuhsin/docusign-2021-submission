import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { loadModules } from "esri-loader";
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-envelope-creator',
  templateUrl: './envelope-creator.component.html',
  styles:['@import url("https://js.arcgis.com/4.14/esri/css/main.css")'],
  styleUrls: ['./envelope-creator.component.css']
})
export class EnvelopeCreatorComponent implements OnInit {
  
  public mapView;
  public map;
  private featureLayerUrl:string = "";
  private sub: Subscription = new Subscription();
  

  public esriApiKey:string = "AAPK1763de5d5bc9473a9d536e43c5177ae523CpjsX9hyYOEpPVn5vam4cmU3JuJ32vPeB0OciPRt30EgSr8UA9JOSY-xktECC1";
  editor: any;
  constructor(private ds:DataService) { }


  ngOnInit() {
  }

  
  

  // -------- FORM FIELDS --------- //

  docTitle:string = "";
  docMapUrl:string = "";
  docHistory = [];

  newDocSignerName:string = "";
  newDocSignerEmail:string = "";
  newDocSignerEditAccess:boolean = false;
  docSigners = [];
  docSubmitStatusMsg:string = "";
  // --------    FF      --------- //
  
  deleteSigner(i:number){ 
    this.docSigners.splice(i,1);
  }
  addSigner(){
    if(this.newDocSignerEmail != "" && this.newDocSignerName != ""){
      this.docSigners.push({signerName:this.newDocSignerName,signerEmail:this.newDocSignerEmail,signerEditAccess:this.newDocSignerEditAccess,signerApprovalStatus:"PENDING"});
    }
  }
  submitNewDocument(){
    this.docSubmitStatusMsg = "";
    if(this.docSigners != [] && this.docTitle != "" && this.docMapUrl != ""){
      const doc = {
        docTitle : this.docTitle,
        docMapUrl : this.docMapUrl,
        docSigners : this.docSigners
      };
      this.ds.submitNewDocument(doc).subscribe(
        data =>{
          this.docSubmitStatusMsg = "Succesful, go to edit TAB";
        },
        err =>{
          console.log(err);
          this.docSubmitStatusMsg = "Error";
        }
      );
    }
    else{
      this.docSubmitStatusMsg = "Empty field";
    }
    
  }

}
