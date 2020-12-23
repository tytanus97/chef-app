import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { AlertController, IonCard } from '@ionic/angular';
import { EventEmitter } from 'events';
import { BehaviorSubject, interval, of, timer} from 'rxjs';
import { takeUntil, mergeMap} from 'rxjs/operators'
import { Order } from '../models/order';
import { OrderedDish } from '../models/orderedDish';
import { OrdersService } from '../services/orders/orders.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit,OnDestroy {

  private destroy = new BehaviorSubject<void>(null);
  public orders: Array<Order>;

  constructor(private _ordersService: OrdersService,private _alertCtrl: AlertController) {}
  ngOnInit(): void {
    
   /*  interval(1000).pipe(mergeMap(() => of('xd'))).subscribe(res => console.log(res)); */
    
    timer(0,5000).pipe(mergeMap(() => {
      console.log('request send')
      return this._ordersService.activeOrders.asObservable()
    })).subscribe(res => {
      this.orders = res;
    });
  }

  changeStatusToCurrentryPrepared(orderedDish: OrderedDish) {

    const callback = () => {
      orderedDish.orderDishStatus = 'currentlyPrepared';
    }

    this.showConfirmAlert("Zmienić status na 'W trakcie przygotowania' ?",callback);
  }
  changeStatusToReady(orderedDish:OrderedDish,order:Order,orderCardRef:ElementRef) {
    const callback = () => {
      orderedDish.orderDishStatus = 'ready'
      setTimeout(() => {
        orderedDish.orderDishStatus = 'delivered'
        this.checkOrderStatus(order,orderCardRef);
        this._ordersService.fetchActive();
      },5000);
   
    }
    this.showConfirmAlert("Zmienić status na 'Gotowe' ?",callback);
  }

  checkOrderStatus(order: Order,el: ElementRef) {
    for(const orderedDish of order.orderedDishes) {
      if(orderedDish.orderDishStatus !== 'delivered') return;
    }
    order.orderStatus = 'finished';
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
    this.destroy.next();
  }
}
