module.exports = function(creep){
  if(creep.room.controller && creep.room.controller.my){
    delete creep.memory.focus;
    var upgradeMessage = creep.upgradeController(creep.room.controller);
    if(upgradeMessage == OK)
      return true;
    if(upgradeMessage == ERR_NOT_IN_RANGE){
      creep.moveTo(creep.room.controller);
      return true;
    }
    if(creep.pos.getRangeTo(creep.room.controller)>3){
      creep.moveTo(creep.room.controller);
      return true;
    }
  }
  return false;
}
  