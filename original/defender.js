module.exports = function (creep) {
  var actionRangedAttack = require("actionRangedAttack");
  var actionRecycle = require("actionRecycle");

  if(actionRangedAttack(creep))
    return;
  if(actionRecycle(creep))
    return;
}
