module.exports = function(creep){
  var reservationFlag = Game.flags[creep.memory.focus];
  if(creep.pos.roomName != reservationFlag.pos.roomName ){
    creep.moveTo(reservationFlag);
    return true;
  }
  if (reservationFlag.room.controller.owner && reservationFlag.room.controller.my == false) {
    console.log("attacking controller");
    if(creep.attackController(creep.room.controller)!= OK){
      creep.moveTo(creep.room.controller);
    }
  }

  if(creep.reserveController(creep.room.controller)!= OK){
    creep.moveTo(creep.room.controller);
  }
}
