import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor() {
  }

  initMap() {
    const me = this;
    const params = (<any>window).getParams();
    const yahoo = (<any>window).Y;
    const map = new yahoo.Map('map');
    const geo = new yahoo.GeoCoder();

    // 地図を描画
    map.drawMap(new yahoo.LatLng(35.662484, 139.734222), 13, yahoo.LayerSetId.NORMAL);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(pos) {
          // 現在位置のマーカーを表示
          const origin = new yahoo.LatLng(pos.coords.latitude, pos.coords.longitude);
          map.addFeature(new yahoo.Marker(origin));

          // 取引先の住所が登録されている場合、取引先までの経路を表示
          if (params.address) {

            // 住所を緯度・経度に変換する
            geo.execute({query: decodeURI(params.address)}, function(ydf) {
              if (ydf.features.length > 0) {
                const destination = ydf.features[0].latlng;

                // 経路探索プラグインを追加
                const plugin = new yahoo.RouteSearchPlugin({'latlngs': [origin, destination]});
                map.addPlugin(plugin);

                // 目的地のマーカーを表示
                map.addFeature(new yahoo.Marker(destination));

                // 取引先の名称をラベルに表示
                if (params.accountname) {
                  map.addFeature(new yahoo.Label(destination, params.accountname));
                }

              } else {
                console.error('取引先の位置情報の取得に失敗しました。');
              }
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
    console.log('ngOnInit');

    // 地図の表示
    this.initMap();
  }
}
