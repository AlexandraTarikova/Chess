var updatePicture = function(cell){
  cell.div.empty();
  if (cell.figure === null){
    return;
  }
  else if (cell.figure.owner === BLACK){
    if (cell.figure.type === PAWN){
      $(cell.div).append('<img src="pics/black_pawn.gif">');
    }
    else if (cell.figure.type === KNIGHT){
      $(cell.div).append('<img src="pics/black_knight.gif">');
    }
    else if (cell.figure.type === BISHOP){
      $(cell.div).append('<img src="pics/black_bishop.gif">');
    }
    else if (cell.figure.type === CASTLE){
      $(cell.div).append('<img src="pics/black_castle.gif">');
        console.log("HOI IM TEMMIE");
    }
    else if (cell.figure.type === QUEEN){
      $(cell.div).append('<img src="pics/black_queen.gif">');
    }
    else if (cell.figure.type === KING){
      $(cell.div).append('<img src="pics/black_king.gif">');
    }
  }
  else if (cell.figure.owner === WHITE){
    if (cell.figure.type === PAWN){
      $(cell.div).append('<img src="pics/white_pawn.gif">');
      }
    else if (cell.figure.type === KNIGHT){
      $(cell.div).append('<img src="pics/white_knight.gif">');
    }
    else if (cell.figure.type === BISHOP){
      $(cell.div).append('<img src="pics/white_bishop.gif">');
    }
    else if (cell.figure.type === CASTLE){
      $(cell.div).append('<img src="pics/white_castle.gif">');
    }
    else if (cell.figure.type === QUEEN){
      $(cell.div).append('<img src="pics/white_queen.gif">');
    }
    else if (cell.figure.type === KING){
      $(cell.div).append('<img src="pics/white_king.gif">');
    }
  }
};

var defaultFigurePlacement = function(){

  field[0][0].figure = setFigure(CASTLE,BLACK);
  field[0][7].figure = setFigure(CASTLE,BLACK);

  field[0][1].figure = setFigure(KNIGHT,BLACK);
  field[0][6].figure = setFigure(KNIGHT,BLACK);

  field[0][2].figure = setFigure(BISHOP,BLACK);
  field[0][5].figure = setFigure(BISHOP,BLACK);

  field[0][3].figure = setFigure(QUEEN,BLACK);

  field[0][4].figure = setFigure(KING,BLACK);

  for (var i = 0; i < 8; ++i){

    field[1][i].figure = setFigure(PAWN,BLACK);
    field[6][i].figure = setFigure(PAWN,WHITE);
  }
  field[7][0].figure = setFigure(CASTLE,WHITE);
  field[7][7].figure = setFigure(CASTLE,WHITE);

  field[7][1].figure = setFigure(KNIGHT,WHITE);
  field[7][6].figure = setFigure(KNIGHT,WHITE);

  field[7][2].figure = setFigure(BISHOP,WHITE);
  field[7][5].figure = setFigure(BISHOP,WHITE);

  field[7][3].figure = setFigure(QUEEN,WHITE);

  field[7][4].figure = setFigure(KING,WHITE);
  for (var i = 0; i < 8; ++i){
    for (var j = 0; j < 8; ++j){
      updatePicture(field[i][j]);
    }
  }
};
