var resolveAssaultTarget = require("resolveAssaultTarget");

module.exports = function (creep) {
  var target = resolveAssaultTarget(creep);

  if (target) {
    creep.room.assaultTarget = target.id;
    var targetRange = creep.pos.getRangeTo(target);
    if ((targetRange > 2))  {
      creep.moveTo(target);
    }
    if (targetRange < 2) {
      creep.moveTo(Game.getObjectById(creep.memory.home));
    }
    if ((creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3).length + creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3).length) > 1) {
      creep.rangedMassAttack();
    } else {
      creep.rangedAttack(target);
    }
    return true;
  }

  return false;
}
