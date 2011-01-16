<!DOCTYPE HTML>
<html lang="en-US">
<head>
	<meta charset="UTF-8">
	<title>登记</title>
	<link rel="stylesheet" href="http://a.tbcdn.cn/s/kissy/1.1.6/cssreset/reset-min.css" />
	<link rel="stylesheet" href="/pingpo/css/bargame.css" />
	<script type="text/javascript" src="http://a.tbcdn.cn/s/kissy/1.1.6/kissy-min.js"></script>
	<script type="text/javascript" src="/pingpo/js/app.js"></script>
</head>

<body>
		<div class="login">
			<h3>the Pingpo game</h3>
			<form id="loginForm" method="post" action="/pingpo/?login">
				<label for="input1">who are you?</label>
				<div>
					<input class="name" id="input1" name="name" type="text"  /><button class="btn green" type="submit">I am in</button>
				</div>
				<?php if(!empty($error)){ ?>
<div class="error"><?php echo $error; ?></div>
				<?php } ?>
			</form>
		</div>
</body>
</html>
