module.exports = function (creep) {
//  var actionRenew =  require("actionRenew");
  var actionAssaultDestroyFlaggedLocation = require("actionAssaultDestroyFlaggedLocation");
  var actionAssaultMove = require("actionAssaultMove");
  var actionAssaultCreeps = require("actionAssaultCreeps");
  var actionProximityHealer = require("actionProximityHealer");
  var actionAssaultStructures = require("actionAssaultStructures");

  actionProximityHealer(creep); //never returns false;

  if (actionAssaultDestroyFlaggedLocation(creep)) 
    return;
//  if(actionRenew(creep))
//    return;
  if(actionAssaultCreeps(creep))
    return;
  if(actionAssaultStructures(creep))
    return;
  if(actionAssaultMove(creep))
    return;
}
