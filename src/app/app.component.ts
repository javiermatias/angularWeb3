import { ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import { WalletService } from './components/services/wallet.service';

declare let window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'sign';
  accountConnected:string='';


  constructor(private walletService:WalletService,private cdr:ChangeDetectorRef){
  
  }
 ngOnInit():void{
   
   //const myTimeout = setTimeout(() => this.walletService.emitAddressConnected(), 500);
   
  }

  async connect(){
    try {
      const account = await window['ethereum'].request({
        method: 'eth_requestAccounts',
      });
      this.accountConnected = account[0];
      window['ethereum'].on('accountsChanged', (accounts:string)=> console.log('cambio' + accounts[0] ))
    } catch (error) {
      console.error(error);
    }
  }

  checkMetaMask(){
     //Have to check the ethereum binding on the window object to see if it's installed
     
     return Boolean(window['ethereum'] && window['ethereum'].isMetaMask);
  }
/*   ngAfterViewInit(): void{
    console.log("6. ngAfterViewInit from parent.");
    console.log( window.ethereum._state.accounts);
   } 
   ngAfterViewChecked(): void{
    console.log("7. ngAfterViewChecked from child.");
    console.log( window.ethereum._state.accounts);
    this.walletService.emitAddressConnected();
   } */
}


