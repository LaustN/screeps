module.exports = function (creep) {
//  var actionRenew =  require("actionRenew");
  var actionHealCreeps = require("actionHealCreeps");
  var actionAssaultMove = require("actionAssaultMove");

  if(actionHealCreeps(creep))
    return;
  if(actionAssaultMove(creep))
    return;
}
