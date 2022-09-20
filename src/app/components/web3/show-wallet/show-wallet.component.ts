import { Component, OnInit } from '@angular/core';
import { throwIfEmpty } from 'rxjs';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-show-wallet',
  templateUrl: './show-wallet.component.html',
  styleUrls: ['./show-wallet.component.css']
})
export class ShowWalletComponent implements OnInit {

  constructor(private walletService:WalletService) { 
    
  }
  address:string="";
  ngOnInit(): void {
    this.walletService.userAddress.subscribe(input => this.address = input);
  }

}
