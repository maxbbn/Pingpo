require "complex"

class Ball
    attr_reader :width, :outside
    @@k = 1
    @@levelstep = 5
    @@speedup_duration = 10

    def initialize(game, width = 20 )
        @width = width.to_f
        @game = game
        @outside = nil
        @bondry = {
            :left => @game.barwidth + @width/2,
            :right => @game.width - @game.barwidth - @width/2,
            :top => @width/2,
            :bottom => @game.height - @width/2,
            :height => @game.height - @width,
            :width => @game.width - @game.barwidth * 2 - @width
        }
    end

    def x
        @position[0]
    end

    def y
        @position[1]
    end

    def status
        #获取每一帧的状态码 
        # [t|f][f|0|1]
        hitbar =  @hitbar ? @game.players.index(@hitbar) : "f"
        @hitbar = false
        hitbar.to_s
    end

    def init
        w = @bondry[:right]
        h = @bondry[:right]
        @position = [@bondry[:left] + @bondry[:width]/2, @bondry[:top] + @bondry[:height]/2]
        @out = false
        @hitbar = false
        @round = 0; #回合
        @score = 10
        #随机方向 && 固定速度
        arg = Math.atan((0.3 + rand*0.7)*h/w);
        arg = case rand 4
            when 1 then Math::PI * 2 - arg
            when 2 then    Math::PI - arg
            when 3 then Math::PI + arg
            else arg
        end
        speedC = Complex.polar(100.0,arg)
        #@speedupTime = @game.start_time + @@speedup_duration
        @speed = [speedC.real,speedC.image]
        @game.broadcast "pp:score:#{@score}"
    end

    def nexthittime
        puts "speed #{@speed[0]}  #{@speed[1]}"
        @start = Time.now.to_i
        b = @speed[0]>0 ? @bondry[:right] : @bondry[:left]
        duration = (b - @position[0]) / @speed[0]
        pust "#{start} #{duration}"
        return duration
    end
    def speedup
        now = Time.now.to_i
        if(now >= @speedupTime && @round % @@levelstep == 0 && @round_t != @round)
            @speedupTime = now + @@speedup_duration
            @round_t = @round
            speedC = Complex(@speed[0],@speed[1])
            speedD = Complex.polar(speedC.abs * 1.1, speedC.arg)
            @speed[0] = speedD.real
            @speed[1] = speedD.image
            @score += 10
            @game.broadcast "pp:score:#{@score}"
        end
    end
    
    def out?
        @out
    end
    
    def hitbar
        player = nil
        side = nil
        now = Time.new.to_i
        duation = now - @start
        h = @bondry[:bottom]
        @position[0] = @position[0] + @speed[0]*duation
        @position[1] = @position[1] + @speed[1]*duation
        p1 = @position[1].abs
        p2 = p1/h
        r = p2.to_i
        if(r%2 == 1)
            p2 = 1 + r - p2
        else
            p2 = p2 - r
        end
        @position[1] = p2*h
        @position[1] = @position[1].abs
        @start = now
        @speed[0] *= -1
        return
        if  @speed[0] > 0 && @position[0] > @bondry[:right]
            player = @game.players[1]
            side  = :right
        elsif @speed[0] < 0 && @position[0] < @bondry[:left]
            player = @game.players[0]
            side = :left
        end
        
        if player
            hit = @position[1] >= player.top - @width && @position[1] <= player.top + @game.barheight;
            if hit
                @speed[0] = - @speed[0];
                @speed[1] += player.diff
                @position[0] = @bondry[side]
                @hitbar = player
                @round += 1
            else    
                @outside = player
                @out = true
            end
        end
    end
end
