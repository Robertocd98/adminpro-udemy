import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor() {

    this.subscription = this.regresasObservable()
    .subscribe(
      numero => console.log( 'subs: ', numero ),
      error => console.error('error en el obs', error),
      () => console.log('el observador termino')
    );

   }

  ngOnInit() {
  }

  ngOnDestroy() {
    console.log('la pagina se va a cerrar');
    this.subscription.unsubscribe();
  }

  regresasObservable(): Observable< any > {

    return  new Observable( (observer: Subscriber<any>) => {

      let contador = 0;

      let intervalo = setInterval( () => {

        contador ++;

        let salida = {
          valor: contador
        };

        observer.next( salida );

        // if (contador === 3) {
        //  clearInterval(intervalo);
        //  observer.complete();
        // }

        if (contador === 1000) {
          clearInterval(intervalo);
          observer.error('Auxilio');
        }

      }, 1000 );

    }).pipe(
      map( resp => resp.valor),
      filter( (valor, index) => {
        if ( (valor % 2) === 1 ) {
          // impar
          return true;
        } else {
          // par
          return false;
        }
      } )
    );


  }

}
