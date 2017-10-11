import SimpleHTTPServer
import SocketServer
import datetime

class MyRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_GET(self):
        return SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)
        
    def do_POST(self):
        length = self.headers['content-length']
        data = self.rfile.read(int(length))

        with open('data/{:%Y-%m-%d-%H-%M-%S}.txt'.format(datetime.datetime.now()), 'w') as fh:
            fh.write(data.decode())

        self.send_response(200)
    

Handler = MyRequestHandler

server = SocketServer.TCPServer(('', 8000), Handler)
server.serve_forever()
