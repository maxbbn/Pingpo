KISSY.require(function(S){
	var Dom = S.DOM, Event = S.Event;
	
	var bargame = new Game();
	
	var el_console = Dom.get("#J_console_out");
	var message = function(message){
		//console.log.apply(console, arguments);
		return ;
	}
	
	var wsurl = "ws://pc-game:12010";
	var socket = new WebSocket(wsurl);
	message("conneting to " + wsurl);
	Event.on("#FormConsole","submit",function(e){
		e.preventDefault();
		socket.send(S.one("#J_console_input").val());
		S.one("#J_console_input").select();
	});
	
	socket.onmessage = function (m) {
		var text;
		if(m.data.indexOf(":f:") == -1){
			message("socket message: " , m.data);
		}
		
		var strs = m.data.split(":");
		if(strs.length < 2 || strs[0] !== "pp") return;
		switch (strs[1]) {
			case "strat_in_3sec":
				bargame.init();
				bargame.start();
				break;
			case "f":
				bargame.framedata(strs[2]);
				break;
			case "start_in":
				bargame.screen.message(strs[2] === "0" ? "" : strs[2],"countdown");
				break;
			case "g_end":
				bargame.end();
				break;
			case "p_accepted":
				bargame.id = strs[2];
				bargame.screen.message("等待玩家加入")
				break;
			case "p_list":
				bargame.refreshPlayers(strs[2]);
				break;
			case "p_ready":
				bargame.setReady(strs[2]);
				break;
			case "p_stop":
				bargame.end();
				break;
			case "game_over":
				bargame.over(strs[2]);
				break;
			
		}
	};
	socket.onopen = function () {
		message("socket opened");
	};
	socket.onerror = function(e){
		message("socket error")
	};
	socket.onclose = function(e){
		message("socket closed");
	};
});