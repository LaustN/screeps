module.exports = function (creep) {
  if (creep.carryCapacity == _.sum(creep.carry))
    return false;

  var focusObject = Game.getObjectById(creep.memory.focus);

  if (focusObject) {
    var harvestMessage = creep.harvest(focusObject);
    if (harvestMessage != OK) {
      if (!creep.pos.isNearTo(focusObject)) {
        creep.moveTo(focusObject);
        return true;
      }
    }
    return true;
  }
  return false;
}
