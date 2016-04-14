module.exports = function (creep) {
  var actionRenew =  require("actionRenew");
  var actionAssaultMove = require("actionAssaultMove");
  var actionAssaultCreeps = require("actionAssaultCreeps");
  var actionProximityHealer = require("actionProximityHealer");
  var actionAssaultStructures = require("actionAssaultStructures");

  actionProximityHealer(); //never returns false;

  if(actionRenew(creep))
    return;
  if(actionAssaultMove(creep))
    return;
  if(actionAssaultCreeps(creep))
    return;
  if(actionAssaultStructures(creep))
    return;
}
