var setCoordinates = function(x, y, for_who){
  for_who.x = x;
  for_who.y = y;
};

var moveFigure = function(cell_from, cell_to){
  if ((cell_from.figure.type === KING)&&(cell_to.figure !== null)&&(cell_to.figure.type === CASTLE)){
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

    return;
  }
  if ((cell_from.figure.type === PAWN)&&(enpassantable_cell === cell_to)){
    log("ENPASSANTE");
    if (cell_from.figure.owner === BLACK){
      field[cell_to.y - 1][cell_to.x].figure = null;
      updatePicture(field[cell_to.y - 1][cell_to.x]);
    }
    else {
      field[cell_to.y + 1][cell_to.x].figure = null;
      updatePicture(field[cell_to.y + 1][cell_to.x]);
    }
  }
  else if ((cell_from.figure.type === PAWN)&&(cell_to.y % 7 === 0)){
    log("PROMOTE");
    promotePawn(remembered_cell);
  }
  if ((cell_from.figure.type === PAWN)&&(Math.abs(cell_from.y - cell_to.y) == 2)){
    log("NEW ENPASSANTABLE CELL");
    var dir = (cell_from.figure.owner === BLACK) ? 1 : -1;
    enpassantable_cell = field[cell_from.y + dir][cell_from.x];
  }
  else {
    log("ENPASSANTABLE CELL NULLED");
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

var cleanField = function(){
  $("#board").empty();
  for (var i = 0; i < 8; ++i){
    field[i] = [];
    for (var j = 0; j < 8; ++j){
      field[i][j] = {};
      field[i][j].figure = null;
      setCoordinates(j,i,field[i][j]);
      if ((i+j) % 2 === 0){
        field[i][j].div = $("<div/>",{class:'white_squares'});
        field[i][j].div.appendTo("#board");
      }
      else {
        field[i][j].div = $("<div/>",{class:'black_squares'});
        field[i][j].div.appendTo("#board");
      }
      (function(){
      var clicked_cell = field[i][j];
      field[i][j].div.click(function(){
      cellClicked(clicked_cell);
      });
      })();
    }
  }
  defaultFigurePlacement();
};

var cellClicked = function (clicked_cell) {
  if (remembered_cell === null){
    if (clicked_cell.figure !== null){
      if (clicked_cell.figure.owner === active_player){
        remembered_cell = clicked_cell;
        clicked_cell.div.css('background-color', '#FF7F50');
      }
    }
  }
  else if (checkMove(remembered_cell, clicked_cell)){
    moveFigure(remembered_cell, clicked_cell);
    remembered_cell.div.css('background-color', '');
    remembered_cell = null;
    active_player = 1 - active_player;
    var king_cell = getKingCell(active_player);
    if (checkCellForCheck(active_player, king_cell)){
      if (checkMate(active_player)){
        alert("MATE");
      }
      else {
        log ("CHECK");
      }
    }
    else {
      if (checkStale(active_player)){
        alert("STALE");
      }
    }
  }
  else {
    remembered_cell.div.css('background-color', '');
    remembered_cell = null;
  }
};
