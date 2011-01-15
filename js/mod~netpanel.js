Pingpo.add("mod~netpanel",function(P){
    var S = KISSY,
        view = P.namespace("view");
    function netpanel(ctx,cfg){
        this.lagcy = 0;
        this.ctx = ctx;
        this.cfg = cfg;
    }
    S.augment(netpanel,{
        set : function(data){
            this.lagcy = data;
        },
        render : function(){
            var cfg = this.cfg,
                ctx = this.ctx,
                lagcy = this.lagcy[this.lagcy.length - 1];
            ctx.fillStyle = "green";
            ctx.font = "10px sans-serif";
            ctx.textAlign = "end";
            if(lagcy < 20){
                ctx.fillStyle = "green";
            }else if(lagcy < 100){
                ctx.fillStyle = "yellow";
            }else if (lagcy < 500 ){
                ctx.fillstyle = "orange";
            }else{
                ctx.fillStyle = "red";
            }
            ctx.fillText("delay:"+lagcy, cfg.w -5, cfg.h - 15);
        }
    });
    S.mix(
        view, {
            "netpanel" : netpanel
        }
    )
});
