import { EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-comments-viewer',
  templateUrl: './comments-viewer.component.html',
  styleUrls: ['./comments-viewer.component.css']
})
export class CommentsViewerComponent implements OnChanges {

  @Input() doc:any = {}
  @Output() reloadDocEvent = new EventEmitter();
  comments:any = [];
  currentMode:string = "CREATE";

  newCommentTitle:string = "";
  newCommentType:string = "TYPE1";
  newCommentDescription:string = "";

  currentViewCommentIndex:number = 0;
  constructor(private ds:DataService) { }

  ngOnChanges(): void {
    this.getComments();
  }
  reloadDoc(){
    this.reloadDocEvent.emit();
  }
  getComments(){
    this.comments = this.doc.comments;
    console.log("Comments", this.comments);
  }
  createComment(){
    const comment = {
      title:this.newCommentTitle,
      type:this.newCommentType,
      description:this.newCommentDescription
    }
    console.log("New comment : ",comment);
    console.log("DOC", this.doc);
    if(this.newCommentDescription != "" && this.newCommentTitle != "" && this.newCommentType != ""){
    
      this.ds.createComment(comment, this.doc._id).subscribe(
        data =>{
          console.log("Comment created...probably");
          console.log(data);
          this.reloadDoc();
        },
        err =>{
          console.log("Failed to create comment");
          console.log(err);
        }
      )
    }
  }
  editComment(i:number){
    this.currentViewCommentIndex = i;
    this.currentMode = 'EDIT';
  }

  updateCommentStatus(to:string){
    console.log(this.doc._id,this.comments[this.currentViewCommentIndex],to);
    this.ds.updateCommentStatus(this.doc._id,this.comments[this.currentViewCommentIndex]._id, to).subscribe(
      data =>{
        console.log(data);
        this.reloadDoc();
      },
      err => {
        console.log(err);
      }
    )
  }

  newThreadMessage:string = "";
  addThreadMsg(){
    console.log(this.newThreadMessage);
    if(this.newThreadMessage != ""){
      this.ds.addThreadMsg(this.comments[this.currentViewCommentIndex]._id,this.newThreadMessage).subscribe(
        data =>{
          console.log(data);
          this.reloadDoc();
        },
        err =>{
          console.log(err);
        }
      )
    }
  }
}
