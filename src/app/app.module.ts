import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { ConnectComponent } from './components/web3/connect/connect.component';
import { ShowWalletComponent } from './components/web3/show-wallet/show-wallet.component';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
    ConnectComponent,
    ShowWalletComponent,
   

  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
