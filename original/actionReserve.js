module.exports = function(creep){
  var reservationFlag = Game.flags[creep.memory.focus];
  if(creep.pos.roomName != reservationFlag.pos.roomName ){
    creep.moveTo(reservationFlag);
    return true;
  }
  else if(creep.reserveController(creep.room.controller)!= OK){
    creep.moveTo(creep.room.controller);
  }
}
