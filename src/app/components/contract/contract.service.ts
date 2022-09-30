import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { environment } from 'src/environments/environment';

declare let window: any;
import { Contract } from 'web3-eth-contract';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AlertService } from '../services/alert.service';
@Injectable({
  providedIn: 'root'
})
export class ContractService {
  web3!: Web3;
  contract!: Contract;
  contractAddress = environment.contractAddress;
  configUrl = 'assets/prode-abi.json';
  contractABI: any;

  constructor(private http: HttpClient, private alert: AlertService) {

    if (typeof window.ethereum !== 'undefined') {
      this.web3 = new Web3(window.ethereum);
      this.getConfig().subscribe(
        (data: any) => {
          this.contractABI = data.abi;
          this.contract = new this.web3.eth.Contract(this.contractABI, this.contractAddress);
          console.log(data.abi)
        });

    }
  }

  async getUserEnter() {
    if (this.contract) {
      let users = await this.contract.methods.governance().call();
      console.log(users);
    }
  }

  async deposit() {
    let enter;
    if (this.contract) {
      enter = await this.contract.methods.deposit().send({ from: window.ethereum.selectedAddress, value: '25000000000000000000' })
    }else{
    
      this.alert.fireError("Por favor conecta metamask primero");

    }
    console.log(enter)
  }

  getConfig() {
    return this.http.get<any>(this.configUrl);
  }

}
