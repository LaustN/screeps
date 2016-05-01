module.exports = function (creep) {
  var actionFlee = require("actionFlee");
  var actionRenew =  require("actionRenew");
  var actionScout = require("actionScout");
  var actionScavenge = require("actionScavenge");
  var actionRaze = require("actionRaze");
  var actionHarvest = require("actionHarvest");
  var actionBuild = require("actionBuild");
  var actionFortify = require("actionFortify");
  var actionUpgradeControl = require("actionUpgradeControl");
  var actionUnloadEnergy = require("actionUnloadEnergy");

  if(actionFlee(creep))
    return;
//  if(actionRenew(creep))
//    return;
  if(actionScout(creep))
    return;
  if(actionRaze(creep))
    return;
  if(actionScavenge(creep))
    return;
  if(actionBuild(creep))
    return;
  if(actionFortify(creep))
    return;
  if(actionUpgradeControl(creep))
    return;
  if(actionUnloadEnergy(creep))
    return;
  if(actionHarvest(creep))
    return;
}
