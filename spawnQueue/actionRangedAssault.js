var resolveAssaultTarget = require("resolveAssaultTarget");

module.exports = function (creep) {
  var target = resolveAssaultTarget(creep);

  if (target) {
    creep.room.assaultTarget = target.id;
    var targetRange = creep.pos.getRangeTo(target);
    if ((targetRange > 3) || target.structureType)  {
      creep.moveTo(target);
    }
    if (targetRange < 3) {
      console.log(creep.name + " might move away?");
    }
    if (creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3).length > 1) {
      creep.rangedMassAttack();
    } else {
      creep.rangedAttack(target);
    }
    return true;
  }

  return false;
}
