module.exports = function (creep) {
//  var actionRenew =  require("actionRenew");
  var actionHealCreeps = require("actionHealCreeps");
  var actionAssaultStructures = require("actionAssaultStructures");

  if(actionHealCreeps(creep))
    return;
  if(actionAssaultMove(creep))
    return;
}
