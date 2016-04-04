var PAWN = 0;
var KNIGHT = 1;
var BISHOP = 2;
var CASTLE = 3;
var QUEEN = 4;
var KING = 5;
var BLACK = 0;
var WHITE = 1;
var field = [];
var remembered_cell = null;
var enpassantable_cell = null;
var active_player = WHITE;
var roque = [];
roque[WHITE] = [true, true]; //[long_roque, short_roque]
roque[BLACK] = [true, true]; //[long_roque, short_roque]


var log = function (a){
  console.log(JSON.parse(JSON.stringify(a)));
};
