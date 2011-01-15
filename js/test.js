Pingpo.use("pp~effect", function(P){
    var S = KISSY,
		Dom = S.DOM,
        Event = S.Event,
        els = Dom.get("#J_Screen"),
        ctx = els.getContext("2d"),
        offset = [800,0],
		effect = new P.effect.DotEffect(ctx,"snow");
        
    setInterval(function(){
        frame();
    },10);
    var frame = function(){
		//console.log(offset[0] + " | " + offset[1]);
		var x = offset[0],
			y = offset[1];
		console.log(x,y)
		ctx.clearRect(0,0,800,600);
		effect.render(x,y);
	};
	
    Event.on(els,"mousemove",function(e){
        //console.log(e);
		console.log(e);
		
        offset[0] = e.layerX;
        offset[1] = e.layerY;
    });
	
	
});
