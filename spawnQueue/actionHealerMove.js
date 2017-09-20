module.exports = function (creep) {
  var destinationCreep = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
    filter: function (myBattleCreep) {
      return
      ((myBattleCreep.getActiveBodyparts(HEAL) + myBattleCreep.getActiveBodyparts(ATTACK) + myBattleCreep.getActiveBodyparts(RANGED_ATTACK)) > 0)
        && (myBattleCreep.id != creep.id);
    }
  });
  if (destinationCreep) {
    console.log("destination creep: " + destinationCreep.name);
    creep.moveTo(destinationCreep);
    return true;
  }

  return false;
}
