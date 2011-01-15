class Bar
	attr_reader :top
	
	def initialize
		@top = 0
	end
	
	def top=(newtop)
		@top = newtop.to_i
	end
	
end