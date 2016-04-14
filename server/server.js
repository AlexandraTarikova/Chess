var io = require('socket.io').listen(3056);

console.log("Server running");

var rooms = [];
var waiting = [];
var games = 0;

io.sockets.on('connection', function (socket){
  socket.on('game_find', function (data){
    console.log("Player joined queue")
    waiting.push(socket);
    if (waiting.length >= 2){
      addRoom(games, waiting[0], waiting[1]);
      console.log("room created");
      var info = {};
      info.color = "white";
      info.roomID = games;
      waiting[0].emit('game_found', info);
      info.color = "black";
      waiting[1].emit('game_found', info);
      waiting.splice(0,2);
    }
  });

  socket.on('game_stopFinding', function (){
    var index = waiting.indexOf(socket);
    if (index !== -1){
      console.log("Player left queue");
      waiting.splice(index,1);
    }
  });

  socket.on('turn_move', function (data){
    console.log("making move");
    data.playerColor = socket.color;
    socket.broadcast.to(rooms[socket.room_id]).emit('player_move', data);
  });

  socket.on('turn_castling', function(data){
    console.log("making move");
    data.playerColor = socket.color;
    socket.broadcast.to(rooms[socket.room_id]).emit('player_castling', data);
  });

  socket.on('turn_promotion', function(data){
    console.log("making move");
    data.playerColor = socket.color;
    socket.broadcast.to(rooms[socket.room_id]).emit('player_promotion', data);
  });


  socket.on('turnValidation_invalid', function(){
    console.log("someone is cheating");
    var game_end_info = {};
    game_end_info.msg = "invalid turn";
    game_end_info.winnerColor = socket.color;
    io.sockets.to(rooms[socket.room_id]).emit('game_end', game_end_info);
  });

  socket.on('turn_mate', function(){
    console.log("player mate");
    socket.broadcast.to(rooms[socket.room_id]).emit('player_mate');
  });

  socket.on('turn_draw', function(){
    console.log("player draw");
    socket.broadcast.to(rooms[socket.room_id]).emit('player_draw');
  });

  socket.on('turnValidation_mate', function(){
    console.log("player mate");
    var game_end_info = {};
    game_end_info.msg = "mate";
    game_end_info.winnerColor = socket.color;
    io.sockets.to(rooms[socket.room_id]).emit('game_end', game_end_info);
  });

  socket.on('turnValidation_draw', function(){
    console.log("player draw");
    var game_end_info = {};
    game_end_info.msg = "draw";
    game_end_info.winnerColor = null;
    io.sockets.to(rooms[socket.room_id]).emit('game_end', game_end_info);
  });

  socket.on('room_leave', function(){
    if(rooms[socket.room_id] !== null){
      console.log("player left");
      var game_end_info = {};
      game_end_info.msg = "leave";
      game_end_info.winnerColor = (socket.color === "white" ? "black" : "white");
      io.sockets.to(rooms[socket.room_id]).emit('game_end', game_end_info);
      rooms[socket.room_id] = null;
    }
  });

  socket.on('disconnect', function (){
    var index = waiting.indexOf(socket);
    if (index !== -1){
      console.log("Player left queue");
      waiting.splice(index,1);
    }
    else if (rooms[socket.room_id] !== null){
      console.log("player left");
      var game_end_info = {};
      game_end_info.msg = "leave";
      game_end_info.winnerColor = (socket.color === "white" ? "black" : "white");
      io.sockets.to(rooms[socket.room_id]).emit('game_end', game_end_info);
      rooms[socket.room_id] = null;
    }
  });
});


var addRoom = function (id, socket1, socket2){
  var new_room = id;
  console.log("new room id: " + id);
  socket1.room_id = id;
  socket1.color = 'white';
  socket2.color = 'black';
  socket2.room_id = id;
  rooms.push(new_room);
  socket1.join(rooms[id]);
  socket2.join(rooms[id]);
  ++games;
};



/*
var index = 0;
var rooms = ['positive_room', 'negative_room'];

io.sockets.on('connection', function (socket) {
  //var ID = (socket.id).toString().substr(0, 5);
  ID = index;
  if (ID % 2 === 0){
    socket.join(rooms[0]);
    socket.room_id = 0;
  }
  else {
    socket.join(rooms[1]);
    socket.room_id = 1;
  }
  ++index;
  var info = '{"sender" : "admin", "text" : "user ' + ID + ' joined<br>"}';
  //io.sockets.emit('new_massage', info);
  io.sockets.to(rooms[socket.room_id]).emit('new_massage', info);
  console.log('user joined');
  socket.on('new_massage', function (data){
    console.log(data);
    //socket.broadcast.json.send({'event' : 'new_massage', 'sender' : ID, 'text' : data});
    var info = '{"sender" : "' + ID + '", "text" : "' + data + '<br>"}';
    //io.sockets.emit('new_massage', info);
    io.sockets.to(rooms[socket.room_id]).emit('new_massage', info);
  });


  socket.on('disconnect', function () {
    var info = '{"sender" : "admin", "text" : "user ' + ID + ' left<br>"}';
    //io.sockets.emit('new_massage', info);
    io.sockets.to(rooms[socket.room_id]).emit('new_massage', info);
    console.log('user disconnected');
  });
});


*/
