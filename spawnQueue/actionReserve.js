module.exports = function (creep) {
  if (creep.room.controller) {
    if (creep.pos.isNearTo(creep.room.controller)) {
      var reserveResult = creep.reserveController(creep.room.controller);
      if (reserveResult == ERR_INVALID_TARGET) {
        creep.attackController(creep.room.controller);
      }
    }
    else {
      creep.moveTo(creep.room.controller);
    }
    return true;
  }
  return false;
}
