module.exports = function (creep) {
  var actionFlee = require("actionFlee");
  var actionRenew =  require("actionRenew");
  var actionScout = require("actionScout");
  var actionCollectEnergy = require("actionCollectEnergy");
  var actionBuild = require("actionBuild");
  var actionFortify = require("actionFortify");
  var actionUpgradeControl = require("actionUpgradeControl");
  var actionUnloadEnergy = require("actionUnloadEnergy");

  if(actionFlee(creep))
    return;
  if(actionRenew(creep))
    return;
  if(actionScout(creep))
    return;
  if(actionCollectEnergy(creep))
    return;
  if(actionBuild(creep))
    return;
  if(actionFortify(creep))
    return;
  if(actionUpgradeControl(creep))
    return;
  if(actionUnloadEnergy(creep))
    return;
}
