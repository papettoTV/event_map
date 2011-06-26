<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
<title>イベント地図検索</title>
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>
<script type="text/javascript" src="jquery.1.6.1.js"></script>
<script type="text/javascript" src="jquery.cookie.js"></script>
<script type="text/javascript" src="jquery.date.js"></script>
<script type="text/javascript" src="event_api.js"></script>
<link href="main.css" type="text/css" rel="stylesheet" />
</head>
<body>
<!-- title -->
<div id="header">
<div id="title">
<h1>イベント地図検索</h1>
</div>
<table id="social_table">
<tr valign="bottom">
<td width=100>
&nbsp;
</td>
<td align="right">
<a href="http://twitter.com/share" class="twitter-share-button" data-count="horizontal" data-via="papettoTV" data-lang="ja">Tweet</a><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>
<a href="http://b.hatena.ne.jp/entry/http://playispeace.com/event_map/" class="hatena-bookmark-button" data-hatena-bookmark-title="イベント地図検索" data-hatena-bookmark-layout="standard" title="このエントリーをはてなブックマークに追加"><img src="http://b.st-hatena.com/images/entry-button/button-only.gif" alt="このエントリーをはてなブックマークに追加" width="20" height="20" style="border: none;" /></a><script type="text/javascript" src="http://b.st-hatena.com/js/bookmark_button.js" charset="utf-8" async="async"></script>
<iframe src="http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fplayispeace.com%2Fevent_map%2F&amp;send=false&amp;layout=standard&amp;width=450&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;height=24" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:450px; height:24px;" allowTransparency="true"></iframe>
</td>
</tr>
</table>
</div>
<!-- search area -->
<div id="search_area">
<ul>
<li><label for="term_one_week"><input type="radio" name="term" id="term_one_week" value="7"/>１週先まで</label></li>
<li><label for="term_one_month"><input type="radio" name="term" id="term_one_month" value="31" />１ヶ月先まで</label></li>
<li><label for="term_one_year"><input type="radio" name="term" id="term_one_year" value="365" />もっと先</label></li>
</ul>
</div>

<p id="input_keyword">
<input type="text" name="keywords" value="" size="10" /><input type="button" name="submit" value="絞り込む" />
&nbsp;<span id="loading"></span>
</p>
</div>
<div id="map_canvas"></div>
<!--
<div id="data_result" style="float:left;width:400px;font-size:0.8em;"></div>
-->
<br />
<ul id="marker_desc">
<li><img src="http://maps.google.co.jp/mapfiles/ms/icons/red-dot.png" />1週間以内のイベント</li>
<li><img src="http://maps.google.co.jp/mapfiles/ms/icons/yellow-dot.png" />１ヶ月以内のイベント</li>
<li><img src="http://maps.google.co.jp/mapfiles/ms/icons/green-dot.png" />もっと先のイベント</li>
<li><img src="http://maps.google.co.jp/mapfiles/ms/icons/blue-dot.png" />過去のイベント</li>
</ul>
<p class="debug">your location is <span id="result_gps">...</span>　searching <span id="get_location_result">...</span></p>
<footer>
<p><small>copyright all right reserved <a href="http://twitter.com/#!/papettoTV" >papettoTV</a> <a href="http://blog.playispeace.com/209/event_map/">about this service</a></small></p>
</footer>
<!-- Start Google Analytics -->
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script>
try{
var pageTracker = _gat._getTracker("UA-3430321-1");
pageTracker._trackPageview();
} catch(err) {}
</script>
<!-- End Google Analytics -->
</body>
</html>
