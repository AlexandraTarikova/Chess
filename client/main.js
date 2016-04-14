
$(document).ready(function(){
  bindSocketEvents();
  drawMenu();
  drawLeaveQueue();
  drawPromotion();
  menu_popup.show();
});

var searchGame = function(){
  console.log("searching for game...");
  socket.emit('game_find');
  leave_queue_popup.show();

  //field[i][j].div = $("<div/>",{class:'white_squares'});

};
