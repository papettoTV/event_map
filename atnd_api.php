<?php
$params = $_GET;
$params["format"] = ($params["format"]=="json") ? "json" : "xml";
$params["ymd"] = isset($params["ymd"]) ? $params["ymd"] : "";
$params["keyword_or"] = isset($params["keyword_or"]) ? $params["keyword_or"] : "";
$params["keyword"] = isset($params["keyword"]) ? $params["keyword"] : "";
$params["count"] = isset($params["count"]) ? $params["count"] : 30;

$url_param = "";
foreach($params as $key => $v){
		if($v != ""){
				$url_param .= $key."=".$v."&";
		}
}

//$res = file_get_contents("http://api.atnd.org/events/?keyword=".$params["keyword"]."&keyword_or=".$params["keyword_or"]."&format=".$params["format"]."&ymd=".$params["ymd"]."&count=".$params["count"]);
$res = file_get_contents("http://api.atnd.org/events/?".$url_param);




if($params["format"]=="json"){
	header("Content-Type: text/javascript; charset=utf-8");
}else{
	header("Content-Type: text/xml; charset=utf-8");
}
	echo $res; 
?>
