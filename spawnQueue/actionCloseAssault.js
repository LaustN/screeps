var resolveAssaultTarget = require("resolveAssaultTarget");

module.exports = function (creep) {
  
  var target = resolveAssaultTarget(creep);

  if (target) {
    creep.room.assaultTarget = target.id;

    if(creep.attack(target) == ERR_NOT_IN_RANGE)
      creep.moveTo(target);
    return true;
  }

  return false;
}
