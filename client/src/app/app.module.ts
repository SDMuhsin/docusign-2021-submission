import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EnvelopeCreatorComponent } from './components/envelope-creator/envelope-creator.component';
import { DocumentEditorRouterComponent } from './components/document-editor-router/document-editor-router.component';
import { DocumentEditorAdminComponent } from './components/document-editor-admin/document-editor-admin.component';
import { DocumentEditorSignerComponent } from './components/document-editor-signer/document-editor-signer.component';
import { EsriMapComponent } from './components/esri-map/esri-map.component';
import { CommentsViewerComponent } from './components/comments-viewer/comments-viewer.component';
import { CheckpointComponent } from './components/checkpoint/checkpoint.component';
import { SimpleCheckpointViewerComponent } from './components/simple-checkpoint-viewer/simple-checkpoint-viewer.component';
import { HistoryComponent } from './components/history/history.component';

import {NgApexchartsModule} from "ng-apexcharts";
import { AdminDocStatusComponent } from './components/admin-doc-status/admin-doc-status.component';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    AccountsComponent,
    EnvelopeCreatorComponent,
    DocumentEditorRouterComponent,
    DocumentEditorAdminComponent,
    DocumentEditorSignerComponent,
    EsriMapComponent,
    CommentsViewerComponent,
    CheckpointComponent,
    SimpleCheckpointViewerComponent,
    HistoryComponent,
    AdminDocStatusComponent
    
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    NgApexchartsModule,

    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDialogModule

    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  
}
