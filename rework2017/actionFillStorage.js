module.exports = function(creep){
  if(creep.carry[RESOURCE_ENERGY] && creep.room.storage) {
    if(creep.transfer(RESOURCE_ENERGY,creep.room.storage) == ERR_NOT_IN_RANGE)
      creep.moveTo(creep.room.storage);
    return true;
  }
  return false;
}
  