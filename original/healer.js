module.exports = function (creep) {
//  var actionRenew =  require("actionRenew");
  var actionHealCreeps = require("actionHealCreeps");
  var actionHealerMove = require("actionHealerMove");

  if(actionHealCreeps(creep))
    return;
  if(actionHealerMove(creep))
    return;
}
