var startObserving = function(id){
  observer_popup.hide();
  var info = {};
  info.roomID = id;
  i_am_observer = true;
  cleanField(id);
  my_color = null;
  console.log ("emit room_enter, id: " + id);
  socket.emit('room_enter', info);
};


var bindSocketEvents = function(){
  socket.on('game_found', function (data){
    leave_queue_popup.hide();
    console.log ("Game found!");
    console.log ("My color:");
    console.log (data);
    my_color = (data.color === 'white') ? WHITE : BLACK;
    console.log ("Let the game begin! Start drawing board...");
    i_am_observer = false;
    cleanField(data.roomID);
  });

  socket.on('player_move', function (move_info){
    console.log ("enemy_move");
    playerMove(move_info, "move");
  });

  socket.on('player_castling', function (move_info){
    console.log ("enemy_castling");
    playerMove(move_info, "castling");
  });

  socket.on('player_promotion', function (move_info){
    console.log ("enemy_promotion");
    playerMove(move_info, "promotion");
  });

  socket.on('player_mate', function (){
    if (checkMate(1 - my_color)){
      socket.emit('turnValidation_mate');
    }
  });

  socket.on('player_draw', function (){
    if (checkStale(1 - my_color)){
      socket.emit('turnValidation_draw');
    }
  });

  socket.on('game_end', function (data){
    //alert ("Game Over! Reason: " + data.msg + ", winner: " + (data.winnerColor === null ? "no" : data.winnerColor));
    //menu_popup.show();
    console.log("GAME OVER");
    drawGameEnd(data);
    game_over_popup.show();
  });

  socket.on('roomList', function(data){
    console.log('getting roomList!');
    console.log(data);
    drawObserver(data);
    observer_popup.show();
  });

  socket.on('get_logs', function(data){
    console.log("getting logs");
    var l = data.length;
    for (var i = 0; i < l; ++i){
      console.log("data[i]: ");
      console.log(data[i]);
      var info = {};
      info.from = data[i].from;
      info.to = data[i].to;
      info.playerColor = data[i].playerColor;
      playerMove(info, data[i].moveType);
    }
  });

};

var convertXtoNum = function (letter){
  return (letter.charCodeAt(0) - 65);
};
var convertXtoChar = function (number){
  return (String.fromCharCode(65 + number));
};
var convertY = function (number){
  return (8 - number);
};

var playerMove = function (move_info, type){
  if (((move_info.playerColor === "white")&&(my_color === WHITE))||((move_info.playerColor === "black")&&(my_color === BLACK))){
    return;
  }
  if (type !== "castling"){
    move_info.from.x = convertXtoNum(move_info.from.x);
    move_info.from.y = convertY(move_info.from.y);
    move_info.to.x = convertXtoNum(move_info.to.x);
    move_info.to.y = convertY(move_info.to.y);
    if ((type === "promotion")&&(move_info.newPiece !== "knight")&&(move_info.newPiece !== "bishop")&&(move_info.newPiece !== "rook")&&(move_info.newPiece !== "queen")){
      console.log("emit 'turnValidation_invalid', invalid promotion")
      socket.emit('turnValidation_invalid');
      return;
    }
  }
  else {
    move_info.to = {};
    move_info.to.x = convertXtoNum(move_info.from.x);
    move_info.to.y = convertY(move_info.from.y);
    move_info.from.x = (getKingCell(1 - my_color)).x;
    move_info.from.y = (getKingCell(1 - my_color)).y;
  }
  console.log("checking enemy move. Move type = " + type + ", move_info = ");
  log (move_info.from);
  log (move_info.to);
  if ((!i_am_observer)&&((active_player !== (1 - my_color)) || (! checkMove(field[move_info.from.y][move_info.from.x],field[move_info.to.y][move_info.to.x])))){
    console.log("emit 'turnValidation_invalid' " + active_player + " " + my_color);
    console.log("from: ");
    socket.emit('turnValidation_invalid');
    return;
  }
  else {
    moveFigure(field[move_info.from.y][move_info.from.x],field[move_info.to.y][move_info.to.x]);
    if (type === "promotion"){
      promotePawn(field[move_info.to.y][move_info.to.x], move_info.newPiece);
    }
    console.log("valid enemy move");
    active_player = 1 - active_player;
    endGameChecks();
  }
};

var endGameChecks = function (){
  if (checkMate(my_color)){
    socket.emit('turn_mate');
  }
  else if (checkStale(my_color)){
    socket.emit('turn_draw');
  }
};
