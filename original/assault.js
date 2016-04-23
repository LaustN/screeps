module.exports = function (creep) {
  var actionRenew =  require("actionRenew");
  var actionAssaultMove = require("actionAssaultMove");
  var actionAssaultCreeps = require("actionAssaultCreeps");
  var actionProximityHealer = require("actionProximityHealer");
  var actionAssaultStructures = require("actionAssaultStructures");

  actionProximityHealer(creep); //never returns false;

  if(actionRenew(creep))
    return;
  if(actionAssaultCreeps(creep))
    return;
  if(actionAssaultStructures(creep))
    return;
  if(actionAssaultMove(creep))
    return;
}
