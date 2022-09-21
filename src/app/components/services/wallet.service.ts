import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs'
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MsgParam } from './msg-param';
import Swal from 'sweetalert2';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class WalletService {


  connected = new BehaviorSubject<boolean>(false);
  changeUser = new BehaviorSubject<boolean>(false);
  userAddress = new BehaviorSubject<string>("");
  contractAddress = environment.contractAddress;
  configUrl = 'assets/simple-abi.json';
  contractABI: string = '';
  ethereum: any = null;
  params: MsgParam;



  constructor(private http: HttpClient) {
    this.params = new MsgParam();
    if (this.existsMetamask()) {
      this.listenChangeUser();// we listen if the user connected other account
    } else {
      Swal.fire(
        {
          icon: 'error',
          title: 'Opss..',
          text: 'Debes Instalar Metamask'
        }
      )
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
    if (this.existsMetamask() && await this.chainNetwork()) {
      try {
        const account = await this.ethereum.request({
          method: 'eth_requestAccounts',
        });
        this.userAddress.next(account[0]);
      } catch (error: any) {
        if (error.code == 4902) {
          Swal.fire(
            {
              icon: 'error',
              title: 'Opss..',
              text: 'Qatar prode funciona sobre la red de Polygon(matic), por favor instala esa red. Mas abajo veras las instruccioens.'
            }
          )
        } else {
          Swal.fire(
            {
              icon: 'error',
              title: 'Opss..',
              text: 'Ocurrio un error por favor intenta de vuelta '
            }
          )
        }
        //loguear error
      }
    }


  }

  async chainNetwork(): Promise<boolean> {
    try {
      await this.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: environment.chainId }], //0x1 etherum mainet, 0x2 goerli, 0x4 etherum Rinkbey
      });
      return true;
    } catch (error: any) {
      if (error.code == 4902) {
        Swal.fire(
          {
            icon: 'error',
            title: 'Opss..',
            text: 'Qatar prode funciona sobre la red de Polygon(matic), por favor instala esa red. Mas abajo veras las instruccioens.'
          }
        )
      }
      console.log(error.message);
      return false;


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

  listenChangeUser() {
    this.ethereum.on('accountsChanged',
      (account: any) => {
        this.userAddress.next(account[0]);
        console.log(account[0]);
      });
  }


  async signData(_nonce: string) {
    try {
      const from = this.getAddressConnnected();
      const sign = await this.ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [from, JSON.stringify(this.params.getMsgParam(_nonce))],
      });
      console.log(sign)

    } catch (err) {
      console.error(err);
      // signTypedDataV4Result.innerHTML = `Error: ${err.message}`;
    }
  };

}


/*   emitAddressConnected() {
    if (this.existsMetamask()) {
      let address = this.getAddressConnnected();
      if (address) this.userAddress.next(address);
      console.log(address);
    }
  } */


