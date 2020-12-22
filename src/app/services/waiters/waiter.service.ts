import { Injectable } from '@angular/core';
import { Waiter } from 'src/app/models/waiter';

@Injectable({
  providedIn: 'root'
})
export class WaiterService {

  private _waiters: Array<Waiter>;

  constructor() {
  }

  public findWaiterById(id:string): Waiter {
    const waiter: Waiter = this._waiters.find(w => w.waiterId === id);
    return waiter;
  }
}
