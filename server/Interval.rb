require "thread"
class Interval 
	def initialize(interval, limit = 0)
		@interval = interval.to_f
		@limit = limit.to_i
		@thread = nil
	end
	
	def run(&block)
		#puts "running #{@running} interval: #{@interval}"
		stop
		argv = { 
			:interval => @interval,
			:limit    => @limit,
			:block    => block
		}
		
		@thread = Thread.new(argv) do |arg|
			int,limit,b = arg[:interval], arg[:limit], arg[:block]
			seq = 0
			start = Time.now
			while limit == 0 || seq < limit
				sleep int
				b.call seq
				seq += 1
			end
		end
		
	end
	
	def stop
		if not @thread.nil? and @thread.alive?
			@thread.exit 
			@thread.join
		end
	end
end

