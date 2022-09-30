import { Component,  OnInit} from '@angular/core';
import { ContractService } from './components/contract/contract.service';
import { WalletService } from './components/services/wallet.service';
import { NgxSpinnerService } from "ngx-spinner";
declare let window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'sign';
  accountConnected:string='';


  constructor(private walletService:WalletService, 
    private contract: ContractService,
    private spinner: NgxSpinnerService){
  
  }
 ngOnInit():void{
  this.spinner.show();

  setTimeout(() => {
    /** spinner ends after 5 seconds */
    this.spinner.hide();
  }, 3000);

   
  }

   async getUsers(){
    
    console.log("before");
    this.spinner.show();
   await this.contract.getUserEnter();
   this.spinner.hide();
    console.log("after");
  }

  async deposit(){
   try{
    console.log("before");
    this.spinner.show();
   await this.contract.deposit();
   
    console.log("after");
   }catch(error){
  
   }finally{
    this.spinner.hide();
   }

  }

  

/*   async connect(){
    try {
      const account = await window['ethereum'].request({
        method: 'eth_requestAccounts',
      });
      this.accountConnected = account[0];
      window['ethereum'].on('accountsChanged', (accounts:string)=> console.log('cambio' + accounts[0] ))
    } catch (error) {
      console.error(error);
    }
  } */

/*   checkMetaMask(){
     //Have to check the ethereum binding on the window object to see if it's installed
     
     return Boolean(window['ethereum'] && window['ethereum'].isMetaMask);
  } */
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


