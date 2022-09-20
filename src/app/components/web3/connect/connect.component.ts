import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../services/wallet.service';
import Swal from 'sweetalert2';
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
  this.walletService.connect().then(x => console.log("user conectar")).catch(x => Swal.fire(
    {
      icon: 'error',
      title: 'Opss..',
      text: 'Debes Instalar Metamask'
    }
  ));
  }

   isConnect(){
    //this.walletService.emitAddressConnected();
   }
}
