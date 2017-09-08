module.exports = function (creep) {
  if(creep.carryCapacity  == _.sum(creep.carry))
    return false;
  
  var focusObject = Game.getObjectById(creep.memory.focus);
  if (focusObject) {
    var harvestMessage = creep.harvest(focusObject)
    switch (harvestMessage) {
      case OK:
        break;
      case ERR_NOT_IN_RANGE:
        creep.moveTo(focusObject);
        break;
      default:
        break;
    }
    return true;
  }
  return false;
}
