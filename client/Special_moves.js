var copyCell = function (cell){
  if (cell === null){
    return null;
  }
  var new_cell = {};
  new_cell.x = cell.x;
  new_cell.y = cell.y;
  new_cell.div = cell.div;
  if (cell.figure !== null){
    new_cell.figure = {};
    new_cell.figure.type = cell.figure.type;
    new_cell.figure.owner = cell.figure.owner;
  }
  else {
    new_cell.figure = null;
  }
  return cell;
};

var dummyMove = function (cell_from, cell_to){
  cell_to.figure = cell_from.figure;
  cell_from.figure = null;
};

var promotePawn = function (cell, choice){
  if (choice === "knight"){
    choice = 1;
  }
  else if (choice === "rook"){
    choice = 3;
  }
  else if (choice === "bishop"){
    choice = 2;
  }
  else {
    choice = 4;
  }
  cell.figure.type = choice;
  updatePicture(cell);
}
