Pingpo.use("pp~effect", function(P){
    var S = KISSY,
        Dom = S.DOM,
        Event = S.Event,
        els = Dom.get("#J_Screen"),
        ctx = els.getContext("2d"),
        offset = [800,0],
        bg = new Image(),
        bgloaded = false;
        bgshow = false;
        bg.src = "assets/house.jpg",
        //effect = new P.effect.PathEffect(ctx,"default");
        effect = new P.effect.Snow(ctx,"default");

    bg.onload = function(){
        bgloaded = true;
    };
    function FPS(){};
    S.augment(FPS,P.mods.fps);
    var fps = new FPS();
    fps.fps_init();

    setInterval(function(){
        frame();
    },10);
    var frame = function(){
        ctx.clearRect(0,0,800,600);
        if(bgshow && bgloaded){
            ctx.drawImage(bg,0,0,800,600);
        }
        var x = offset[0],
            y = offset[1];
        fps.fps_call();
        ctx.fillStyle = "#fff";
        ctx.fillText(fps.fps_value,10,10);
        effect.render(x,y);
    };

    Event.on(els,"mousemove",function(e){
        offset[0] = e.layerX;
        offset[1] = e.layerY;
    });
    Event.on("#showbg","click", function(){
        bgshow = !bgshow;
        console.log("bgshow",bgshow);
    });
});
