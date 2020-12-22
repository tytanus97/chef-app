import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Order } from '../models/order';
import { OrderedDish } from '../models/orderedDish';
import { OrdersService } from '../services/orders/orders.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit,OnDestroy{
  public orders: Array<Order>;
  private _activeOrders$;
  constructor(private _ordersService: OrdersService,private _alertCtrl: AlertController) {}

  ngOnInit(): void {
    this._activeOrders$ = this._ordersService.activeOrders.subscribe(res => {
      this.orders = res;
    })
  }

  changeStatusToCurrentryPrepared(orderedDish: OrderedDish) {

    const callback = () => {
      orderedDish.orderDishStatus = 'currentlyPrepared';
    }

    this.showConfirmAlert("Zmienić status na 'W trakcie przygotowania' ?",callback);

  }
  changeStatusToReady(orderedDish) {
    const callback = () => {
      orderedDish.orderDishStatus = 'ready'
    }
    this.showConfirmAlert("Zmienić status na 'Gotowe' ?",callback);
  }

  private async showConfirmAlert(msg,callback) {
    const alert = await this._alertCtrl.create({
      message:msg,
      buttons:[
        {
          text:'Nie',
          role:'cancel'
        },
        {
          text:'Tak',
          handler:callback
        }
      ]
    });
    await alert.present();
  }

  ngOnDestroy() {
    this._activeOrders$.unsubscribe();
  }





}
