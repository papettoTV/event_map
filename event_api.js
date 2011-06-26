//　初期化
var geocoder = new google.maps.Geocoder();
var infowindow = new google.maps.InfoWindow();
var event_data = new Array();
//var event_data = new google.maps.MVCArray;

var search_latlng = new Array();
var search_pref = new Array();
var now = new Date();
var now_time = now.getTime();
//var now_j = $.getDate();
//var now_time = now_j.Seconds();
var currentInfoWindow;

var pref_search_count=0;

var followers=[];

if($.cookie("event_map_center_lng") > 0 && $.cookie("event_map_center_lat") > 0){
		var osaka = new google.maps.LatLng($.cookie("event_map_center_lat"), $.cookie("event_map_center_lng"));
}else{
		var osaka = new google.maps.LatLng(34.68, 135.5);
}
var initialLocation=osaka;

var browserSupportFlag =  new Boolean();

	
  // 位置情報取得
  // Try W3C Geolocation (Preferred)
if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
	  resultGps("W3C Geolocation");
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  // Try Google Gears Geolocation
  } else if (google.gears) {
    browserSupportFlag = true;
    var geo = google.gears.factory.create('beta.geolocation');
    geo.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.latitude,position.longitude);
	  resultGps("Google Gears Geolocation");
    }, function() {
      handleNoGeoLocation(browserSupportFlag);
    });
  // Browser doesn't support Geolocation
  } else {
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
  }


function handleNoGeolocation(errorFlag) {
		if (errorFlag == true) {
				resultGps("Geolocation service failed.");
						initialLocation = osaka;
		} else {
				resultGps("Your browser doesn't support geolocation. We've placed you in Siberia.");
						initialLocation = osaka;
		}
}

function resultGps(res){
	$("#result_gps").html(res);
}

