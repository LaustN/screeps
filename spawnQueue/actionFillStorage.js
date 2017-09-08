module.exports = function(creep){
  if((creep.carry[RESOURCE_ENERGY] > 0) && creep.room.storage) {
    if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
      creep.moveTo(creep.room.storage);
    }
    return true;
  }
  return false;
}
  