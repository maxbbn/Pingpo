Pingpo.add("pp~screen",function(P){
    var S = KISSY,
        Dom = S.DOM,
        Event = S.Event,
        view = P.namespace("view"),
        mods = P.namespace("mods");

    var loadAssets = function(data,type){
        S.each(data,function(v,k){
            if(type === "audio"){
                data[k] = new Audio(v);
            }else if(type === 'image'){
                data[k] = new Image();
                data[k].src = v;
            }
        })
    };
    /**
     * A View Layer
     * @constructor
     * @param {Game}
     * @param {string|object} the Dom Element
     */
    view.Screen = function(game,el_screen){
        var self = this,
            el_room = Dom.get("#room");
        /**
         * @type Game
         * @private
         */
        self.game = game;
        /**
         * The context of the canvas
         * @private
         */
        self.ctx = Dom.get(el_screen).getContext("2d");

        self.effect = new P.effect.DotEffect(self.ctx, "snow");
        /**
         * The audio lib
         * @private
         */
        self.lib_audio = {
            "HIT_LEFT" : "assets/hitleft.ogg",
            "HIT_RIGHT" : "assets/hitright.ogg",
            "HIT_STAGE" : "assets/hitright.ogg",
            "DOORBELL" : "assets/hitedge.ogg"
        };
        loadAssets(self.lib_audio,"audio");

        /**
         * The image Lib
         * @private
         */
        self.lib_image = {
            "THEME_IMAGE" : "assets/theme2.png"
        };
        loadAssets(self.lib_image,"image");

        /**
         * mode lib
         * @private
         **/
        self.render_mod = {};

        /**
         * The text Display on Stage
         * @type {object.<string,string>}
         * @private
         */
        self.textmessage = {
            text : "Pingpo",
            type : 'countDown'
        };
        self.score = "";
        self.m_interval = null;
        self._offsetY_c = 0;
        self._offsetY   = 0;

        /*DOM Elements*/
        self.btn_ready  = Dom.get("#J_ready_button");
        self.el_players = Dom.query(".player", Dom.get(".room"));
        self.el_actionbar = Dom.get(".actions", el_room);

        Event.on(self.btn_ready, "click", function(e){
            self.fire("ready",e);
        });
        Event.on("#cheat","click", function(){
            self.fire("cheat");
        });
        setInterval(function(){
            self.frame();
        },10);
        self.init();
    };

    var textCfg = {
        defaultcfg : {
            font : "30px arial,黑体",
            color : "#000"
        },
        countdown : {
            font : "50px arial",
            color : "#f00"
        }
    };

    S.mix(view.Screen, {
        /**
         * @param {String}
         */
        getTextCfg : function(ttype){
            if (ttype in textCfg){
                ttype = textCfg[ttype];
            }
            return S.merge(textCfg.defaultcfg, ttype);
        }
    });
    S.augment(
        view.Screen,
        S.EventTarget,
        mods.fps,
        {
            init : function(){
                var self = this;
                self.size = {
                    bw : 10,//barwidth
                    bh : 100,//bbarheight
                    w : 800,//stage width
                    h : 600,//stage height
                    ball : 20//ballsize
                };
                self.fps_init();
                self.addMod("netpanel", P.view.netpanel);
            },
            /**
             * add mod in
             */

            addMod : function(name,mod){
                this.render_mod[name] = new mod(this.ctx, this.size);
            },
            /**
             * set each rendermod s data
             */
            set : function(modname, data){
                var mod  = this.render_mod[modname];
                mod.set(data);
            },

            /**
             * Init game start view
             */
            start_init : function(){
                var self = this;
                self.disable_ready_btn();
                self.hide_actions();
                self._topb = Dom.offset("#J_Screen").top;

                Event.on(document.body,"mousemove",function(e){
                    self._offsetY = e.pageY - self._topb;
                });

                self.m_interval = setInterval(function(){
                    if(self._offsetY != self._offsetY_c) {
                        self.fire("mouse_update",
                            {offsety:self._offsetY});
                        self._offsetY_c = self._offsetY;
                    }
                },20);
            },


            end_init : function(){
                var self = this;
                self.show_actions();
                self.enable_ready_btn();
                Event.remove(document.body,"mousemove");
                clearInterval(this.m_interval);
            },

            /**
             * init the ready state of players
             * @param {int} index of player who is ready
             */
            init_ready : function(index, isme){
                var els = this.el_players,
                    myside;
                if(index == -1){
                    S.each(els, function(item,idx){
                        Dom.removeClass(item,"ready");
                    });
                }else{
                    Dom.addClass(els[index], "ready");
                    if(isme){
                        self._screen.setScore(true);
                    }
                    this.message(isme?"等待对手准备":"对手已经准备好了");
                }
            },
            /**
             * init player list
             */
            init_list : function(players,myindex){
                var s = this;
                S.each(s.el_players, function(item,idx){
                    var pn;
                    if(players === -1){
                        Dom.removeClass(item,"me");
                        pn = "waitting";
                    }else{
                        pn = decodeURIComponent(players[idx]);
                    }
                    if(myindex === idx){
                        Dom.addClass(item,"me");
                    }
                    Dom.get("span.pn",item).innerHTML = pn;
                });

                if(players !== -1){
                    s._doorbell();
                    s.show_actions();
                    s.enable_ready_btn();
                    s.init_ready(-1);
                }
            },
            show_actions : function(){
                Dom.css(this.el_actionbar,"display","block");
            },
            hide_actions : function(){
                Dom.css(this.el_actionbar,"display","none");
            },
            enable_ready_btn : function(){

                this.btn_ready.disabled = false;
            },

            disable_ready_btn : function(){

                this.btn_ready.disabled = true;
            },
            /**
             * Display message every frame
             * @private
             */
            _fmessage : function(){
                var self = this,
                    tm = self.textmessage;
                if(!tm || !tm.text){
                    return;
                }
                self.textMark(tm.text, tm.type);
            },


            /**
             * Display text message on stage
             * @param {string} the text to display
             * @param {object} the config object of the text
             */
            message : function(text, fontcfg){
                this.textmessage = {
                    text : text,
                    type : view.Screen.getTextCfg(fontcfg)
                }
            },


            /**
             * @private
             */
            _doorbell : function(){
                //this.lib_audio["DOORBELL"].play();
            },

            setScore : function(d){
                this.score = d;
            },

            frame : function(){
                var self = this;
                self.clear();
                self.fps_call();
                S.each(self.render_mod, function(m){
                    m.render();
                });
                self._fgame();
                self._fmessage()
                self.markfps();
                self.markScore();
            },

            markfps : function(){
                var ctx = this.ctx;
                ctx.font = "10px sans-serif";
                ctx.fillStyle = "#0f0";
                ctx.textAlign = "start";
                ctx.textBaseline = "top";
                ctx.fillText(this.fps_value + "fps", 0, this.size.h - 20);
            },

            markScore : function(){
                var ctx = this.ctx;
                ctx.font = "30px arial";
                ctx.fillStyle = "#333";
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.fillText(this.score, this.size.w/2,10);
            },

            _fgame : function(){
                if(!this.game.playing){return}
                var self = this,
                    data = self.game.data,
                    ctx = this.ctx,
                    size = self.size,
                    w = size.w,
                    h = size.h,
                    bw = size.bw,
                    bh = size.bh,
                    //ball status "ab"
                    //a : f not hit, 0 left, 1 right
                    //b : t hit edge/f not hit edge
                    //bs = data[4],
                    hitside = 0,
                    ball = size.ball,
                    themeImage = self.lib_image["THEME_IMAGE"],
                    a_hitedge = self.lib_audio["HIT_STAGE"],
                    hitleft = self.lib_audio["HIT_LEFT"],
                    hitright = self.lib_audio["HIT_RIGHT"];


                //if(bs[1] != "f"){
                    //(bs[1] == "0")?hitleft.play():hitright.play();
                //}

                //if(bs[0] == 't'){
                    //a_hitedge.play();
                //}

                var hb = ball/2,
                    ballx = data.ballx,
                    bally = data.bally;

                //ctx.drawImage(themeImage,0,0,bw,bh,0,data[2],bw,bh);
                //ctx.drawImage(themeImage,0,0,bw,bh,w - bw,data[3],bw,bh);
                //ctx.drawImage(themeImage,15,0,ball,ball,ballx, bally,ball,ball);
                //draw bars
                ctx.fillStyle = "#0096FF";
                ctx.fillRect(0,data.bartop[0],bw,bh);
                ctx.fillRect(w-bw,data.bartop[1],bw,bh);
                //draw effect
                self.effect.render(ballx, bally);
                //draw ball
                ctx.fillStyle = "#0096FF";
                ctx.beginPath();
                ctx.arc(ballx, bally, hb, 0, Math.PI*2, true);
                ctx.closePath();
                ctx.fill();

            },
            makeShadow : function(){
                var ctx = this.ctx;
                ctx.shadowColor = '#00a0e9';
                ctx.shadowOffsetX = -1.0;
                ctx.shadowOffsetY = -1.0;
                ctx.shadowBlur = 1.0;
            },
            clearShadow : function(){
                var ctx = this.ctx;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 0;
            },
            textMark : function(text, cfg){
                var self = this,
                    ctx = self.ctx;
                ctx.font = cfg.font;
                ctx.fillStyle = cfg.color;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                this.makeShadow();
                ctx.fillText(text,self.size.w/2,self.size.h/2);
                this.clearShadow();
            },
            clear : function(){
                var self = this,
                    ctx = self.ctx;
                ctx.clearRect(0,0,self.size.w,self.size.h);
            }
        }
    );
});
