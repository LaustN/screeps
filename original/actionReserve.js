module.exports = function(creep){
  var reservationFlag = Game.flags[creep.memory.focus];
  if(creep.room.roomName != reservationFlag.name ){
    creep.moveTo(reservationFlag);
  }
  else if(creep.reserveController(creep.room.controller)!= OK){
    creep.moveTo(creep.room.controller);
  }
}
