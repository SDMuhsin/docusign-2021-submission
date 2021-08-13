import { Component, OnInit, ViewChild, Input } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexXAxis,
  ApexFill,
  ApexLegend,
  ApexTooltip
} from "ng-apexcharts";
import { range } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  fill: ApexFill;
  legend: ApexLegend;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
  colors: string[];
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  currentDocIndex:number = -1;
  docs:any = [];
  chartSeries:any = [];
  signersColumnsToDisplay:string[] = ['signerName','approvalStatus','signStatus'];
  constructor(private ds:DataService) {
    this.getDocs();
    this.chartOptions = {
      series:[],
      chart: {
        height: 350,
        type: "rangeBar"
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "50%",
          rangeBarGroupRows: true
        }
      },
      colors: [
        "#008FFB",
        "#00E396",
        "#FEB019",
        "#FF4560",
        "#775DD0",
        "#3F51B5",
        "#546E7A",
        "#D4526E",
      ],
      fill: {
        type: "solid"
      },
      xaxis: {
        type: "datetime"
      },
      legend: {
        position: "right"
      }
    };
  }
  setChartOptions(){
        
    this.chartOptions = {
      series:this.chartSeries,
      chart: {
        height: 350,
        type: "rangeBar",
        events: {
        click: function(event, chartContext, config) {
          console.log(event);
          console.log(chartContext);
          console.log(config);
        }
      }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "50%",
          rangeBarGroupRows: true
        }
      },
      colors: [
        "#008FFB",
        "#00E396",
        "#FEB019"
      ],
      fill: {
        type: "solid"
      },
      xaxis: {
        type: "datetime"
      },
      legend: {
        position: "right"
      },
      tooltip : {
        custom : (opts) => {
          const fromYear = new Date(opts.y1).getFullYear();
          const toYear = new Date(opts.y2).getFullYear();
          const values = opts.ctx.rangeBar.getTooltipValues(opts);
          return (
            '<div class="apexcharts-tooltip-rangebar">' +
            '<div> <span class="series-name" style="color: ' +
            values.color +
            '">' +
            (values.seriesName ? values.seriesName : "") +
            "</span></div>" +
            '<div> <span class="category">' +
            values.ylabel +
            ' </span> <span class="value start-value">' +
            fromYear +
            '</span> <span class="separator">-</span> <span class="value end-value">' +
            toYear +
            "</span></div>" +
            "</div>"
          );
        }
      }
    };
  }

  ping(){
    console.log("PING!");
  }
  getDocs(){
    this.ds.getDocuments("admin_email").subscribe(
      data =>{
        console.log(data);
        this.docs= data;
        
      },
      err =>{
        console.log(err);
      }
    )
  }
  processDoc(){
    console.log("Generating chart series");
    if(this.currentDocIndex != -1){
      console.log("Valid doc");
      this.chartSeries =[];
      
      for(let i = 0; i < this.docs[this.currentDocIndex].comments.length; i++){

        let comment = this.docs[this.currentDocIndex].comments[i];

        if(comment.history.length > 1){
          for (let j = 1; j < comment.history.length ; j++){

            const obj = {
              name : comment.history[j-1].status,
              data : [{
                x : comment.title,
                y : [
                  new Date(comment.history[j-1].on).getTime(),
                  new Date(comment.history[j].on).getTime()
                ],
                fillColor : comment.history[j-1].status == 'RAISED' ? '#FF0000' : comment.history[j-1].status == 'ADDRESSED'? '#0000FF' : '#00FF00'
              }]
            }
            this.chartSeries.push(obj);
          }

          // IF ENDING AT A RESOLVE
          const lIndex = comment.history.length - 1;
          if(comment.history[ lIndex ].status == 'RESOLVED'){
            const obj = {
              name : comment.history[lIndex].status,
              data : [{
                x : comment.title,
                y : [
                  new Date(comment.history[lIndex].on).getTime(),
                  new Date(comment.history[lIndex].on).getTime() + 1000*60
                ],
                fillColor : comment.history[lIndex].status == 'RAISED' ? '#FF0000' : comment.history[lIndex].status == 'ADDRESSED'? '#0000FF' : '#00FF00'
              }]
            }
            this.chartSeries.push(obj)
          }

          // Checkpoints
          if(this.docs[this.currentDocIndex].history.length != 0){
            const history = this.docs[this.currentDocIndex].history;

            for(let i = 0; i < history.length; i++){
              this.chartSeries.push({
                name:"Checkpoints",
                data : [{
                  x : "Checkpoints",
                  y : [
                    new Date(history[i].created.on).getTime(),
                    new Date(history[i].created.on).getTime() + 60*1000
                  ],
                  fillColor : "#000000"
              }],
                
              });
            }
          }
          
        }
      }
      console.log(this.chartSeries);
      this.setChartOptions();
    }
  }
  ngOnInit(): void {
  }

  envelopeCreationLoad:boolean = false;
  createEnvelope(){
    this.envelopeCreationLoad = true;
    const id = this.docs[this.currentDocIndex]._id;
    this.ds.createEnvelope(id).subscribe(
      data=>{
        console.log(data);
        this.getDocs();
        this.envelopeCreationLoad = false;
      },
      err =>{
        console.log(err);
      }

    )
  }
}
