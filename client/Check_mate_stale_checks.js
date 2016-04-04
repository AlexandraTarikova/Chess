
var checkCellForCheck = function (color, king_cell){
  var enemy_units = getUnits(1 - color);
  var enemy_moves = [];
  var l = enemy_units.length;
  var k;
  for( var i = 0; i < l; ++i){
    //log ("enemy units " + i);
    //log (enemy_units[i]);
    enemy_moves = getMovesFunctions[enemy_units[i].figure.type](enemy_units[i]);
    //log ("enemy moves " + i);
    //log (enemy_moves);
    k = enemy_moves.length;
    for (var j = 0; j < k; ++j){
      if ((enemy_moves[j].x === king_cell.x)&&(enemy_moves[j].y === king_cell.y)){
        return true;
      }
    }
  }
  return false;
};

var checkMate = function (color){
  var units = getUnits(color);
  var l = units.length;
  var k;
  var moves = [];
  for (var i = 0; i < l; ++i){
    moves = getMovesFunctions[units[i].figure.type](units[i]);
    k = moves.length;
    for (var j = 0; j < k; ++j){
      if (!checkMoveForCheck(units[i],moves[j])){
        return false;
      }
    }
  }
  return true;
};

var checkStale = function (color){
  var units = getUnits(color);
  var l = units.length;
  for (var i = 0; i < l; ++i){
    if (filterMovesWithoutCheck(units[i],getMovesFunctions[units[i].figure.type](units[i])).length !== 0){
      return false;
    }
  }
  return true;
};

var getKingCell = function (color){
  for (var i = 0; i < 8; ++i){
    for (var j = 0; j < 8; ++j){
      if (field[i][j].figure !== null){
        if ((field[i][j].figure.type === KING)&&(field[i][j].figure.owner === color)){
          return field[i][j];
        }
      }
    }
  }
};

var  getUnits = function (color){
  var units = [];
  for (var i = 0; i < 8; ++i){
    for (var j = 0; j < 8; ++j){
      if (field[i][j].figure !== null){
        if (field[i][j].figure.owner === color){
          units.push(field[i][j]);
        }
      }
    }
  }
  return units;
};

var checkMoveForCheck = function (cell_from, cell_to){
  var result;
  if (cell_from.figure.type === KING){
    var king_cell = cell_to;
    if ((cell_to.figure !== null)&&(cell_to.figure.type === CASTLE)){
      return false;
    }
  }
  else {
    var king_cell = getKingCell(cell_from.figure.owner);
  }
  var enpassante_move = false;
  var enpassante_backup = null;
  if ((cell_from.figure.type === PAWN)&&(cell_to.figure === null)&&(Math.abs(cell_from.x - cell_to.x) === 1)&&(Math.abs(cell_from.y - cell_to.y) === 1)){
    enpassante_move = true;
    log("enpassante!")
    if (cell_from.owner === BLACK){
      enpassante_backup = field[cell_to.y - 1][cell_to.x].figure;
      field[cell_to.y - 1][cell_to.x].figure = null;
    }
    else {
      enpassante_backup = field[cell_to.y + 1][cell_to.x].figure;
      field[cell_to.y + 1][cell_to.x].figure = null;
    }
  }
  var cell_from_backup_figure = cell_from.figure;
  var cell_to_backup_figure = cell_to.figure;
  dummyMove(cell_from,cell_to);
  result = checkCellForCheck(cell_to.figure.owner,king_cell);
  cell_from.figure = cell_from_backup_figure;
  cell_to.figure = cell_to_backup_figure;
  if (enpassante_move){
    if (cell_from.owner === BLACK){
      field[cell_to.y - 1][cell_to.x].figure = enpassante_backup;
    }
    else {
      field[cell_to.y + 1][cell_to.x].figure = enpassante_backup;
    }
  }
  return result;
};

var filterMovesWithoutCheck = function (cell_from, all_moves){
  var filtered_moves = [];
  var l = all_moves.length;
  for (var i = 0; i < l; ++i){
    if (!checkMoveForCheck(cell_from, all_moves[i])){
      filtered_moves.push(all_moves[i]);
    }
  }
  return filtered_moves;
};
