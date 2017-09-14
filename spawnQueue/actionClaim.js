module.exports = function (creep) {
  if (creep.room.controller) {
    if (creep.pos.isNearTo(creep.room.controller))
      creep.claimController(creep.room.controller);
    else
      creep.moveTo(creep.room.controller);
    return true;
  }
  return false;
}
