Pingpo.add("pp~data",function(P){
    var S = KISSY,
        config = P.Config,
        module = P.namespace("module");
    /**
     * module to handle the connection to Server!
     * @construntor
     * @param {string} url of websoket
     */
    module.GameData = function(wsurl){
        if(config.debug)
            console.log("new Data...",wsurl);
        var self = this;
        /**
         * @private
         */
        var socket = new WebSocket(wsurl);
        socket.onmessage = function (m) {
            var strs = m.data.split(":"),
                action = strs[1];
            if(P.Config.debug && action != "f" && action != "pingback" && action != "start_in") {
                console.log(m.data);
            }
            self.fire(
                "message",
                {
                    action : action,
                    data : strs
                }
            );
        };
        socket.onopen = function (e) {
            if(config.debug){
                console.log("socket open...");
            }
            self.fire("open",e);
        };
        socket.onerror = function(e){
            self.fire("error",e);
            if(config.debug){
                console.log("socket error...",e);
            }
        };
        socket.onclose = function(e){
            self.fire("close",e);
            if(config.debug){
                console.log("socket close...");
            }
        };

        self._socket = socket;
    };
    S.augment(
        module.GameData,
        S.EventTarget,
        {
            /**
             * Sent message to WebSoket Server
             * @param {string} the messge
             */
            send : function(act){
                var args = S.makeArray(arguments);
                var t = "ppc:" + args.join(":");
                if(P.Config.debug && act != "ping" && act != 'bartop') {
                    console.log(t);
                }
                this._socket.send(t);
            },
            test : function(){
                var self = this;
                self.fire("message ",{
                    action : "p_accepted",
                    data : ["player1"]
                });

                self.fire("message ",{
                    action : "p_list",
                    data : ["player1,player2"]
                });
            }
        }
    );
});
