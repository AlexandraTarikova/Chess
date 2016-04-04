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

var promotePawn = function (cell){
  //дописать выбор из разных фигур
  var choice = "";
  while (((+choice) !== KNIGHT) && ((+choice) !== BISHOP) && ((+choice) !== CASTLE) && ((+choice) !== QUEEN)){
    choice = prompt ("Choose type: 1 - knight, 2 - bishop, 3 - castle, 4 - queen");
  }
  cell.figure.type = (+choice);
  updatePicture(cell);
}
