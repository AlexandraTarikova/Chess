var drawMenu = function(){
  menu_popup = $("<div/>",{class:'popup'});
  menu_popup.hide();
  menu_popup.empty();
  var menu = $("<div/>",{class:'menu'});
  menu.css('margin-top', '20em');
  menu.css('margin-left', '16.5em');

  menu.css('width','8em');
  menu.css('height','4em');
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

  observe.click (function (){
    menu_popup.hide();
    socket.emit('roomList_subscribe');
  });
  $('body').append(menu_popup);
};

var drawLeaveQueue = function(){
  leave_queue_popup = $("<div/>",{class:'popup'});
  leave_queue_popup.hide();
  leave_queue_popup.empty();
  var menu = $("<div/>",{class:'menu'});
  menu.css('width','8em');
  menu.css('height','4em');
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

var drawObserver = function(rooms){
  observer_popup = $("<div/>",{class:'popup'});
  observer_popup.hide();
  observer_popup.empty();
  var menu = $("<div/>",{class:'menu'});
  menu.css('width','31em');
  menu.css('height','30em');
  menu.css('margin-top', '5em');
  menu.css('margin-left', '5em');
  menu.css('overflow','scroll');
  //menu.css('background-color','rgba(0,0,0,0)');
  //menu.css('border-radius', '0px');
  observer_popup.append(menu);

  var header = $("<div/>");
  header.css('font-size', '3em');
  header.css('text-align', 'center');
  header.css('width','10em');
  header.css('height','1.5em');
  //header.css('background-color', '#EDD19C');
  header.append("ROOMS");
  menu.append(header);



  var ok = $("<div/>",{class:'button'});
  ok.append('<img src="pics/exit.png" />');
  ok.css('width', '1em');
  ok.css('height', '1em');
  ok.css('float','right');
  header.append(ok);
  ok.click(function(){
    observer_popup.hide();
    socket.emit('roomList_unsubscribe');
    menu_popup.show();
  });


  for (var i = 0, l = rooms.length; i < l; ++i){

    var line = $("<div/>");
    line.css('font-size', '2em');
    line.css('text-align', 'center');
    line.css('width','15em');
    line.css('content-align', 'center');
    if (i % 2 === 0){
      line.css('background-color','#b3b3b3');
    }
    else{
      line.css('background-color','#919191');
    }

    (function(){
    var clicked_line = line;
    var index = rooms[i].roomID;
    line.click(function(){
      startObserving(index);
    });
    })();

    var id = $("<div/>");
    id.css('text-align', 'left');
    id.css('width','10em');
    id.css('overflow', 'hidden');
    id.append("ID: " + rooms[i].roomID);
    line.append(id);

    menu.append(line);
  }

  $('body').append(observer_popup);
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

var drawGameEnd = function(info){

  console.log("DRAW");
  console.log(info);
  game_over_popup = $("<div/>",{class:'popup'});
  game_over_popup.hide();
  game_over_popup.empty();
  var menu = $("<div/>",{class:'menu'});
  menu.css('content-align','center');
  menu.css('text-align','center');
  menu.css('width','8em');
  menu.css('heght','4em');
  menu.css('margin-top', '10em');
  menu.css('margin-left', '6em');
  menu.css('font-size', '2em');
  menu.css('text-align', 'center');
  menu.append("winner: " + info.winnerColor + "<br>");
  menu.append("reason: " + info.msg);
  game_over_popup.append(menu);

  var ok = $("<div/>",{class:'button'});
  ok.append('<img src="pics/exit.png" />');
  ok.css('width', '1em');
  ok.css('height', '1em');
  menu.append(ok);

  ok.click(function(){
    game_over_popup.hide();
    menu_popup.show();
  });
  $('body').append(game_over_popup);
};
