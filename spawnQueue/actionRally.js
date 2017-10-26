module.exports = function (creep) {
  var flag = Game.flags[creep.memory.flag];
  if (flag) {
    if (creep.memory.hasVisitedFlag && Game.time == (1 + creep.memory.lastCompletedRallyTime)) {
      creep.memory.lastCompletedRallyTime = Game.time;
      return false;
    }

    if (creep.pos.roomName != flag.pos.roomName) {
      creep.memory.hasVisitedFlag = false;
      creep.moveTo(flag);
    }
    else {
      if (!creep.pos.inRangeTo(flag, 3)) {
        creep.moveTo(flag);
      } else {
        creep.memory.hasVisitedFlag = true;
        creep.memory.lastCompletedRallyTime = Game.time;
        return false;
      }
    }
    return true;
  }
  return false;
}
