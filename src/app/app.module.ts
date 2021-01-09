import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NgbModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import { MoreInfoModalComponent } from './more-info-modal/more-info-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    MoreInfoModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgbNavModule
  ],
  exports: [AppComponent],
  providers: [MoreInfoModalComponent, NgbNavModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
