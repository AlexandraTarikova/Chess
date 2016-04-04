var getPawnMoves = function (cell_from){
  //log("START OF getPawnMoves");
  var moves = [];
  if (cell_from.figure.owner === BLACK){
    if ((cell_from.y + 1 < 8)&&(field[cell_from.y + 1][cell_from.x].figure === null)){
      //проверка на шах
      moves.push(field[cell_from.y + 1][cell_from.x]);
      if ((cell_from.y === 1)&&(field[cell_from.y + 2][cell_from.x].figure === null)){
        //проверка на шах
        moves.push(field[cell_from.y + 2][cell_from.x]);
      }
    }
    if ((cell_from.y + 1 < 8)&&(cell_from.x + 1 < 8)&&(field[cell_from.y + 1][cell_from.x + 1].figure !== null)&&(field[cell_from.y + 1][cell_from.x + 1].figure.owner !== cell_from.figure.owner)){
      //проверка на шах
      moves.push(field[cell_from.y + 1][cell_from.x + 1]);
    }
    if ((cell_from.y + 1 < 8)&&(cell_from.x - 1 >= 0)&&(field[cell_from.y + 1][cell_from.x - 1].figure !== null)&&(field[cell_from.y + 1][cell_from.x - 1].figure.owner !== cell_from.figure.owner)){
      //проверка на шах
      moves.push(field[cell_from.y + 1][cell_from.x - 1]);
    }
    if (cell_from.y === 4){
      if ((cell_from.x + 1 < 8)&&(enpassantable_cell === field[cell_from.y + 1][cell_from.x + 1])){
        moves.push(field[cell_from.y + 1][cell_from.x + 1]);
      }
    }
    if (cell_from.y === 4){
      if ((cell_from.x - 1 >= 0)&&(enpassantable_cell === field[cell_from.y + 1][cell_from.x - 1])){
        moves.push(field[cell_from.y + 1][cell_from.x - 1]);
      }
    }
  }
  else {
    if ((cell_from.y - 1 >= 0)&&(field[cell_from.y - 1][cell_from.x].figure === null)){
      moves.push(field[cell_from.y - 1][cell_from.x]);
      if ((cell_from.y === 6)&&(field[cell_from.y - 2][cell_from.x].figure === null)){
        moves.push(field[cell_from.y - 2][cell_from.x]);
      }
    }
    if ((cell_from.y - 1 >= 0)&&(cell_from.x + 1 < 8)&&(field[cell_from.y - 1][cell_from.x + 1].figure !== null)&&(field[cell_from.y - 1][cell_from.x + 1].figure.owner !== cell_from.figure.owner)){
      moves.push(field[cell_from.y - 1][cell_from.x + 1]);
    }
    if ((cell_from.y - 1 >= 0)&&(cell_from.x - 1 >= 0)&&(field[cell_from.y - 1][cell_from.x - 1].figure !== null)&&(field[cell_from.y - 1][cell_from.x - 1].figure.owner !== cell_from.figure.owner)){
      moves.push(field[cell_from.y - 1][cell_from.x - 1]);
    }
    if (cell_from.y === 3){
      if ((cell_from.x + 1 < 8)&&(enpassantable_cell === field[cell_from.y - 1][cell_from.x + 1])){
        moves.push(field[cell_from.y - 1][cell_from.x + 1]);
      }
    }
    if (cell_from.y === 3){
      if ((cell_from.x - 1 >= 0)&&(enpassantable_cell === field[cell_from.y - 1][cell_from.x - 1])){
        moves.push(field[cell_from.y - 1][cell_from.x - 1]);
      }
    }
  }
  return moves;
};

var getKnightMoves = function (cell_from){
  //log("START OF getKnightMoves");
  var moves = [];
  var steps = [[1,2],[2,1],[-1,2],[1,-2],[2,-1],[-1,-2],[-2,-1],[-2,1]];
  var l = steps.length;
  var current_x;
  var current_y;
  for (var i = 0; i < l; ++i){
    current_x = cell_from.x + steps[i][0];
    current_y = cell_from.y + steps[i][1];
    if ((current_x < 8)&&(current_x >= 0)&&(current_y < 8)&&(current_y >= 0)){
      if (field[current_y][current_x].figure === null){
        moves.push(field[current_y][current_x]);
      }
      else if (field[current_y][current_x].figure.owner !== cell_from.figure.owner){
        moves.push(field[current_y][current_x]);
      }
    }
  }
  //log("END OF getKnightMoves");
  return moves;
};

var getBishopMoves = function (cell_from){
  //log("START OF getBishopMoves");
  var moves = [];
  moves = getLinearMoves(cell_from, 1, 1).concat(getLinearMoves(cell_from,1,-1),getLinearMoves(cell_from,-1,1),getLinearMoves(cell_from,-1,-1));
    //log("END OF getBishopMoves");
  return moves;
};

var getCastleMoves = function(cell_from){
  //log("START OF getCastleMoves");
  var moves = [];
  moves = getLinearMoves(cell_from, 1, 0).concat(getLinearMoves(cell_from,0,1),getLinearMoves(cell_from,-1,0),getLinearMoves(cell_from,0,-1));
  //проверка на рокировку
    //log("END OF getCastleMoves");
  return moves;
};

var getQueenMoves = function(cell_from){
  //log("START OF getQueenMoves");
  var moves = [];
  moves = getCastleMoves(cell_from).concat(getBishopMoves(cell_from));
  //log("END OF getQueenMoves");
  return moves;
};

var getKingMoves = function(cell_from){
  //log("START OF getKingMoves");
  var moves = [];
  var steps = [[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]];
  var l = steps.length;
  var current_x;
  var current_y;
  for (var i = 0; i < l; ++i){
    current_x = cell_from.x + steps[i][0];
    current_y = cell_from.y + steps[i][1];
    if ((current_x < 8)&&(current_x >= 0)&&(current_y < 8)&&(current_y >= 0)){
      if (field[current_y][current_x].figure === null){
        moves.push(field[current_y][current_x]);
      }
      else if (field[current_y][current_x].figure.owner !== cell_from.figure.owner){
        moves.push(field[current_y][current_x]);
      }
    }
  }
  //проверка на рокировку
  if (checkRoque(cell_from, field[cell_from.y][0])){
    moves.push(field[cell_from.y][0]);
  }
  if (checkRoque(cell_from, field[cell_from.y][7])){
    moves.push(field[cell_from.y][7]);

  }
    //log("END OF getKingMoves");
  return moves;
};

var getLinearMoves = function(cell_from, step_x, step_y){

  if (cell_from.figure === null){
    return null;
  }
  var moves = [];
  current_x = cell_from.x + step_x;
  current_y = cell_from.y + step_y;
  while ((current_x < 8)&&(current_x >= 0)&&(current_y < 8)&&(current_y >= 0)){
    if (field[current_y][current_x].figure !== null){
      if (field[current_y][current_x].figure.owner !== cell_from.figure.owner){
        moves.push(field[current_y][current_x]);
      }
      break;
    }
    else {
      moves.push(field[current_y][current_x]);
      current_x = current_x + step_x;
      current_y = current_y + step_y;
    }
  }
  return moves;
};

var getMovesFunctions = [
  getPawnMoves,
  getKnightMoves,
  getBishopMoves,
  getCastleMoves,
  getQueenMoves,
  getKingMoves
];
