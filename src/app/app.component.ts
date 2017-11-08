import {Component, OnInit} from '@angular/core';
import {YahooMapServiceProvider} from '../providers/yahoo-map-service/yahoo-map-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  accountname = 'NHK';
  address = '東京都渋谷区神南2-2-1';

  constructor(private yahooMap: YahooMapServiceProvider) {
  }

  initMap() {
    console.log('initMap');
    const me = this;
    const yahoo = (<any>window).Y;
    const map = new yahoo.Map('map');

    // 地図を描画
    map.drawMap(new yahoo.LatLng(35.662484, 139.734222), 13, yahoo.LayerSetId.NORMAL);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(pos) {
          // 現在地
          const origin = new yahoo.LatLng(pos.coords.latitude, pos.coords.longitude);

          // 現在地のマーカーを表示
          map.addFeature(new yahoo.Marker(origin));

          // 取引先の住所が登録されている場合
          if (me.address) {
            // 住所を緯度・経度に変換する
            me.yahooMap.load(me.address).then((data: any) => {
              let destination;
              if (data.Feature.length > 0) {
                const arr = data.Feature[0].Geometry.Coordinates.split(',');
                if (arr.length == 2) {
                  // 目的地
                  destination = new yahoo.LatLng(arr[1], arr[0]);

                  // 経路探索プラグインを追加
                  const plugin = new yahoo.RouteSearchPlugin({'latlngs': [origin, destination]});
                  map.addPlugin(plugin);

                  // 目的地のマーカー、ラベルを表示
                  map.addFeature(new yahoo.Marker(destination));
                  map.addFeature(new yahoo.Label(destination, me.accountname + '：' + me.address));
                }
              }
              if (!destination) {
                throw new Error('取引先の位置情報の取得に失敗しました。');
              }
            }).catch((err) => {
              throw err;
            });
          }
        },
        function(error) {
          console.error('現在位置の取得に失敗しました。[' + error.code + ']');
        }
      );
    }
  }

  ngOnInit() {
    this.initMap();
  }
}
