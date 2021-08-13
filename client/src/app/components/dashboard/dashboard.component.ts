import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @Output() authEvent = new EventEmitter<any>(); 
  @ViewChild('drawer', { static: true }) public drawer!: MatDrawer;

  
  constructor() { }

  ngOnInit(): void {
  }

  toggleSideNav(){
    this.drawer.toggle();
  }

  onActivate(componentReference){
    console.log("Dash board!");
    componentReference.authEvent.subscribe( data => this.authEvent.emit());
  }


}
