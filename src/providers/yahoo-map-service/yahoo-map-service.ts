import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the YahooMapServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class YahooMapServiceProvider {
  private YAHOO_APP_ID = 'dj00aiZpPU1wQ0o0c2NEOWFxQSZzPWNvbnN1bWVyc2VjcmV0Jng9MzI-';

  constructor(public http: Http) {

  }

  load(address: string) {
    return new Promise(resolve => {
      let url = 'https://map.yahooapis.jp/geocode/V1/geoCoder?appid='
        + this.YAHOO_APP_ID
        + '&query=' + encodeURIComponent(address)
        + '&output=json';

      this.http.get(url)
        .map(res => res.json())
        .subscribe(data => resolve(data))
    });
  }
}
