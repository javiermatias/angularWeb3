import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  fireError(_msg: string) {
    Swal.fire(
      {
        icon: 'error',
        title: 'Opss..',
        text: _msg
      }
    )
  }
}
