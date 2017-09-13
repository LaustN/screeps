module.exports = function (creep) {
  if ((_.sum(creep.carry) == creep.carryCapacity)) {
    var home = Game.getObjectById(creep.memory.home);
    if (home && home.room.name != creep.room.name) {
      creep.moveTo(home);
      return true;
    }
  }
  return false;
}

