	geocoder = new GClientGeocoder();

	// 繧ｪ繝悶ず繧ｧ繧ｯ繝亥叙蠕・
	function getObj(elem){
		if(document.getElementById && !document.all || document.layers) obj = document.getElementById(elem);
		else if(document.all) obj = document.all(elem);
		return obj;
	}

	// 繧､繝吶Φ繝医Μ繧ｹ繝翫・
	function evtLtn(elm, type, func, useCapture){
	 if(!elm) return false;
	 if(!useCapture) useCapture = false;

	 if(elm.addEventListener) elm.addEventListener(type, func, false);
	 else if(elm.attachEvent) elm.attachEvent('on'+type, func);
	 else return false;

	 return true;
	}

	// ajax騾壻ｿ｡
	function createObject() {
		var request_type;
		var browser = navigator.appName;
		if(browser == "Microsoft Internet Explorer"){
			request_type = new ActiveXObject("Microsoft.XMLHTTP");
		}else{
			request_type = new XMLHttpRequest();
		}
			return request_type;
	}
	var http = createObject();
	var teamObj = [];

	function initialize() {

		var team = new Array();
		var tlist = getObj("teamlist");
		var preflist = getObj("preflist");
		var xmlObj = [];

		// 繝槭・繧ｫ繝ｼ繧｢繧､繧ｳ繝ｳ險ｭ螳・
		icon = new GIcon();
		icon.image = '/test/gmap/red-dot.png';
		icon.shadow = '/test/gmap/red-dot.shadow.png';
		icon.iconSize=new GSize(32,32);
		icon.shadowSize=new GSize(59,32);
		icon.iconAnchor=new GPoint(16,32);
		icon.infoWindowAnchor=new GPoint(16,0);

		// 繝√・繝諠・ｱ
		var teamInfo=function (zip,name,id,LNG,LAT,point,mrank,mpoint,arearank,marearank){
			this.zip=zip;
			this.name=name;
			var html = new String("");
			html += "<div class=\"infowindow\">";
			html += "<table border=\"0\">";
			html += "<tr>";
			html += "<td>";
			html += "<a href=\"/tg/"+id+"\" target=\"_blank\">";
			html += "<img src=\"/resize_img.php?teamid="+id+"&width=64&height=48\" />";
			html += "</a>";
			html += "</td>";
			html += "<td>";
			html += "<a href=\"/tg/"+id+"\" target=\"_blank\">";
			html += name;
			html += "</a><br />";
//			html += "<b>"+mpoint+"</b><span style=\"font-size: small;\"> pop・・+zip+" "+arearank+"菴搾ｼ丞・蝗ｽ "+ mrank +"菴搾ｼ・/span>";
			html += "</td>";
			html += "</tr>";
			html += "</table>";
			html += "</div>";

			this.html = html;
			this.id=id;
			this.LNG=LNG;
			this.LAT=LAT;
			this.point=point;
		};

		function ajaxrequest(center,bounds){
			getObj("result").innerHTML = "<img src=\"ajax-loader.gif\" width=\"10\" height=\"10\" />隱ｭ縺ｿ霎ｼ縺ｿ荳ｭ";

			var s = bounds.getNorthEast();
			var filename = "teamlist.php?cx=" + center.x + "&cy=" + center.y + "&x=" + s.x + "&y=" + s.y;

			http.open('get', filename);
			http.onreadystatechange = displayData;
			http.send(null);
		}

		function displayData(){
			if(http.readyState == 4){
				setMarker(http.responseXML);
				xmlObj = http.responseXML;
			}
		}

		function dispinfo(id){
			for(i=0;i<teamObj.length ;i++){
				if(id == teamObj[i].id){
					map.openInfoWindowHtml(teamObj[i].point, teamObj[i].html);
					break;
				}
			}
		}


		if(GBrowserIsCompatible()) {
			var map = new GMap2(getObj("map_canvas"),{size : new GSize(527, 316)});

			map.addControl(new GLargeMapControl());

			var str = location.href;

			// 繝槭・繧ｫ繝ｼ險ｭ鄂ｮ
			function dropMarker(point,team){

				team.point = point;
				var marker = new GMarker(point,icon);
					GEvent.addListener(marker, "click", function() {
						map.openInfoWindowHtml(point, team.html);
					});
					
				map.addOverlay(marker);
			}

			function setMarker(xmlobj){

				var team_num = 0;
				if(xmlobj){
					team_num = xmlobj.getElementsByTagName('team').length;
				}

				map.clearOverlays();

				if(team_num > 20){
					var r = 20;
				}else{
					var r = team_num;
				}

				getObj("result").innerHTML =  team_num +"繝√・繝荳ｭ"+ r +"繝√・繝繧定｡ｨ遉ｺ";
				getObj("teamnum").innerHTML = team_num;

				// 繧ｻ繝ｬ繧ｯ繝医・繝・け繧ｹ荳隕ｧ蛻晄悄蛹・
				tlist.options.length =0;
				tlist.options[0] = new Option("繝√・繝縺ｯ縺・∪縺帙ｓ",0);

				for(i=0;i<r;i++){

					id = xmlobj.getElementsByTagName('id')[i].firstChild.data;
					name = xmlobj.getElementsByTagName('name')[i].firstChild.data.replace(/^\s+|\s+$/g, "");
					area = xmlobj.getElementsByTagName('area')[i].firstChild.data.replace(/^\s+|\s+$/g, "");
					lat = xmlobj.getElementsByTagName('lat')[i].firstChild.data;
					lng = xmlobj.getElementsByTagName('lng')[i].firstChild.data;
					mrank = xmlobj.getElementsByTagName('mrank')[i].firstChild.data;
					mpoint = xmlobj.getElementsByTagName('mpoint')[i].firstChild.data;
					arearank = xmlobj.getElementsByTagName('arearank')[i].firstChild.data;
					marearank = xmlobj.getElementsByTagName('marearank')[i].firstChild.data;

					teamObj[i] = new teamInfo(area,name,id,lng,lat,null,mrank,mpoint,arearank,marearank);

					// 邨悟ｺｦ邱ｯ蠎ｦ縺九ｉ繝槭・繧ｭ繝ｳ繧ｰ
					if(teamObj[i].LAT != 0){
						var point = new GLatLng(teamObj[i].LNG,teamObj[i].LAT);
						teamObj[i].point = point;
						dropMarker(point,teamObj[i]);
					}

					// 繧ｻ繝ｬ繧ｯ繝医・繝・け繧ｹ荳隕ｧ繧定｡ｨ遉ｺ
					tlist.options[i] = new Option(name,id);
				}
			}

			function isfarcenter(now,old,edge){
				var rate = 0.3;
				if(Math.abs(old.x - now.x) > Math.abs(edge.x - now.x)*rate){
					return true;
				}else if(Math.abs(old.y - now.y) > Math.abs(edge.y - now.y)*rate){
					return true;
				}else return false;
			}

			function moveCenter(host){

				var inipoint = [];
				var str = host;

				if(str){
					if     (str.match("osaka.pop.co.jp"))   { inipoint[0] = 34.33; inipoint[1] = 135.29;}
					else if(str.match("hokkaido.pop.co.jp")) { inipoint[0] = 43.34; inipoint[1] = 143;}
					else if(str.match("aomori.pop.co.jp")) { inipoint[0] = 40.42; inipoint[1] = 140.52;}
					else if(str.match("iwate.pop.co.jp")) { inipoint[0] = 39.48; inipoint[1] = 141.29;}
					else if(str.match("miyagi.pop.co.jp")) { inipoint[0] = 38.18; inipoint[1] = 140.46;}
					else if(str.match("akita.pop.co.jp")) { inipoint[0] = 39.51; inipoint[1] = 140.25;}
					else if(str.match("yamagata.pop.co.jp")) { inipoint[0] = 38.32; inipoint[1] = 140.09;}
					else if(str.match("fukushima.pop.co.jp")) { inipoint[0] = 37.2; inipoint[1] = 139.58;}
					else if(str.match("ibaraki.pop.co.jp")) { inipoint[0] = 36.11; inipoint[1] = 140.09;}
					else if(str.match("tochigi.pop.co.jp")) { inipoint[0] = 36.39; inipoint[1] = 139.43;}
					else if(str.match("gunma.pop.co.jp")) { inipoint[0] = 36.3; inipoint[1] = 138.45;}
					else if(str.match("saitama.pop.co.jp")) { inipoint[0] = 36.02; inipoint[1] = 139.09;}
					else if(str.match("chiba.pop.co.jp")) { inipoint[0] = 35.38; inipoint[1] = 140.17;}
					else if(str.match("tokyo.pop.co.jp")) { inipoint[0] = 35.4; inipoint[1] = 139.34;}
					else if(str.match("kanagawa.pop.co.jp")) { inipoint[0] = 35.26; inipoint[1] = 139.13;}
					else if(str.match("niigata.pop.co.jp")) { inipoint[0] = 37.16; inipoint[1] = 138.44;}
					else if(str.match("toyama.pop.co.jp")) { inipoint[0] = 36.36; inipoint[1] = 137.09;}
					else if(str.match("ishikawa.pop.co.jp")) { inipoint[0] = 36.21; inipoint[1] = 136.29;}
					else if(str.match("fukui.pop.co.jp")) { inipoint[0] = 35.56; inipoint[1] = 136.24;}
					else if(str.match("yamanashi.pop.co.jp")) { inipoint[0] = 35.46; inipoint[1] = 138.35;}
					else if(str.match("nagano.pop.co.jp")) { inipoint[0] = 36.12; inipoint[1] = 138.04;}
					else if(str.match("gifu.pop.co.jp")) { inipoint[0] = 35.59; inipoint[1] = 137.05;}
					else if(str.match("shizuoka.pop.co.jp")) { inipoint[0] = 35.06; inipoint[1] = 138.19;}
					else if(str.match("aichi.pop.co.jp")) { inipoint[0] = 35.04; inipoint[1] = 137.13;}
					else if(str.match("mie.pop.co.jp")) { inipoint[0] = 34.29; inipoint[1] = 136.25;}
					else if(str.match("shiga.pop.co.jp")) { inipoint[0] = 35.19; inipoint[1] = 136.08;}
					else if(str.match("kyoto.pop.co.jp")) { inipoint[0] = 35.13; inipoint[1] = 135.32;}
					else if(str.match("osaka.pop.co.jp")) { inipoint[0] = 34.33; inipoint[1] = 135.29;}
					else if(str.match("hyogo.pop.co.jp")) { inipoint[0] = 35.02; inipoint[1] = 134.41;}
					else if(str.match("nara.pop.co.jp")) { inipoint[0] = 34.1; inipoint[1] = 135.5;}
					else if(str.match("wakayama.pop.co.jp")) { inipoint[0] = 34.01; inipoint[1] = 135.22;}
					else if(str.match("tottori.pop.co.jp")) { inipoint[0] = 35.26; inipoint[1] = 134.01;}
					else if(str.match("shimane.pop.co.jp")) { inipoint[0] = 35.09; inipoint[1] = 132.41;}
					else if(str.match("okayama.pop.co.jp")) { inipoint[0] = 34.56; inipoint[1] = 133.48;}
					else if(str.match("hiroshima.pop.co.jp")) { inipoint[0] = 34.35; inipoint[1] = 132.35;}
					else if(str.match("yamaguchi.pop.co.jp")) { inipoint[0] = 34.18; inipoint[1] = 131.37;}
					else if(str.match("tokushima.pop.co.jp")) { inipoint[0] = 33.53; inipoint[1] = 134.09;}
					else if(str.match("kagawa.pop.co.jp")) { inipoint[0] = 34.11; inipoint[1] = 134;}
					else if(str.match("ehime.pop.co.jp")) { inipoint[0] = 33.51; inipoint[1] = 132.59;}
					else if(str.match("kochi.pop.co.jp")) { inipoint[0] = 33.39; inipoint[1] = 133.29;}
					else if(str.match("fukuoka.pop.co.jp")) { inipoint[0] = 33.29; inipoint[1] = 130.43;}
					else if(str.match("saga.pop.co.jp")) { inipoint[0] = 33.18; inipoint[1] = 130.01;}
					else if(str.match("nagasaki.pop.co.jp")) { inipoint[0] = 32.54; inipoint[1] = 129.51;}
					else if(str.match("kumamoto.pop.co.jp")) { inipoint[0] = 32.3; inipoint[1] = 130.48;}
					else if(str.match("oita.pop.co.jp")) { inipoint[0] = 33.19; inipoint[1] = 131.15;}
					else if(str.match("miyazaki.pop.co.jp")) { inipoint[0] = 32.17; inipoint[1] = 131.22;}
					else if(str.match("kagoshima.pop.co.jp")) { inipoint[0] = 31.53; inipoint[1] = 130.37;}
					else if(str.match("okinawa.pop.co.jp")) { inipoint[0] = 25.59; inipoint[1] = 127.3;}
					else                                    { inipoint[0] = 34.8;  inipoint[1] = 135.29;}
				}else{                                        inipoint[0] = 34.8;  inipoint[1] = 135.29;}

				centerd =  new GLatLng(inipoint[0],inipoint[1]);
				map.setCenter(centerd, 9);

				return centerd;

			}

			function setCenterPref(host){
				var centerd = moveCenter(host);
				ajaxrequest(map.getCenter(),map.getBounds());
				return centerd;
			}

			function setCenterPreffromArea(obj){
				// 繧ｯ繝ｪ繝・け縺輔ｌ縺歛繧ｿ繧ｰ縺ｮhref隕∫ｴ繧貞叙蠕励＠縲《etCenterPref縺ｫ蜉蟾･縺励※貂｡縺・
				var host = new String(obj.href);
				setCenterPref(host.replace((location.href + '#'),'') + '.pop.co.jp');
			}

			// 蛻晄悄蛟､縺ｫ遘ｻ蜍・
			var centerd = moveCenter("www"+".pop.co.jp");

			GEvent.addListener(map, "dragend", function() {

				//getObj("point").innerHTML = "("+map.getCenter().x+","+map.getCenter().y+")";

				// 蜈・・荳ｭ蠢・慍縺九ｉ髮｢繧後※縺・◆繧峨・繝・・繧呈峩譁ｰ
				if(isfarcenter(map.getCenter(),centerd,map.getBounds().getNorthEast())){
					ajaxrequest(map.getCenter(),map.getBounds());
					centerd = map.getCenter();
				}
			});

			GEvent.addListener(map, "zoomend", function() {
				ajaxrequest(map.getCenter(),map.getBounds());
			});

			// 繝√・繝荳隕ｧ縺ｮ繧ｯ繝ｪ繝・け譎・
			evtLtn(tlist,"change",function(){dispinfo(tlist.options[tlist.selectedIndex].value)});

			// 蝨ｰ蝓滉ｸ隕ｧ縺ｮ繧ｯ繝ｪ繝・け譎ゅ・繧､繝吶Φ繝医Μ繧ｹ繝翫・繧偵そ繝・ヨ
			for(var i=0;i<preflist.childNodes.length;i++){
				if(preflist.childNodes[i].childNodes[0]){
					if(preflist.childNodes[i].childNodes[0].nodeName=='A'){
						preflist.childNodes[i].childNodes[0].onclick = function(){setCenterPreffromArea(this);return false;}
					}
				}
			}

			ajaxrequest(map.getCenter(),map.getBounds());

			// display:none 蟇ｾ遲・
			map.checkResize();
		}
	}

	evtLtn(window,"load",function(){initialize()});

