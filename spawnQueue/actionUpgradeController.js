module.exports = function(creep){
  if(creep.room.controller && creep.room.controller.my){
    var upgradeMessage = creep.upgradeController(creep.room.controller);
    if(upgradeMessage == ERR_NOT_IN_RANGE){
      creep.moveTo(creep.room.controller);
    }
  }
  return false;
}
  