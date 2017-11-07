import {Component, OnInit} from '@angular/core';
import {YahooMapServiceProvider} from '../providers/yahoo-map-service/yahoo-map-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';

  constructor(private yahooMap: YahooMapServiceProvider) {
  }

  initMap() {
    console.log('initMap');
    const me = this;
    const yahoo = (<any>window).Y;
    const map = new yahoo.Map('map');

    // 地図を描画
    map.drawMap(new yahoo.LatLng(35.662484, 139.734222), 13, yahoo.LayerSetId.NORMAL);
  }

  ngOnInit() {
    this.initMap();
  }
}
