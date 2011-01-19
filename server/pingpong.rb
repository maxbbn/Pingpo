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
        @interval = Interval.new(1);
        @messageque = Queue.new
        @started = false
        @start_time = 0
        @ball = Ball.new(self, params[:ballwidth])
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
        sync_ball
        broadcast("pp:game_start");
        @runing = true
        Thread.new do
            sleep(3)
            @started= true
            broadcast("pp:start_in:0");
            sync_ball
            time = @ball.nexthittime
            puts time
            while !@ball.out?
                sleep time
                frame
                time = @ball.nexthittime
            end
            broadcast("pp:ko:#{@ball.outside.id}")
            end_game
            puts "game end"
        end
    end

    def end_game
        @started = false;
        @players.each{|p|
            p.init_for_game
        }
        broadcast("pp:g_end");
    end

    def sync_ball
        broadcast("pp:f:#{@ball.x},#{@ball.y},#{@players[0].top},#{@players[1].top}")
    end

    def frame
        @ball.hitbar
        sync_ball
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
