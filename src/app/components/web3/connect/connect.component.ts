import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css']
})
export class ConnectComponent implements OnInit {

  constructor(private walletService:WalletService) { 
    
  }

  ngOnInit(): void {
  }

  connect(){
  this.walletService.connect().then(x => console.log("Se conecto correctamnete")).catch(x=>console.log("hubo un error"));
  }

   isConnect(){
    this.walletService.emitAddressConnected();
   }
}
