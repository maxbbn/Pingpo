Pingpo.add("mod~fps",function(P){
    var S = KISSY,
        mod = P.namespace("mod");
    var fps = {
        init : function(){
            this.fps_value = 0;
            this.fps_last = new Date();
            this.fps_count = 0;
        },
        fps_call : function(){
            var self = this,
                nowTime = new Date,
                diffTime = Math.ceil(nowTime.getTime() - self.last.getTime());
            if(diffTime >= 1000){
                self.fps_value = self.fps_count;
                self.fps_count = 0;
                self.fps_last= nowTime;
            }
            self.fps_count ++;
        }

    }
    mod["fps"] = fps;
});
