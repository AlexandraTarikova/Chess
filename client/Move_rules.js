var checkMove = function (cell_from, cell_to){
  var moves = [];
  moves = getMovesFunctions[cell_from.figure.type](cell_from);
  var l = moves.length;
  for (var i = 0; i < l; ++i){
    if ((moves[i].x === cell_to.x)&&(moves[i].y === cell_to.y)){
      if (!checkMoveForCheck(cell_from, cell_to)){
        return true;
      }
      else {
        return false;
      }
    }
  }
  return false;
};

var checkRoque = function(king_cell, castle_cell){
  var current_x = king_cell.x;
  var current_y = king_cell.y;
  if ((king_cell.figure === null)||(king_cell.figure.type !== KING)){
    log ("NOT KING CELL");
    return false;
  }
  if ((castle_cell.figure === null)||(castle_cell.figure.type !== CASTLE)){
    log ("NOT CASTLE CELL");
    return false;
  }
  if (castle_cell.x === 0){
    if (!roque[king_cell.figure.owner][0]){
      return false;
    }
    current_x--;
    while (current_x !== castle_cell.x){
      if (field[current_y][current_x].figure !== null){
        return false;
      }
      current_x--;
    }
    log ("NO FIGURES ARE IN WAY");
    current_x = king_cell.x;
    for (var i = 0; i < 3; ++i){
      if (checkCellForCheck(king_cell.figure.owner,field[current_y][current_x - i])){
        log ("CELL IN DANGER");
        log (field[current_y][current_x - i]);
        return false;
      }
      log ("CELL NOT IN DANGER");
      log (field[current_y][current_x - i])
    }
    log ("NO CELLS ARE IN DANGER");
    return true;
  }

  if (castle_cell.x === 7){
    if (!roque[king_cell.figure.owner][1]){
      return false;
    }
    current_x++;
    while (current_x !== castle_cell.x){
      if (field[current_y][current_x].figure !== null){
        return false;
      }
      current_x++;
    }
    log ("NO FIGURES ARE IN WAY");
    current_x = king_cell.x;
    for (var i = 0; i < 3; ++i){
      if (checkCellForCheck(king_cell.figure.owner,field[current_y][current_x + i])){
        log ("CELL IN DANGER");
        log (field[current_y][current_x + i]);
        return false;
      }
      log ("CELL NOT IN DANGER");
      log (field[current_y][current_x + i])
    }
    log ("NO CELLS ARE IN DANGER");
    return true;
  }
  log ("ROQUE WAS FORBIDDEN");
  return false;
};
