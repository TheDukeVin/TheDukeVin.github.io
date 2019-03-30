
socket = io()
socket.on('message', function(data) {
	console.log(data)
})

socket.emit('new player')

chars = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f']

function randVal(){
	return Math.floor(Math.random() * 16)
}

function randColor(){
	return '#' + chars[randVal()] + chars[randVal()] + chars[randVal()]
}

function date(){
	d = new Date()
	return d.getTime()
}

player = {
	x: 300,
	y: 200,
	color: randColor(),
	lastUpdated: date()
}

setInterval(function() {
	player.lastUpdated = date()
	socket.emit('update', player)
}, 1000 / 60)

canvas = document.getElementById('canvas')
ctx = canvas.getContext('2d')

windx = 800
windy = 600
speed = 2

playerSize = 10

BG = "#fff"
playerColor = "#f00"

keyMove = ["ArrowDown","ArrowUp","ArrowRight","ArrowLeft"]
move = [[0,1],[0,-1],[1,0],[-1,0]]
pressed = [false,false,false,false]

document.addEventListener("keydown",keydownHandler)
document.addEventListener("keyup",keyupHandler)

function keydownHandler(event){
	key = event.code
    event.preventDefault()
	for(i=0; i<4; i++){
		if(keyMove[i] == key){
        	pressed[i] = true
		}
	}
}

function keyupHandler(event){
	key = event.code
	for(i=0; i<4; i++){
		if(keyMove[i] == key){
        	pressed[i] = false
		}
	}
}






function fillRect(color,sx,sy,l,w){
	ctx.fillStyle = color
	ctx.fillRect(sx,sy,l,w)
}

pi = Math.PI
function fillCirc(color,x,y,r){
	ctx.beginPath()
	ctx.arc(x,y,r,0,2*pi)
	ctx.fillStyle = color
	ctx.fill()
}

socket.on('playerStates', function(players) {
	for(i=0; i<4; i++){
    	if(pressed[i]){
        	player.x += move[i][0]*speed
            player.y += move[i][1]*speed
        }
    }
	
	if(player.x < 0){
		player.x = 0
	}
	if(player.x > windx){
		player.x = windx
	}
	if(player.y < 0){
		player.y = 0
	}
	if(player.y > windy){
		player.y = windy
	}
	
	fillRect(BG,0,0,windx,windy)
	for(id in players) {
		aPlayer = players[id]
		ax = aPlayer.x
		ay = aPlayer.y
		ac = aPlayer.color
		fillCirc(ac,ax,ay,playerSize)
	}
})
