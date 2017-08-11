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
    return true;
  }

  var claimResult = creep.claimController(creep.room.controller)
  if(claimResult != OK){
    creep.moveTo(creep.room.controller);
  }
  if(claimResult == ERR_GCL_NOT_ENOUGH){ //claim what you may, reserve the rest
    creep.reserveController(creep.room.controller);
  }
}
