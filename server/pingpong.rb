# 实现方法， 服务器定时发送数据给游游戏双方，游戏
require "interval"
require "ball"
require "player"

class Pingpong
    attr_reader :messageque,:players,:width,:height,:barwidth,:barheight,:started,:start_time

    def initialize(params)
        @width    = params[:width]
        @height   = params[:height]
        @barwidth = params[:barwidth]
        @barheight = params[:barheight]
        
        @players  = []
        @interval = Interval.new(0.01);
        @messageque = Queue.new
        @started = false
        @start_time = 0
        
        @ball     = Ball.new(self, params[:ballwidth])
    end

    def join (players)
        @players = players if players.length == 2
        @players.each {|p|
            p.game = self
        }
        
        if @players.length == 2
            broadcast_list
            broadcast("pp:p_full")
        end
    end

    def quit (player)
        @players.each { |p|
            p.quitgame
            p.send("pp:g_end") if(p != player)
        }
    end

    def broadcast_list
        ulist = []
        @players.each{|p|
            ulist.push p.username
        }
        @players.each{|p|
            p.send("pp:p_list:#{ulist.join(",")}:#{@players.index(p)}");
        }
    end

    def run
        @start_time = Time.now.to_i + 3
        @ball.init
        broadcast("pp:game_start");
        @runing = true
        @interval.run{|idx|
            frame
        }
    end

    def end_game
        @started = false;
        @players.each{|p|
            p.init_for_game
        }
        @interval.stop
        broadcast("pp:g_end");
    end

    def frame
        if(!@started)
            remain = @start_time - Time.now.to_i
            if remain > 0
                broadcast("pp:start_in:#{remain}");
            else
                broadcast("pp:start_in:0");
                @started = true
            end
        else
            @ball.run
        end
        broadcast("pp:f:#{@ball.x},#{@ball.y},#{@players[0].top},#{@players[1].top},#{@ball.status}")
        if @ball.out?
            broadcast("pp:ko:#{@ball.outside.id}")
            end_game
        end
    end

    def get_ready (player)
        if not @started
            player.ready = true;
            broadcast("pp:p_ready:#{player.id}")
            run if @players.length == 2 && @players[0].ready? && @players[1].ready?
        end
    end

    def receive (player,strs)
        case strs[0]
            when "ready" then
                get_ready(player)
            when "bartop" then
                player.top = strs[1].to_i
        end
    end

    def broadcast (msg)
        @players.each{|p|
            p.send(msg)
        }
    end

end

# pp = Pingpong.new(:width=>800,:height=>600, :barwidth=>10, :barheight=>20, :ball => Ball.new());

# pp.add_player(Player.new)
# pp.add_player(Player.new)
