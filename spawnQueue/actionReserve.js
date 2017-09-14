module.exports = function (creep) {
  if (creep.room.controller) {
    if (creep.pos.isNearTo(creep, creep.room.controller))
      creep.reserveController(creep.room.controller);
    else
      creep.moveTo(creep.room.controller);
    return true;
  }
  return false;
}
