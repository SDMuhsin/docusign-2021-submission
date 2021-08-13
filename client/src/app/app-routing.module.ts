import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountsComponent } from './components/accounts/accounts.component';
import { DocumentEditorRouterComponent } from './components/document-editor-router/document-editor-router.component';
import { EnvelopeCreatorComponent } from './components/envelope-creator/envelope-creator.component';
import { HistoryComponent } from './components/history/history.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {path:'',component : HomeComponent},
  {path:'accounts',component:AccountsComponent},
  {path:'create_envelope',component:EnvelopeCreatorComponent},
  {path:'edit_document', component: DocumentEditorRouterComponent},
  {path:'view_history', component:HistoryComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
