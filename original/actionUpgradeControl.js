module.exports = function(creep){
  if(creep.room.controller && creep.room.controller.my){
    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
        creep.moveTo(creep.room.controller)
    }
    return true;
  }
}
