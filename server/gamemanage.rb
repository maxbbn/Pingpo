require "pingpong"

class GameManage
    def initialize
        @player_list = []
    end
    
    def join(p)
        @player_list << p
    end
    
    def match_player
        idleplayers = @player_list.select{|p| p.idle?}
        if idleplayers.length >= 2 then
            game = create_game
            matched = idleplayers.first(2)
            game.join matched
            match_player
        end
    end
    
    def create_game
        Pingpong.new(:width=>800,:height=>600, :barwidth=>10, :barheight=>100, :ballwidth => 20);
    end
    
    def kick (player)
        if player.game
            game = player.game
            game.quit(player)
        end
        
        @player_list.delete player
        match_player
    end
    
    def receive(player,data)
        strs = data.split(":");
        if(strs.length > 1 && strs[0] == "ppc")
            strs.delete_at(0)
            case strs[0]
                when "setname" then 
                    player.username = strs[1]
                    match_player
                    puts "set name player #{player.id} #{strs[1]}"
                when "leave" then
                    #leave_game player
                when "ping" then
                    player.send("pp:pingback:#{strs[1]}");
                else
                    player.game.receive(player,strs) if player.game
            end
        end
    end
end
