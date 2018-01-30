import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  /**
   * コンストラクタ
   */
  constructor() {
  }

  /**
   * 地図の表示
   */
  initMap() {
    console.log('initMap');

    const me = this;
    const params = me.getParams();
    const yahoo = (<any>window).Y;
    const map = new yahoo.Map('map', {'configure': {'scrollWheelZoom': true}});
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
            geo.execute({query: params.address}, function(ydf) {
              // 検索結果のYDF（Yahoo地図の標準データフォーマット）より緯度・経度を取得
              // YDFとは： https://developer.yahoo.co.jp/webapi/map/openlocalplatform/v1/ydf/#about
              if (ydf.features.length > 0) {
                const destination = ydf.features[0].latlng;

                // 経路探索プラグインを追加
                const plugin = new yahoo.RouteSearchPlugin({'latlngs': [origin, destination]});
                map.addPlugin(plugin);

                // 目的地のマーカーを表示
                map.addFeature(new yahoo.Marker(destination));

                // 取引先の名称をラベルに表示
                if (params.accountName) {
                  map.addFeature(new yahoo.Label(destination, params.accountName));
                }

              } else {
                alert('取引先の位置情報の取得に失敗しました。');
              }
            });
          }
        },
        function(error) {
          let reason = '';
          switch (error.code) {
            case 1:
              reason = '位置情報が許可されていません。';
              break;
            case 2:
              reason = 'デバイスの位置が分かりません。';
              break;
            case 3:
              reason = 'タイムアウトしました。';
              break;
          }
          alert('現在位置の取得に失敗しました。[' + reason + ']');
        }
      );
    }
  }

  /**
   * URLパラメータの取得
   */
  getParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      'accountName': params.get('accountName'),
      'address': params.get('address')
    };
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    console.log('ngOnInit');

    // 地図の表示
    this.initMap();
  }
}
