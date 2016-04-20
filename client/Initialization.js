var setCoordinates = function(x, y, for_who){
  for_who.x = x;
  for_who.y = y;
};

var moveFigure = function(cell_from, cell_to){
  var move_info = {};
  console.log ("start moving figure");
  if (active_player === my_color){
    console.log ("it's my turn!");
    var from = {};
    from.x = convertXtoChar(cell_from.x);
    from.y = convertY(cell_from.y);
    var to = {};
    to.x = convertXtoChar(cell_to.x);
    to.y = convertY(cell_to.y);
    var newPiece = null;
    var move_info = {};
    move_info.from = from;
    move_info.to = to;
    move_info.newPiece = newPiece;
  }

  if ((cell_from.figure.type === KING)&&(cell_to.figure !== null)&&(cell_to.figure.type === CASTLE)&&(cell_from.figure.owner === cell_to.figure.owner)){
    if (active_player === my_color){
      console.log("send castling info");
      move_info.from = to;
      socket.emit('turn_castling', move_info);
    }
    console.log("doing castling");
    roque[cell_from.figure.owner][0] = false;
    roque[cell_from.figure.owner][1] = false;
    var dir = (cell_to.x === 0) ? -1 : 1;
    field[cell_from.y][cell_from.x + 2*dir].figure = cell_from.figure;
    updatePicture(field[cell_from.y][cell_from.x + 2*dir]);
    cell_from.figure = null;
    updatePicture(cell_from);
    field[cell_from.y][field[cell_from.y][cell_from.x + 2*dir].x - 1*dir].figure = cell_to.figure;
    updatePicture(field[cell_from.y][field[cell_from.y][cell_from.x + 2*dir].x - 1*dir]);
    cell_to.figure = null;
    updatePicture(cell_to);
    console.log("castling done");
    return;
  }


  if ((cell_from.figure.type === PAWN)&&(enpassantable_cell === cell_to)){
    if (cell_from.figure.owner === BLACK){
      field[cell_to.y - 1][cell_to.x].figure = null;
      updatePicture(field[cell_to.y - 1][cell_to.x]);
    }
    else {
      field[cell_to.y + 1][cell_to.x].figure = null;
      updatePicture(field[cell_to.y + 1][cell_to.x]);
    }
  }
  if ((cell_from.figure.type === PAWN)&&(Math.abs(cell_from.y - cell_to.y) == 2)){
    var dir = (cell_from.figure.owner === BLACK) ? 1 : -1;
    enpassantable_cell = field[cell_from.y + dir][cell_from.x];
  }
  else {
    enpassantable_cell = null;
  }
  //рокировочные дела
  if(cell_from.figure.type === KING){
    roque[cell_from.figure.owner][0] = false;
    roque[cell_from.figure.owner][1] = false;
  }
  else if(cell_from.figure.type === CASTLE){
    if (cell_from.x === 0){
      roque[cell_from.figure.owner][0] = false;
    }
    else if (cell_from.x === 7){
      roque[cell_from.figure.owner][1] = false;
    }
  }


  else if ((cell_from.figure.type === PAWN)&&(cell_to.y % 7 === 0)){
    if (active_player === my_color){
      promote_cell = cell_to;
      promotion_info = move_info;
      cell_to.figure = cell_from.figure;
      cell_from.figure = null;
      updatePicture(cell_from);
      //promotePawn(remembered_cell, new_figure);
      //move_info.newPiece = new_figure;
      promotion_popup.show();
      return;
    }
  }

  if (active_player === my_color){
      console.log("send move info");
      socket.emit('turn_move', move_info);
  }
  cell_to.figure = cell_from.figure;
  cell_from.figure = null;
  updatePicture(cell_to);
  updatePicture(cell_from);
};


var setFigure = function(type,owner){
  var figure = {}
  figure.type = type;
  figure.owner = owner;
  return figure;
};

var cleanField = function(roomID){
  field = [];
  remembered_cell = null;
  enpassantable_cell = null;
  active_player = WHITE;
  roque = [];
  i_am_observer = false;
  new_figure = "queen";
  roque[WHITE] = [true, true]; //[long_roque, short_roque]
  roque[BLACK] = [true, true]; //[long_roque, short_roque]

  $("#board").empty();
  //$("#popup1").hide();
  //$("#room_id").css('background-color', '#EDD19C')
  $("#room_id").empty();
  $("#room_id").append("Room: " + roomID);
  $("#board").css('border', '0.5em solid black');
  for (var i = 0; i < 8; ++i){
    field[i] = [];
    for (var j = 0; j < 8; ++j){
      field[i][j] = {};
      field[i][j].figure = null;
      setCoordinates(j,i,field[i][j]);
      if ((i+j) % 2 === 0){
        field[i][j].div = $("<div/>",{class:'white_squares'});
        //field[i][j].div.appendTo("#board");
      }
      else {
        field[i][j].div = $("<div/>",{class:'black_squares'});
        //field[i][j].div.appendTo("#board");
      }
      (function(){
      var clicked_cell = field[i][j];
      field[i][j].div.click(function(){
      cellClicked(clicked_cell);
      });
      })();
    }
  }
  if (my_color === WHITE){
    for (var i = 0; i < 8; ++i){
      for (var j = 0; j < 8; ++j){
        field[i][j].div.appendTo("#board");
      }
    }
  }
  else {
    for (var i = 7; i >= 0; --i){
      for (var j = 7; j >= 0; --j){
        field[i][j].div.appendTo("#board");
      }
    }
  }
  $('#exit').empty();
  $('#exit').prepend('<img src="pics/exit.png" />');
  $('#exit').click (function(){
    console.log("emit 'room_leave'")
    socket.emit('room_leave');
    return;
  });
  //$("#popup1").show();
  defaultFigurePlacement();
};

var cellClicked = function (clicked_cell) {
  if (remembered_cell === null){
    if ((clicked_cell.figure !== null) && (clicked_cell.figure.owner === active_player) && (clicked_cell.figure.owner === my_color)){
      remembered_cell = clicked_cell;
      clicked_cell.div.css('background-color', '#FF7F50');
    }
  }
  else if ((checkMove(remembered_cell, clicked_cell))||(cheat_mode)){
    moveFigure(remembered_cell, clicked_cell);
    remembered_cell.div.css('background-color', '');
    clicked_cell = null;
    remembered_cell = null;
    active_player = 1 - active_player;
  }
  else {
    console.log("checkMove ERROR");
    remembered_cell.div.css('background-color', '');
    clicked_cell = null;
    remembered_cell = null;
  }
};