google.maps.event.addDomListener(window, 'load', function() {

// フォロワーズをセット
/*
		$.ajax({
		type: "GET",
		url: "get_followers.php",
		cache:true,
		async:true,
		data: {},
		dataType: "json",
		success: function(data){followers = data;},
		error: function(XMLHttpRequest, textStatus, errorThrown){
				alert("ajax error = " + errorThrown);
		}
});
*/

		// 期間のラジオボタン初期設定
		var term = $.cookie("event_map_term");
		if(term != "" && term > 0){
				$("input[name=term]").val([term]);
		}else{
				$("input[name=term]").val(['7']);
		}

		// キーワード初期設定
		var keywords = $.cookie("event_map_keywords");
		if(keywords != ""){
				$("input[name=keywords]").val([keywords]);
		}else{
				$("input[name=keywords]").val(['']);
		}

		if($.cookie("event_map_zoom") > 0){
				initZoom = parseInt($.cookie("event_map_zoom"));
		}else{
				initZoom = 11; 
		}

		var myOptions = {
				zoom: initZoom,
				center: initialLocation,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				scaleControl: true,
		};



		// 地図描画
		var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

		// 地図の大きさをスマホと振り分け
		var useragent = navigator.userAgent;
		var mapdiv = $("#map_canvas");
		var smartphone;
		if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
				mapdiv.css("width","100%");
				mapdiv.css("height","300px");
				smartphone=true;
		} else {
				mapdiv.css("width","100%");
				mapdiv.css("height","500px");
				smartphone=false;
		}

		// 初期位置 
		map.setCenter(initialLocation);

		// 逆geoコーディング
		var latlng = new google.maps.LatLng(initialLocation.lat(),initialLocation.lng());
		refreshMarker(map);

		//--------------
		// イベントハンドラ
		//--------------
		// 期間が選択されてもAPI投げる
		$("input[name=term]").change(function(){
				refreshMap();
		});
		
		// 絞り込むボタン
		$("input[name=submit]").click(function(){
				refreshMap();
		});
		// text 内でenterでも更新
		$('input[name=keywords]').keypress(function (e) {
				if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
						refreshMap();
				}
		});




		// map ズームイベント
		google.maps.event.addListener(map, 'zoom_changed', function() {
				zoomLevel = map.getZoom();
				$.cookie("event_map_zoom",zoomLevel,{expires:7});

				if (zoomLevel == 0) {
						map.setZoom(10);
				}      
				
				//検索済み都道府県初期化
				search_pref = new Array();
		});

		// map 移動イベント
		//google.maps.event.addListener(map, 'bounds_changed', function() {
		//google.maps.event.addListener(map, 'center_changed', function() {
		google.maps.event.addListener(map, 'dragend', function() {

				// 検索デバッグ消去
				$("#get_location_result").html("　");

				//検索対象初期化
				search_latlng = new Array();
				search_pref = new Array();
				pref_search_count=0;

				center = map.getCenter();
				$.cookie("event_map_center_lat",center.lat(),{expires:7});
				$.cookie("event_map_center_lng",center.lng(),{expires:7});

				refreshMarker(map);
		});

		//-------------
		// 関数定義
		//------------

		function refreshMap(){
				// 検索デバッグ消去
				$("#get_location_result").html("　");

				var keywords = $("input[name=keywords]").val();
				$.cookie("event_map_keywords",keywords,{expires:7});

				//検索対象初期化
				search_latlng = new Array();
				search_pref = new Array();
				pref_search_count=0;

				refreshMarker(map);
		}
		// APIの取得結果を処理
		function loadEvent(data){
				var latlng ;
				var infowindow;
				// イベント配列に結果をセット
				for(i=0;i<data.results_returned;i++){
						ev = data.events[i];
						if(ev.lat != "" && ev.lon != ""){
								if(event_data[ev.event_id]==undefined){
										event_data[ev.event_id] = {};
										event_data[ev.event_id] = ev;
								}
						}
				}
/*
				// マーカー削除
				for(var i in event_data){
					 if(event_data[i].marker){
					//if(event_data[i].marker != undefined){
						event_data[i].marker.setMap(null);
					}
				}
*/
				// マーカー設置
				for(var ev in event_data){
						var latlng = new google.maps.LatLng(event_data[ev].lat,event_data[ev].lon);
						//var t = new Date(event_data[ev].started_at);
						var icon = "http://maps.google.co.jp/mapfiles/ms/icons/yellow-dot.png";
						if(event_data[ev].started_at){
								y = event_data[ev].started_at.substr(0,4);
								m = event_data[ev].started_at.substr(5,2);
								d = event_data[ev].started_at.substr(8,2);
								//console.log("event_date = ",y,m,d);
								var t = new Date(y,parseInt(m)-1,d);

								diff_day = ((t.getTime() - now_time) / (1000*60*60*24)) + 1;
								if (diff_day < 0) {
										// 過去のイベント
										icon = "http://maps.google.co.jp/mapfiles/ms/icons/blue-dot.png";
								} else if (diff_day < 7) {
										// 1週間以内のイベント
										icon = "http://maps.google.co.jp/mapfiles/ms/icons/red-dot.png";
								} else if (diff_day < 31) {
										// 1ヶ月以内のイベント
										icon = "http://maps.google.co.jp/mapfiles/ms/icons/yellow-dot.png";
								} else {
										icon = "http://maps.google.co.jp/mapfiles/ms/icons/green-dot.png";
								}
								//console.log(diff_day);
						}
												
						var	marker = new google.maps.Marker({
								position: latlng, 
										map: map,
										icon:icon, 
						});
						event_data[ev].marker = marker;

						// infowindow設置
						/*
						var infowindow = new google.maps.InfoWindow({
								content: infohtml(ev)//,
										//        size: new google.maps.Size(50,50)
						});
*/
						// 何故か関数かしないとうまくいかない
						setInfoHtml(event_data[ev].marker , new google.maps.InfoWindow({
								content: infohtml(ev)
						}));
				}

				// ロード完了
				$("#loading").html("");

		}

		function setInfoHtml(marker,infowindow){
				google.maps.event.addListener(marker, 'click', function() {
						infowindow.open(map,marker);
                        //先に開いた情報ウィンドウがあれば、closeする
                        if (currentInfoWindow) {
                                currentInfoWindow.close();
                        }
						currentInfoWindow = infowindow;
				});
		}

		// infowindowのhtml 
		function infohtml(no){
				eo = event_data[no];
				var h = "";
				h += "<div class='event_title'><a href='"+ eo.event_url +"' target='_blank'>"+ eo.title+"</a></div>";
				h += "<div class='event_detail'>";
				// h += "<a href='"+eo.event_url+"' target='_blank' >" + eo.title + "</a>";
				// h += eo.place + "<br />";
				var week = new Array("日", "月", "火", "水", "木", "金", "土");
				// 
				if(eo.started_at != null){
						y = eo.started_at.substr(0,4);
						m = eo.started_at.substr(5,2);
						d = eo.started_at.substr(8,2);
						hh = eo.started_at.substr(11,2);
						i = eo.started_at.substr(14,2);
//						console.log("event_date = "+y,m,d);
						var h_d = new Date(y,parseInt(m)-1,d,hh,i);
						h += h_d.getFullYear() + "/";
						h += (h_d.getMonth()+1) + "/";
						h += h_d.getDate() + "";
						h += "(" + week[h_d.getDay()] + ") ";
						h += h_d.getHours() + ":";
						//h += h_d.getMinutes();
						//h += String(h_d.getMinutes());
						h += i;
						h += "〜";
				}
				h += "</div>";
				return h;
		}
		function refreshMarker(map){

				// ローディング
				if(smartphone){
						$("#loading").html("loading...");
				}else{
						$("#loading").html("<img src='ajax-loader.gif' /> loading...");
				}

				// マーカー削除
				for(var i in event_data){
					 if(event_data[i].marker){
					//if(event_data[i].marker != undefined){
						event_data[i].marker.setMap(null);
					}
				}

				// イベントデータ初期化
				event_data = new Array();
				
				// 地図中央の緯度経度セット
				search_latlng.push(map.getCenter());
				
				// 逆geoコードのレスポンスが不安定なのと、都道府県が一つとは限らんので、
				// 地図の中心と四隅の緯度経度から都道府県算出
				bound = map.getBounds();
				//console.log(bound);
				if(bound){
						y1 = (bound.getSouthWest()).lat();
						x1 = (bound.getSouthWest()).lng();
						y2 = (bound.getNorthEast()).lat();
						x2 = (bound.getNorthEast()).lng();


						nw = new google.maps.LatLng(y1,x1);
						search_latlng.push(nw);
						nw = new google.maps.LatLng(y1,x2);
						search_latlng.push(nw);
						nw = new google.maps.LatLng(y2,x1);
						search_latlng.push(nw);
						nw = new google.maps.LatLng(y2,x2);
						search_latlng.push(nw);
				}
				//console.log(search_latlng);
				prefName();
		}

		// 緯度経度から都道府県を算出
		function prefName(){
				var pref = "";


				if(search_latlng[pref_search_count]){
						latlng = search_latlng[pref_search_count];

						pref_search_count++;
						geocoder.geocode({'latLng': latlng}, function(results, status) {

								if (status == google.maps.GeocoderStatus.OK) {
										//console.log(results);
										if (results[1]) {
										/*
												addresses = results[1].formatted_address.split(",");
										search_address = $.trim(addresses[1]);
										pref = search_address.charAt(0) + search_address.charAt(1) + search_address.charAt(2);
										 */
												pref = gGeoPref(results[1]);
												if(pref != "" && pref != "日本"){
														searchPref(pref);
												}else{
														pref = gGeoPref(results[0]);
														if(pref != "日本"){
																searchPref(pref);
														}
												}
												search_pref.push(pref);
										}
								}

						});
				}

		}

		// API の結果から逆geoコーディングで都道府県を取得
		function gGeoPref(res){
				address = res.formatted_address.split(",");
				search_address = $.trim(address[1]);
				pref = search_address.charAt(0) + search_address.charAt(1) + search_address.charAt(2);
				return pref;
		}

		// 都道府県からAPI検索
		function searchPref(pref){
				//console.log(search_pref);
				// すでに検索済みなら検索しない
				if(isInSearchPref(pref)){
						return;
				}
				// 都道府県じゃないなら検索しない
				if(!isPref(pref)){
						return;
				}

				// 検索都道府県デバッグ
				resultGetLocation(pref);

				// 検索期間取得
				var term = $("input[name=term]:checked").val();
				var d = new Date();
				var d_time = d.getTime();
				var search_term = new String();
				for(i=0;i<term;i++){
						var d_tmp = new Date(d_time + (i*1000*60*60*24))
						search_term += ymd(d_tmp) + ",";
				}
				//console.log(search_term);

				var prefs = pref + "," + pref.charAt(0) + pref.charAt(1);
				var follower_ids = "";
				/*
				for(var i in followers){
						follower_ids += "" + followers[i] + ",";
				}
				*/

				// キーワード
				var keywords = $("input[name=keywords]").val();
				//console.log(keywords);

				// APIリクエスト
				$.ajax({
						type: "GET",
								url: "atnd_api.php",
								//url: "zussar_api.php",
								// cache: false, 本当はfalseにしたいけどリクエストパラメターがおかしくなるので
								cache:true,
								async:true,
								//data: {"format":"json","keyword_or":prefs,"ymd":search_term,"twitter_id":follower_ids},
								data: {"format":"json","keyword_or":prefs,"keyword":keywords,"ymd":search_term},
								dataType: "json",
								success: loadEvent,
								error: function(XMLHttpRequest, textStatus, errorThrown){
										alert("ajax error = " + errorThrown);
								}
				});

				prefName();
		}

		// Dateオブジェクトからyyyymmddを返す
		function ymd(d){
				m = d.getMonth()+1;
				if(m<10){
						m = '0'+ String(m);
				}else{
						m = String(m);
				}
				return parseInt(String(d.getFullYear()) + m + String(d.getDate()));
		}

		// すでに検索済みの都道府県かチェック 
		function isInSearchPref(pref){
				for(var i in search_pref){
						if(search_pref[i] == pref){
								return true;
						}
				}
				return false;
		}

		// 都道府県かチェック 
		function isPref(pref){
				pl = ["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"]
						for(var i in pl){
								if(pl[i] == pref){
										return true;
								}
						}
				return false;
		}
		// 検索エリア表示
		function resultGetLocation(result_str){
				tmp = $("#get_location_result").html();
				$("#get_location_result").html(tmp + String(result_str) + ",");
				//$("#get_location_result").html(String(result_str));
		}
});
