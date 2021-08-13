import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const httpOptions = {
  headers: new HttpHeaders(),
  withCredentials: true
 };

@Injectable({
  providedIn: 'root'
})
export class DataService {

  base:string = "http://localhost:3000/";
  signUpUrl:string = this.base + "auth/signup";
  logInUrl:string = this.base + "auth/login";
  authCheckUrl:string = this.base + "auth";
  logOutUrl:string = this.base + "auth/logout";

  submitNewDocumentUrl:string = this.base + 'document/create';

  getDocumentsUrl:string = this.base + 'document/'; // Base
  signerRequestEditAccessUrl = this.base + 'document/signer/edit_access/request/'; // Base
  adminChangeSignerEditAccessUrl = this.base + 'document/admin/change_signer_access/';

  createCommentUrl = this.base + "document/comment/create/";
  updateCommentStatusUrl:string = this.base + 'document/comment/update/comment_status/';
  addThreadMessageUrl:string = this.base + 'document/comment/update/thread/add_message/';
  createCheckpointUrl:string = this.base + 'document/checkpoint/';
  loadCheckpointImgUrl:string = this.base + 'document/checkpoint/';

  toggleApprovalUrl:string = this.base + 'document/signer/approval_status/';

  createEnvelopeUrl:string = this.base + 'envelope/create/';
  signUrl:string = this.base + 'envelope/sign';
  constructor(private http:HttpClient) { }

  authCheck(){
    return this.http.get( this.authCheckUrl, httpOptions );

  }
  signUp(b){
    return this.http.post(this.signUpUrl, b, httpOptions);
  }

  logIn(b){
    return this.http.post(this.logInUrl, b, httpOptions);
  }

  logOut(){
    return this.http.get(this.logOutUrl, httpOptions);
  }

  submitNewDocument(b){
    return this.http.post(this.submitNewDocumentUrl, b, httpOptions);
  }

  getDocuments(by:string){
    return this.http.get(this.getDocumentsUrl + by,httpOptions);
  }

  signerRequestEditAccess(id:string){
    return this.http.get(this.signerRequestEditAccessUrl + id,httpOptions);
  }
  adminChangeSignerEditAccess(to_access:string,to_email:string,doc_id:string){
    return this.http.get(this.adminChangeSignerEditAccessUrl + to_access + '/' + to_email + '/' + doc_id, httpOptions);
  }
  createComment(comment:any,doc_id:string){
    console.log('URL :',this.createCommentUrl + doc_id);
    return this.http.post(this.createCommentUrl + doc_id, comment, httpOptions);
  }

  updateCommentStatus(doc_id:string,comment_id:string,to:string){
    return this.http.put(this.updateCommentStatusUrl + doc_id + '/'+ comment_id + '/' + to, {}, httpOptions);
  }

  addThreadMsg(comment_id:string,msg:string){
    return this.http.put(this.addThreadMessageUrl + comment_id, {msg:msg},httpOptions );
  }

  checkPoint(doc_id:string,img_url:string){
    return this.http.post(this.createCheckpointUrl + doc_id,{img_url:img_url},httpOptions);
  }
  loadCheckpointImg(checkpoint_id){
    return this.http.get(this.loadCheckpointImgUrl  + checkpoint_id,httpOptions);
  }

  toggleApproval(doc_id:string,to:string){
    return this.http.get(this.toggleApprovalUrl + doc_id + "/" + to, httpOptions);
  }
  createEnvelope(id:string){
    return this.http.post(this.createEnvelopeUrl , {doc_id:id},httpOptions);
  }

  sign(id:string){
    return this.http.post(this.signUrl, {doc_id:id}, httpOptions);
  }
}
