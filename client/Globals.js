var socket = io('http://localhost:3056');
//var socket = io('http://10.254.23.79:3056');

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
var my_color = WHITE;
var i_am_observer = false;
var new_figure;
var promote_cell;
var promotion_info;
var cheat_mode = false;
roque[WHITE] = [true, true]; //[long_roque, short_roque]
roque[BLACK] = [true, true]; //[long_roque, short_roque]

var menu_popup;
var promotion_popup;
var leave_queue_popup;
var game_over_popup;
var observer_popup;


var log = function (a){
  console.log(JSON.parse(JSON.stringify(a)));
};
