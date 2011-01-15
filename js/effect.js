Pingpo.add("canvas~effect",function(P){
    var S = KISSY;
    P.namespace("effect");
	
	/**
	 * class Effect 
	 * @param {Object} Canvas 2dContext
	 * @renderer {fun}  zhe Renderer of Effect
	 */
    function Effect(ctx,rendername){
        this.ctx = ctx;
        this.renderer = this.getRender(rendername);
		this.config = this.getConfig(rendername);
        this.points = [];
    };
    S.augment(Effect,{
        render : function(x,y){},
		getRender : function(rendername){
			rendername = rendername || "default";
			return this.constructor.renderers[rendername];
		},
		getConfig : function(rendername){
			var defaultCfg = this.constructor.rendercfgs["default"] || {};
			return S.merge(defaultCfg, this.constructor.rendercfgs[rendername] || {});
		}
    });
    
    
	
    function DotEffect(ctx,rendername){
        DotEffect.superclass.constructor.call(this, ctx, rendername);
    };
    S.extend(DotEffect,Effect,{
        render : function(x,y){
            this.addPoints(x,y);
            this.doDraw();
        },
        addPoints : function(x,y){
			var cfg = this.config,
				steps;
            if(Math.random() < cfg.points_Intensity && this.points.length < cfg.points_len){
                if(this.points.length > cfg.points_max){
                    this.points.shift();
                }
				steps = Math.round(Math.random()*cfg.step_range) + cfg.step_offset;
                this.points.push({
                    x : x + Math.random()*cfg.ball_range_x - cfg.ball_offset_x,
                    y : y + Math.random()*cfg.ball_range_y - cfg.ball_offset_y,
                    steps : steps,
					osteps : steps
                });
            }
        },
        doDraw : function(){
            var i = 0,
                l = this.points.length;
            for(;i<l;i++){
                p = this.points[i];
                if (p.steps == 0){
                    this.points.splice(i,1);
                    l = l - 1;
                    i = i - 1;
                }else{
                    p.steps --;
                    this.renderer.call(this,p, this.ctx);
                }
            }
        }
    }, {
		rendercfgs : {
			"default" : {
				ball_offset_x : 0,
				ball_offset_y : 0,
				ball_range_x : 0,
				ball_range_y : 0,
				step_offset : 80,
				step_range : 10,
				points_len : 50,
				points_Intensity : 0.6,
				
			},
			"fire" : {
				points_Intensity : 0.8,
				ball_offset_y : -5,
				ball_range_y : 0
			},
			"snow" : {
				points_Intensity : 0.5,
				points_len : 10,
				step_offset : 100,
				step_range : 20
			}
		},
		renderers : {
			"default" : function(p,ctx){
				var x = p.x,
					y = p.y,
					s = p.steps,
					w = p.steps/6;
				ctx.fillRect(x,y,w,w);
			},
			"bluefire" : function(p,ctx){
                var x = p.x,
                    y = p.y,
                    s = p.steps,
                    w = s/8;
                ctx.fillStyle = "#ffaa24";
                ctx.beginPath();
                ctx.arc(x, y, w, 0, Math.PI*2, true); 
                ctx.closePath();
                ctx.fill();
            },
			"fire" : function(point, ctx){
				var x = p.x,
                    s = p.steps,
					os = p.osteps,
					y = p.y - 90 + s,
                    w = s/8;
				ctx.fillStyle = "rgb(255,"+Math.round(255 - s/os * 150)+",0)";
				ctx.beginPath();
                ctx.arc(x, y, w, 0, Math.PI*2, true); 
                ctx.closePath();
                ctx.fill();
			},
			"snow" : function(point, ctx){
				var x = p.x,
                    s = p.steps,
					os = p.osteps,
					y = p.y;
				// if(y > 750){
					// p.steps = 0;
				// }else{
					// p.steps = 2;
				// }
				
				if(s === os-1){
					point.size = Math.random()*1 + 1;
					point.speedy = Math.random()*.4 + .3;
					point.speedx = - point.size * 0.3;
				}
				
				ctx.fillStyle = "#999";
				ctx.beginPath();
                ctx.arc(x, y, point.size, 0, Math.PI*2, true); 
                ctx.closePath();
                ctx.fill();
				
				p.x += point.speedx;
				p.y += point.speedy;
			}
		}
	});

	
    function SilkEffect(ctx, rendername){
        SilkEffect.superclass.constructor.call(this, ctx, rendername);
    }
    S.extend(SilkEffect,Effect,{
        render : function(x,y){
            this.addPoint(x,y);
            this.doDraw();
        },
        addPoint : function(x,y){
            var l = this.points.length;
            if(this.points.length > 50){
                this.points.shift();
            }else{
                this.points.push({
                    x : x,
                    y : y
                });
            }
        },
        doDraw : function(){
            this.renderer.call(this,this.points,this.ctx);
        }
    },{
		renderers : {
			"default" : function(points,ctx){
				var i = 0,l = points.length;
				ctx.strokeStyle = "#64C0D7";
				ctx.lineWidth = 5;
				//ctx.shadowBlur = 5;
				//ctx.shadowColor = "#64C0D7";
				ctx.lineCap = "round";
				ctx.lineJoin = "round";
				ctx.beginPath();
				for(i = 0;i < l; i++){
					p = points[i];
					if(i==0){
						ctx.moveTo(p.x + 2,p.y + 2);
					}else{
						ctx.lineTo(p.x + 2,p.y + 2);
					}
				}
				//for(i = l-1;i >= 0; i--){
				//    p = points[i];
				//    ctx.lineTo(p.x - 2,p.y - 2);
				//}
				//ctx.closePath();
				ctx.stroke();
				//ctx.shadowBlur = 0;
			}
		}
    });
    
    S.mix(
        P.effect,
        {
            "DotEffect" : DotEffect,
            "SilkEffect" : SilkEffect,
        }
    )
});
