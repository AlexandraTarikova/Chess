
$(document).ready(function(){
  bindSocketEvents();
  drawMenu();
  drawLeaveQueue();
  drawPromotion();
  var rooms = [];
  rooms[0] = {};
  rooms[1] = {};
  rooms[2] = {};
  rooms[0].roomID = 0;
  rooms[1].roomID = 1;
  rooms[2].roomID = 2;
  //drawObserver(rooms);
  //observer_popup.show();
  menu_popup.show();
});

var searchGame = function(){
  console.log("searching for game...");
  socket.emit('game_find');
  leave_queue_popup.show();

  //field[i][j].div = $("<div/>",{class:'white_squares'});

};
