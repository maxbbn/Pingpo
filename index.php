<?php
$domain = "192.168.1.197";
if(isset($_GET["logout"])){
	setcookie("u", "",time() - 3600*24*365);
	include "mod/login.php";
} elseif (isset($_GET["login"])){
	if(isset($_POST["name"])){
		$name = $_POST["name"];
		if(strlen($name) > 2){
			$name = urlencode($name);
			setcookie("u", $name, time() + 3600*24*365, "/");
			$goto = "/pingpo/";
			include "mod/redirection.php";
		}else {
			$error = "you name please~";
			include "mod/login.php";
		}
	}else{
		include "mod/login.php";
	}
}elseif (empty($_COOKIE['u'])){
	$goto = "/pingpo/?login";
	include "mod/redirection.php";
} else {
	include "pingpong_game.htm";
}
