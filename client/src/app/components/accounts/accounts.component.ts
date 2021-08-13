import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
import { Output, EventEmitter } from '@angular/core'; 

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  @Output() authEvent = new EventEmitter<any>();

  // Sign up form data
  signUpEmail:String = "";
  signUpUsername:String = "";
  signUpPassword:String = "";
  signUpStateMsg:String = "";

  // Log in form data
  logInEmail:String = "";
  logInPassword:String = "";
  logInStateMsg:String = "";

  // Authentication state data
  isLoggedIn:boolean = false;
  userEmail:String = "";
  
  
  constructor( private ds:DataService) { 
    this.authCheck();
  }

  ngOnInit(): void {
  }

  authCheck(){
    this.ds.authCheck().subscribe(
      data => {
        console.log(data);
        this.isLoggedIn = data["authd"];
        this.userEmail = data["email"];
        this.authEvent.emit();
      },
      err =>{
        console.log("Error ", err);
      }
    );
  }

  signUp(){
    this.signUpStateMsg = "";
    let body = {
      "username":this.signUpUsername,
      "email":this.signUpEmail,
      "password":this.signUpPassword
    };
    this.ds.signUp(body).subscribe( 
      data =>{
        console.log(data);
        this.signUpStateMsg = "Succesful, login";
      },
      err => {
        if(err.status == 400){
          this.signUpStateMsg = "Account already exists";
        }else{
          this.signUpStateMsg = err.error;
        }
      }
    )
  }

  logIn(){
    this.logInStateMsg = "";
    let body = {
      "email":this.logInEmail,
      "password":this.logInPassword
    };
    this.ds.logIn(body).subscribe(
      data =>{
        this.logInStateMsg = "Log in succesful";
        console.log(data);
        this.authCheck();
      },
      err =>{
        this.logInStateMsg = "Log in unsuccesful";
        console.log(err);
      }
    );
  }

  logOut(){
    this.ds.logOut().subscribe(data=>this.authCheck());
  }
}
