module.exports = function (creep) {
  var actionAttackRanged = require("actionAttackRanged");
  var actionRecycle = require("actionRecycle");

  if(actionAttackRanged(creep))
    return;
  if(actionRecycle(creep))
    return;
}
