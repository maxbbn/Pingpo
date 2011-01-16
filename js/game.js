Pingpo.add("pp~game",function(P){
    var S = KISSY,
        Event = S.Event;
    
    P.Game = function(cfg){
        var self = this;
        
        self.username = self.getUserName();
        /**
         * player's id 
         * @private
         * @type {number}
         */
        self.uid = null;
        
        /**
         * player's index of current game
         * @private 
         * @type {number}
         */
        self.index; 
        
        /**
         * names of player
         * @type {array}
         */
        self.players = [];
        
        
        self._lagcy = [];
        //@todo remove game in the param list
        self._screen = new P.view.Screen(this,"#J_Screen");
        self._cheat = this.getCheat();
        self.data = false;
        self.winwords = [
             "Win"
        ];
        self.failwords = [
            "Fail!!"
        ];
        self._wsdata = new P.module.GameData(cfg.wsurl);
        S.ready(function(){
            
        });
        
        self._wsdata.on("open", self._connectionOpenHandle, self);
    };
    
    S.mix(P.Game.prototype, {
        /**
         * Set Cheat Switch
         * @return {boolean} the cureent cheat state
         */
        getCheat: function(){
            if(!S.Cookie.get("cheat")){
                this.setCheat(false);
                return false;
            }
            return S.Cookie.get("cheat") == 't';
        },
        /**
         * Set Cheat switch
         * @param {boolean} ON or OFF
         */
        setCheat : function(s){
            var t = s?"t":"f";
            this._cheat = s;
            S.Cookie.set("cheat",t,1);
        },
        /**
         * handle soket open
         * @private
         */
        _connectionOpenHandle : function(){
            self = this;
            self._wsdata.send("setname",self.username);
            self._screen.on("ready", function(e){
                self._wsdata.send("ready");
            });
            self._screen.on("cheat", function(){
                self._cheat = !self._cheat;
                self.setCheat(self._cheat);
            });
            self._wsdata.on("message", self._messageHandler,this);
            self._screen.on("mouse_update",self._mouseHandler,this);
            setInterval(function(){
                self._ping();
            },1000);
        },
        _ping : function(){
            this._wsdata.send("ping", new Date().getTime());
        },
        /**
         * handle soket open
         * @private
         */
        _mouseHandler : function(e){
            if(!this._cheat){
                this._wsdata.send("bartop", e.offsety);
            }
        },
        /**
         * Handle message Event
         * @private
         * @param {Object} contain the data of zhe message
         */
        _messageHandler : function(e){
            var self = this
                action = e.action,
                data = e.data;
            if( S.isFunction( self._actions[action]) ){
                self._actions[action].call(self, data);
            }else{
                if(P.Config.debug) {
                    console.log("action ["+action+"] not find");
                }
            }
        },
        /**
         * Handlers of server actions
         * @private
         * @param {Object} contain the data of zhe message
         */
        _actions : {
            game_start : function(data){
                var self = this;
                
                self.playing = true;
                self._screen.start_init();
            },
            f : function(data){
                data = data[2].split(",");
                S.each(data,function(item,index){
                    if(item.length === 0) {
                        item = false;
                    }
                    if(index < 4){
                        data[index] = parseInt(item);
                    }
                });
                this.data = data;
                if(this._cheat){
                    this._wsdata.send("bartop",Math.round(data[1]/100));
                }
            },
            start_in : function(data){
                var count = data[2];
                this._screen.message((count=="0")?"":count, "countdown");
            },
            g_end : function(data){
                var self = this;
                self.players = [];
                self.index = null;
                self._screen.init_players(-1);
                self._screen.init_ready(-1);
            },
            p_accepted : function(data){
                this.uid = parseInt(data[2]);
                this._screen.message("已加入游戏，等待分配玩家");
            },
            /**
             * @param {string} "pa,pb,myidx"
             */
            p_list : function(data){
                var adata = data[2].split(","),
                    pn,
                    self = this,
                    i = 0,
                    v = self._screen;
                self.index = parseInt(data[3]);
                self.players = adata;
                v.init_list(self.players, self.index);
            },
            p_ready : function(data){
                var self = this,
                    rid = parseInt(data[2]),
                    isme = (rid === self.uid);
                    idx = isme?self.index:1-self.index;
                self._screen.init_ready(idx, isme);
                if(!isme && self._cheat){
                    self._wsdata.send("ready");
                }
            },
            ko : function(data){
                var loser = parseInt(data[2]),
                    self =this,
                    words = (self.uid === loser)? "fail":"win";
                self.playing = false;
                self._screen.end_init();
                self._screen.init_ready(-1);
                self._screen.message(words, true);
            },
            score : function(data){
                var score = data[2];
                this._screen.setScore(score);
            },
            pingback : function(data){
                var lagcy = new Date().getTime() - parseInt(data[2]);
                if(this._lagcy.length > 20) {
                    this._lagcy.shift();
                }
                this._lagcy.push(lagcy);
                self._screen.set("netpanel", this._lagcy);
            },
        },
        /**
         * get user name from Cookie
         * @return {string}
         */
        getUserName : function(){
            var nk = S.Cookie.get("u") || "someone";
            return (nk === "")?false:nk;
        }
    });
});
