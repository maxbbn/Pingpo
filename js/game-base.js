/**
* 游戏基本JS
*/
 KISSY.add('ppgame', function(S) {
    var SIDE = {
			'left' : 0,
			'right' : 1
		},
		TABLE_ID = "#table",
		BALL_ID = "#ball",
		LEFT_BAR_ID = "#bar-0",
		RIGHT_BAR_ID = "#bar-1",
		Event = S.Event,
		Dom = S.DOM,
		Vector = S.Vector;
	
	var PPGame = function(side){
		self = this;
		S.mix(self,{
			IntervalId : 0,
			ballSpeed : [200,20],
			ballPosition : [10,0],
			_fps_set : 30,
			_fps_frames : 0,
			_fps_frames_max : 20,
			_fps_time : 0,
			playing : false

		});
		self.localside = SIDE[side];
		self.table = Dom.get(TABLE_ID);
		self.ball = Dom.get(BALL_ID);
		self.leftbar = Dom.get(LEFT_BAR_ID);
		self.rightbar = Dom.get(RIGHT_BAR_ID);
		self.barHeight = Dom.height(self.leftbar);
		self.tableHeight = Dom.height(self.table);
		self.tableWidth = Dom.width(self.table);
		self._fps_field = Dom.get("#fps");
		self.__el_status = Dom.get("#status");

		//console.info(self.localside,self.table,self.ball,self.leftbar,self.rightbar);
		self.init();
		self.initEvent();
	}
	
	S.mix(PPGame.prototype,{
		initEvent : function(){
			var self = this;
			Event.on(document.body,"mousemove",self.handleMouseMoveEvent,self);
			Event.on("#pause","click",self.play,self);
			Event.on("#init","click",self.init,self);
			Event.on("#start","click",self.run,self);
			Event.on("#step","click",self.step,self);
			Event.on(document.body,"keydown",self.keydetect,self);
		},
		handleMouseMoveEvent : function(e){
			var slef = this;
			//console.log(e);
			//if(e.target == slef.table){
				//console.log(e.offsetY);
				var halfbar = self.barHeight/2;
				var top_p = Math.max(0,Math.min(e.clientY -10 - halfbar,self.tableHeight - self.barHeight));
				Dom.css(self.leftbar,"top",top_p+"px");
				Dom.css(self.rightbar,"top",top_p+"px");
			//}
		},
		keydetect : function(e){
			//console.log(e.keyCode);
			var sefl = this;
			switch(e.keyCode){
				case 83 :
					self.self.playBall();
					break;
				case 80 :
					self.play();
					break;
				
			}
		},
		step : function(){
			var self = this;
			self.play(0);
			self.playBall();
		},
		play : function(play){
			var self = this;
			if(self.game_end){
				self.init();
			}
			//console.log(self.IntervalId);
			if(!self.playing && play !== 0){
				self.playing = true;
				self.run();
			}else{
				self.playing = false;
				if(self.IntervalId !== 0){
					clearInterval(self.IntervalId);
					self.IntervalId = 0;
				}
				self.__el_status.innerHTML = "paused";
			}
		},
		init : function (){
			var self = this;
			self.game_end = false;
			self.ballSpeed = [600,300];
			self.ballPosition = [20,0];
		},
		handleTableClick : function (e) {
			//console.log("table on click");
			var self = this;
			
			//console.log(self.ballSpeed,self.ball)
		},
		posBall : function(pos){
			var self = this;
			Dom.css(self.ball, "left", pos[0]+"px");
			Dom.css(self.ball, "top", pos[1]+"px");
		},
		playBall : function () {
			var self = this,
				speed = self.ballSpeed,
				pos = self.ballPosition,
				_range_l = [10,0],
				_range_r = [870,380],
				compare;
			//到达边界
			if(speed[0] !== 0 || speed[1] !== 0){
				offSet = Vector.multiplyN(speed, 1/self._fps_set);
				pos = Vector.add(pos, offSet);
				compare = Vector.range(pos,_range_l,_range_r);
				if(compare[0] !== 0 && !self.barHit(pos,compare[0])){
					self.game_end = true;
					self.posBall(pos);
					self.play();
					//alert("出界");
					
					return;
				}
				//完美碰撞
				speed = Vector.exec(speed,compare,function(itema,itemb){
					return (itemb===0)?itema:itema*(-1);
				});
				//compare[0] === 0 : x 轴不超过边界
				//compare[1] === 0 : y 轴不超过边界
				if(compare[0] === 0 && 0 === compare[1]) {
					self.posBall(pos);
					self.ballPosition = pos;
					self.ballSpeed = speed;
				}else{
					self.ballSpeed = speed;
					self.playBall();
				}
				
				//console.info(speed,offSet);	
			}
		},
		//球是否被击中
		// @parme pos 球的位置
		// @return false : not hit
		barHit : function(pos,xcompare){
			var height, top, bar;
			if(xcompare = 0){
				return true;
			}else{
				//碰撞检测
				bar = xcompare < 0?self.leftbar:self.rightbar;
				height = Dom.height(self.leftbar);
				top = parseInt(Dom.css(self.leftbar,"top") , 10);
				console.log("bar:\theight:",height,"\ttop:",top,"\tpos:",pos);
				return pos[1] >= top - 10 && pos[1] < top + height - 5;
				
				
			}
		},
		run : function(){
			// console.log("run");
			var self = this;
			self.__el_status.innerHTML = "playing";
			self.IntervalId = setInterval(function(){
				var time;
				if(self._fps_frames > self._fps_frames_max){
					self._fps_frames = 0;
					time = self._fps_time;
					self._fps_time = new Date().getTime();
					self._fps_field.innerHTML = Math.round(self._fps_frames_max * 1000 / (self._fps_time - time),2);
				}else{
					self._fps_frames ++;
				}
				self.playBall();
			}, Math.round(1000/this._fps_set));
			
		}
	});
	S.PPGame = PPGame;
});