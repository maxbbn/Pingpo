$LOAD_PATH << "d:/ruby/mylib"
$LOAD_PATH << "."

require "web_socket"
require "thread"
require "gamemanage"
require "player"

Thread.abort_on_exception = true

server = WebSocketServer.new(
  :accepted_domains => ["*"],
  :port => 12010,
  :host => "0.0.0.0")

puts("Server is running at port %d" % server.port)

gm = GameManage.new

server.run() do |ws|
  begin
        ws.handshake()
        player = Player.new
        gm.join(player)

        thread = Thread.new() do
          while true
                message = player.messages.pop()
                ws.send(message)
          end
        end

        while data = ws.receive()
          gm.receive(player,data);
        end
  ensure
    gm.kick(player) if player
    thread.terminate() if thread
  end
end
