
//Random stuff to initialize the server

express = require('express')
http = require('http')
path = require('path')
socketIO = require('socket.io')
app = express()
server = http.Server(app)
io = socketIO(server)
app.set('port', 5000)
app.use('/static', express.static(__dirname + '/static'))
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname, 'temp.html'))
})
server.listen(5000, function() {
	console.log('Starting server on port 5000')
})
io.on('connection', function(socket) {
})

//Code stuff

var players = {}

function date(){
	d = new Date()
	return d.getTime()
}

io.on('connection', function(socket){
	socket.on('new player', function(){
		console.log("New player joined")
		players[socket.id] = {}
	})
	socket.on('update', function(data){
		players[socket.id] = {
			x: data.x,
			y: data.y,
			color: data.color,
			lastUpdated: data.lastUpdated
		}
	})
})

setInterval(function() {
	t = date()
	for(id in players){
		aPlayer = players[id]
		if(t - aPlayer.lastUpdated > 1000){
			console.log("Player left")
			delete players[id]
		}
	}
	io.sockets.emit('playerStates', players);
}, 1000 / 60);