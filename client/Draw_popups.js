var drawMenu = function(){
  menu_popup = $("<div/>",{class:'popup'});
  menu_popup.hide();
  menu_popup.empty();
  var menu = $("<div/>",{class:'menu'});
  menu.css('margin-top', '20em');
  menu.css('margin-left', '16.5em');

  menu.css('width','8em');
  menu.css('heght','4em');
  menu_popup.append(menu);
  var search = $("<div/>",{class:'button'});
  search.append('<img src="pics/search.png" />');

  search.click (function (){
    menu_popup.hide();
    searchGame();
  });
  var observe = $("<div/>",{class:'button'});
  menu.append(observe);
  menu.append(search);
  observe.append('<img src="pics/eye.svg" />');
  $('body').append(menu_popup);
};

var drawLeaveQueue = function(){
  leave_queue_popup = $("<div/>",{class:'popup'});
  leave_queue_popup.hide();
  leave_queue_popup.empty();
  var menu = $("<div/>",{class:'menu'});
  menu.css('width','8em');
  menu.css('heght','4em');
  menu.css('margin-top', '20em');
  menu.css('margin-left', '16.5em');
  leave_queue_popup.append(menu);
  var wait = $("<div/>",{class:'button'});
  wait.append('<img src="pics/clock.png" />');
  menu.append(wait);
  var exit = $("<div/>",{class:'button'});
  exit.append('<img src="pics/exit.png" />');

  exit.click(function () {
    leave_queue_popup.hide();
    socket.emit('game_stopFinding');
    menu_popup.show();
  });

  menu.append(exit);
  $('body').append(leave_queue_popup);
};

var drawPromotion = function(){
  promotion_popup = $("<div/>",{class:'popup'});
  promotion_popup.hide();
  promotion_popup.empty();
  var menu = $("<div/>",{class:'menu'});
  menu.css('width','16em');
  menu.css('heght','4em');
  menu.css('margin-top', '20em');
  menu.css('margin-left', '12.5em');
  promotion_popup.append(menu);

  var knight = $("<div/>",{class:'button'});
  knight.append('<img src="pics/white_knight.gif" />');
  menu.append(knight);
  knight.click(function (){
    new_figure = "knight";
    promotion_info.newPiece = new_figure;
    promotePawn(promote_cell, new_figure);
    socket.emit('turn_promotion', promotion_info);
    promotion_popup.hide();
  });

  var bishop = $("<div/>",{class:'button'});
  bishop.append('<img src="pics/white_bishop.gif" />');
  menu.append(bishop);
  bishop.click(function (){
    new_figure = "bishop";
    promotion_info.newPiece = new_figure;
    promotePawn(promote_cell, new_figure);
    socket.emit('turn_promotion', promotion_info);
    promotion_popup.hide();
  });

  var rook = $("<div/>",{class:'button'});
  rook.append('<img src="pics/white_castle.gif" />');
  menu.append(rook);
  rook.click(function (){
    new_figure = "rook";
    promotion_info.newPiece = new_figure;
    promotePawn(promote_cell, new_figure);
    socket.emit('turn_promotion', promotion_info);
    promotion_popup.hide();
  });

  var queen = $("<div/>",{class:'button'});
  queen.append('<img src="pics/white_queen.gif" />');
  menu.append(queen);
  queen.click(function (){
    new_figure = "queen";
    promotion_info.newPiece = new_figure;
    promotePawn(promote_cell, new_figure);
    socket.emit('turn_promotion', promotion_info);
    promotion_popup.hide();
  });
  $('body').append(promotion_popup);
};

var drawGameEnd = function(){

};
