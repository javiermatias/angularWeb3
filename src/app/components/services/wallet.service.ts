import { EnvironmentInjector, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs'
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ethers } from "ethers";
import Swal from 'sweetalert2';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class WalletService {


  connected = new BehaviorSubject<boolean>(false);
  userAddress = new BehaviorSubject<string>("");
  contractAddress = environment.contractAddress;
  configUrl = 'assets/simple-abi.json';
  contractABI: string = '';
  ethereum: any = null;
 


  constructor(private http: HttpClient) {
    if(this.existsMetamask()){
      console.log("Hay Billetera");
    }else{
      console.log("No hay billetera")
    }

  }

  existsMetamask(): boolean {
    if (typeof window.ethereum !== 'undefined') {
      this.ethereum = window.ethereum;
      return true;
    }
    return false;
  }

  getConfig() {
    this.http.get<any>(this.configUrl).subscribe(
      (data: any) => this.contractABI = data.abi);
  }

  async connect() {
    if (!this.existsMetamask()) {
      Swal.fire(
        {
          icon: 'error',
          title: 'Opss..',
          text: 'Debes Instalar Metamask'
        }
      )
    } else {
      try {
        await this.chainNetwork();
        const account = await this.ethereum.request({
          method: 'eth_requestAccounts',
        });

        this.userAddress.next(account[0]);
       
      } catch (error) {
        console.error(error);
        throw error;
      }
    }


  }

  async chainNetwork() {
    try {
      await this.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: environment.chainId }], //0x1 etherum mainet, 0x2 goerli, 0x4 etherum Rinkbey
      });
    } catch (error: any) {
      
      if (error.code == 4902) {
        await this.addChain();
      }else{
          throw error;
      }
    }
  }

  async addChain() {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: environment.chainId,
          chainName: environment.networkName,
          rpcUrls: [environment.rpcURL],
          blockExplorerUrls: [environment.explorerURL],

          nativeCurrency: {
            name: environment.currencyName,
            symbol: environment.currencySymbol, // 2-6 characters long
            decimals: 18,
          },
        },
      ],
    });
  }
  isConnected(): boolean {

    return this.ethereum.selectedAddress ? true : false;
  }
  getAddressConnnected(): string | undefined {
    console.log(this.ethereum.selectedAddress);
    return this.ethereum.selectedAddress;
  }

  emitAddressConnected() {
    if (this.existsMetamask()) {
      let address = this.getAddressConnnected();
      if (address) this.userAddress.next(address);
      console.log(address);
    }
  }

}
