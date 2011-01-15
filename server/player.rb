require "bar"

class Player
    @@id = 0
    
    attr_reader :bar,:messages,:id,:top,:game,:username
    
    def initialize()
        @messages = Queue.new
        @id = @@id
        @@id += 1
        @game = nil
        # @idle
        # 当用户成功设置用户名且没在任何游戏中时， 显示为true
        @idle = false
        init_for_game
        send("pp:p_accepted:#{@id}")
        puts "player #{@id} join the game"
    end
    
    def idle?
        @idle
    end

    def init_for_game
        @ready = false;
        @top = 0;
        @top_c = 0;
    end
    
    def username= (user)
        if(user.length>0)
            @username = user
            @idle = true
        end
    end
    
    def quitgame
        if @game
            @game = false
        end
        @idle = true
    end
    
    def game= (g)
        @game = g
        @idle = false
    end
    
    def ready?
        @ready
    end
    
    def ready= (s)
        @ready = s
    end
    
    def top= (t)
        @top = t.to_i - @game.barheight / 2
        @top_c = @top
    end
    
    def diff
        @top - @top_c
    end
    
    def to_s
        "p_#{@id}"
    end
    
    def send (m)
        @messages.push(m)
    end
end
