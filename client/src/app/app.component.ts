import { Component } from '@angular/core';
import { DataService } from './services/data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  esriKey:string = "AAPK1763de5d5bc9473a9d536e43c5177ae523CpjsX9hyYOEpPVn5vam4cmU3JuJ32vPeB0OciPRt30EgSr8UA9JOSY-xktECC1";
  isLoggedIn:boolean = false;
  userEmail:string = "";
  constructor(private ds:DataService){
    this.authCheck();
  }
  authCheck(){
    this.ds.authCheck().subscribe(
      data => {
        console.log(data);
        this.isLoggedIn = data["authd"];
        this.userEmail = data["email"];
      },
      err =>{
        console.log("Error ", err);
      }
    );
  }
  logOut(){
    this.ds.logOut().subscribe(data=>{this.authCheck();window.location.reload();});
  }
}
