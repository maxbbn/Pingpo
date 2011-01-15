require "complex"

class Ball
	attr_reader :width, :outside
	
	
	@@k = 1
	@@levelstep = 5
	@@speedup_duration = 10
	
	def initialize(game, width = 20 )
		@width = width
		@game = game
		@outside = nil
		@bondry = {
			:left => @game.barwidth,
			:right => @game.width - @game.barwidth - @width,
			:top => 0,
			:bottom => @game.height - @width
		}
	end
	
	def x 
		(@position[0]*100).round
	end
	
	def y
		(@position[1]*100).round
	end
	
	def status
		#获取每一帧的状态码 
		# [t|f][f|0|1]
		hit = @hitwall ? "t" : "f"
		hitbar =  @hitbar ? @game.players.index(@hitbar) : "f"
		@hitbar = false
		@hitwall = false
		hit+hitbar.to_s
	end
	
	
	def init
		w = @bondry[:right]
		h = @bondry[:right]
		@position = [w / 2 - @width/2, h/2 - @width/2]
		@out = false
		@hitwall = false
		@hitbar = false
		@round = 0; #回合
		@score = 10
		#随机方向 && 固定速度
		arg = Math.atan((0.3 + rand*0.7)*h/w);
		arg = case rand 4
			when 1 then Math::PI * 2 - arg
			when 2 then	Math::PI - arg
			when 3 then Math::PI + arg
			else arg
		end
		speedC = Complex.polar(5.0,arg)
		@speedupTime = @game.start_time + @@speedup_duration
		@speed = [speedC.real,speedC.image]
		@game.broadcast "pp:score:#{@score}"
	end
	
	def run
		@position.each_index {|idx|
			@position[idx] += @speed[idx] * @@k
		}
		speedup
		#spped up
		
		hitdetect
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
	
	def hitdetect
		hitwall
		hitbar
	end
	
	def out?
		@out
	end
	
	def hitbar
		player = nil
		side = nil
		
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
	
	def hitwall
		if(@speed[1] > 0 && @position[1]> @bondry[:bottom])||(@speed[1] < 0 && @position[1] < @bondry[:top])
			@hitwall = true
			@position[1] = @speed[1] > 0 ? @bondry[:bottom] : @bondry[:top]
			@speed[1] = -@speed[1]
		end
	end
	
end