import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-checkpoint',
  templateUrl: './checkpoint.component.html',
  styleUrls: ['./checkpoint.component.css']
})
export class CheckpointComponent implements OnInit {
  @Output() loadPrintWidgetEvent = new EventEmitter();
  @Output() reloadDocEvent = new EventEmitter();
  @Input() doc:any;
  @Input() editAccess:boolean;

  exportWidgetStatus:string = "";
  exportStatus:string = "";
  checkpointStatus:string = "";

  checkpointProcessStarted:boolean = false;
  constructor(private ds:DataService) { }

  ngOnInit(): void {
  }


  startCheckpoint(){
    this.checkpointProcessStarted = true;
    this.exportWidgetStatus = "LOADING";
    this.exportStatus = "IDLE";
    this.checkpointStatus = "IDLE";

    this.loadPrintWidgetEvent.emit();
  }

  printMapWidgetLoaded(){
    this.exportWidgetStatus = "COMPLETE";
    this.exportStatus = "LOADING";

  }
  reloadDoc(){
    this.reloadDocEvent.emit();
  }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  async mapExported(url){
    console.log(url,typeof(url));
    console.log("MAP EXPORTED : " + url + " :CHECKPOINT COMPONENT ");
    this.exportStatus = "COMPLETE";

    this.ds.checkPoint(this.doc._id,url).subscribe(
      async (data) =>{
        console.log(data);
        await this.delay(1000);
        this.checkpointStatus = 'COMPLETE';
        this.reloadDoc();
      },
      err =>{
        console.log(err);
      }
    );
  }
}
