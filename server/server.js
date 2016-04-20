var io = require('socket.io').listen(3056);

console.log("Server running");

var rooms = [];
var rooms_info = [];
var waiting = [];
//var room_list_subs = [];
var rooms_amount = 0;

io.sockets.on('connection', function (socket){
  socket.room_id = null;
  console.log("player connected, id: " + socket.id);
  socket.on('game_find', function (data){
    console.log("Player joined queue")
    waiting.push(socket);
    if (waiting.length >= 2){
      joinRoom(waiting[0], waiting[1]);
      var info = {};
      info.color = "white";
      info.roomID = waiting[0].room_id;
      waiting[0].emit('game_found', info);
      info.color = "black";
      waiting[1].emit('game_found', info);
      getRoomInfo(waiting[0].room_id);
      waiting.splice(0,2);
      io.sockets.to('roomList_subscribers').emit('roomList', getRoomList());
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
    data.moveType = 'move';
    rooms_info[socket.room_id].logs.push(data);
    socket.broadcast.to(rooms[socket.room_id]).emit('player_move', data);
  });

  socket.on('turn_castling', function(data){
    console.log("making move");
    data.playerColor = socket.color;
    data.moveType = 'castling';
    rooms_info[socket.room_id].logs.push(data);
    socket.broadcast.to(rooms[socket.room_id]).emit('player_castling', data);
  });

  socket.on('turn_promotion', function(data){
    console.log("making move");
    data.playerColor = socket.color;
    data.moveType = 'promotion';
    rooms_info[socket.room_id].logs.push(data);
    socket.broadcast.to(rooms[socket.room_id]).emit('player_promotion', data);
  });

  socket.on('turnValidation_invalid', function(){
    console.log("someone is cheating");
    var game_end_info = {};
    game_end_info.msg = "invalid turn";
    game_end_info.winnerColor = socket.color;
    io.sockets.to(rooms[socket.room_id]).emit('game_end', game_end_info);

    emptyRoom(socket.room_id);
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

    emptyRoom(socket.room_id);
  });

  socket.on('turnValidation_draw', function(){
    console.log("player draw");
    var game_end_info = {};
    game_end_info.msg = "draw";
    game_end_info.winnerColor = null;
    io.sockets.to(rooms[socket.room_id]).emit('game_end', game_end_info);

    emptyRoom(socket.room_id);
  });

  socket.on('room_leave', function(){
    console.log('room_leave');
    if(socket.room_id !== null){
      var index = rooms_info[socket.room_id].sockets.indexOf(socket);
      console.log("index: " + index);
      if (index > 1){
        rooms_info[socket.room_id].sockets.splice(index,1);
        socket.leave(rooms[socket.room_id]);
        socket.room_id = null;
        return;
      }
      console.log("player left");
      var game_end_info = {};
      game_end_info.msg = "leave";
      game_end_info.winnerColor = (socket.color === "white" ? "black" : "white");
      io.sockets.to(rooms[socket.room_id]).emit('game_end', game_end_info);
      emptyRoom(socket.room_id);
    }
  });

  socket.on('roomList_subscribe', function(){
    console.log('roomList_subscribe');
    var list = getRoomList();
    console.log("GOT LIST GONNA SEND");
    console.log(list);
    //room_list_subs.push(socket);
    socket.join('roomList_subscribers');
    socket.emit('roomList', list);
  });

  socket.on('room_enter', function(data){
    console.log('sending logs to observer, data.roomID: ' + (+data.roomID));
    socket.join(rooms[+data.roomID]);
    socket.room_id = (+data.roomID);
    rooms_info[+data.roomID].sockets.push(socket);
    socket.leave('roomList_subscribers');

    socket.emit('get_logs', rooms_info[+(data.roomID)].logs);
  });

  socket.on('roomList_unsubscribe', function(){
    socket.leave('roomList_subscribers');
  });

  socket.on('disconnect', function (){
    console.log('disconnect: ');
    var index = waiting.indexOf(socket);
    socket.leave('roomList_subscribers');
    if (index !== -1){
      console.log("Player left queue");
      waiting.splice(index,1);
    }
    else if (socket.room_id !== null){
      var index = rooms_info[socket.room_id].sockets.indexOf(socket);
      console.log("index: " + index);
      if ((index > 1)||(index < 0)){
        console.log("gonna break!!!!!!!!!!!!!");
        rooms_info[socket.room_id].sockets.splice(index,1);
        socket.leave(rooms[socket.room_id]);
        socket.room_id = null;
        return;
      }
      console.log("player left");
      var game_end_info = {};
      game_end_info.msg = "leave";
      game_end_info.winnerColor = (socket.color === "white" ? "black" : "white");
      io.sockets.to(rooms[socket.room_id]).emit('game_end', game_end_info);

      emptyRoom(socket.room_id);
    }
  });



});

var gameOverStaff = function (room_id){

};

var getRoomList = function (){
  var list = [];
  var l = rooms.length;
  for (var i = 0; i < l; ++i){
    if (rooms[i] !== null){
      var new_elem = {};
      new_elem.roomID = i;
      new_elem.length = rooms_info[i].sockets.length;
      list.push(new_elem);
    }
  }
  return list;
};

var joinRoom = function (socket1, socket2){
  var id = getRoom();
  rooms_info[id] = {};
  rooms_info[id].logs = [];
  rooms_info[id].sockets = [];
  console.log("room found, id: " + id);
  socket1.room_id = id;
  socket2.room_id = id;
  rooms_info[id].sockets[0] = socket1;
  rooms_info[id].sockets[1] = socket2;
  socket1.color = 'white';
  socket2.color = 'black';
  socket1.join(rooms[id]);
  socket2.join(rooms[id]);
};

var getRoom = function (){
  var l = rooms.length;
  var room_index = l;
  for (var i = 0; i < l; ++i){
    if (rooms[i] === null){
      room_index = i;
      console.log("empty room found, id: " + room_index);
      rooms[room_index] = room_index;
      break;

    }
    else{
      console.log("room " + i + " full");
    }
  }
  if (room_index === l){
    rooms.push(room_index);
    ++rooms_amount;
    console.log("new room, id: " + room_index);
  }
  return room_index;
};

var emptyRoom = function (id){
  var n = rooms_info[id].sockets.length;
  for (var i = 0; i < n; ++i){
    rooms_info[id].sockets[i].leave(rooms[id]);
    rooms_info[id].sockets[i].room_id = null;
  }
  rooms[id] = null;
  rooms_info[id].logs = [];
  rooms_info[id].sockets = [];
  io.sockets.to('roomList_subscribers').emit('roomList', getRoomList());
};


var getRoomInfo = function (id){
  console.log('------- ROOM INFO -------');
  console.log('room id: ' + id);
  var n = rooms_info[id].sockets.length;
  console.log('amount of sockets connected: ' + n);
  console.log('playing: ' + (rooms_info[id].sockets[0] !== null ? rooms_info[id].sockets[0].id : null) + " VS " + (rooms_info[id].sockets[1] !== null ? rooms_info[id].sockets[1].id : null));
  console.log('observers: ');
  for (var i = 2; i < n; ++i){
    console.log(i + ': ' + (rooms_info[id].sockets[i] !== null ? rooms_info[id].sockets[i].id : "left"));
  }
    console.log('------- -------- -------');
};

/*
var addRoom = function (id, socket1, socket2){
  var new_room = id;
  room_logs[id] = [];
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
