import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs'
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MsgParam } from './msg-param';
import { Sign } from './sign';
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
  nonce: Number = 0;
  endPoint: string = 'http://localhost:3000/sign';
  sign: Sign | undefined;


  constructor(private http: HttpClient) {
    this.params = new MsgParam();
    //this.getNonce('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    //this.postNonce('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0xddf5be2817a220c350778b23784b2d5eca7f2dd63c07b95f7572756db69d20456c02f68ec27d705f231a2904915d0be26f5d2d94715ca71263da11b8b17975ff1b');
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

  /*   getConfig() {
      this.http.get<any>(this.configUrl).subscribe(
        (data: any) => this.contractABI = data.abi);
    } */

  /*   getNonce(address: string) {
      this.http.get<Number>(address).subscribe(
        (data: Number) => this.contractABI = data.abi);
    } */
  getNonce(address: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.endPoint + "/" + address)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }

  postNonce(_sign: Sign): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.endPoint, this.sign = {
          address: _sign.address,
          sign: _sign.sign
        })
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }

  async connect(): Promise<boolean> {
    if (this.existsMetamask() && await this.chainNetwork()) {
      try {
        const account = await this.ethereum.request({
          method: 'eth_requestAccounts',
        });
        //Fetch nonce from server

        let nonce = await this.getNonce(account[0]);
        console.log(nonce);
        let signN = await this.signData(nonce, account[0])
        if (signN !== "") {
          let _sign: Sign = { address: account[0], sign: signN }
          await this.postNonce(_sign);
          this.userAddress.next(account[0]);
          return true;
        }

        this.fireAlert("Hubo un problema al firmar la transaccion");


      } catch (error: any) {

        this.fireAlert("Hubo un error al conectarse al sistema");

        console.log("Error" + error.message);

      }
    }
    return false;


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
            text: 'Qatar prode funciona sobre la red de Polygon(matic), por favor instala esa red. Mas abajo veras las instrucciones.'
          }
        )
      }
      console.log(error.message);
      return false;


    }
  }

  async addChain(): Promise<boolean> {

    try {
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
      return true;

    } catch (error: any) {
      console.log(`Error in add chain ${error.message}`)
      return false;

    }

  }
  isConnected(): boolean {
    if (this.existsMetamask()) {
      return this.ethereum.selectedAddress ? true : false;
    }
    return false;

  }
  getAddressConnnected(): string | undefined {

    return this.ethereum.selectedAddress;
  }

  listenChangeUser() {
    this.ethereum.on('accountsChanged',
      async (account: any) => {
        this.userAddress.next(account[0]);
        await this.connect();
        console.log(account[0]);
      });
  }

  areInSameUser() {

  }


  async signData(_nonce: string, _address: string): Promise<string> {
    try {
      const from = _address;
      const sign = await this.ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [from, JSON.stringify(this.params.getMsgParam(_nonce))],
      });

      console.log(sign)
      return sign;
    } catch (err) {
      console.error(err);
      return "";
    }
  };

  fireAlert(_msg: string) {
    Swal.fire(
      {
        icon: 'error',
        title: 'Opss..',
        text: _msg
      }
    )
  }

}



