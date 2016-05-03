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
  var actionResetScout = require("actionResetScout");

  if(actionFlee(creep))
    return;
    console.log("a");
//  if(actionRenew(creep))
//    return;
  if(actionScout(creep))
    return;
    console.log("b");
  if(actionRaze(creep))
    return;
    console.log("c");
  if(actionScavenge(creep))
    return;
    console.log("d");
  if(actionHarvest(creep))
    return;
    console.log("e");
  if(actionBuild(creep))
    return;
    console.log("f");
  if(actionFortify(creep))
    return;
    console.log("g");
  if(actionUpgradeControl(creep))
    return;
    console.log("h");
  if(actionUnloadEnergy(creep))
    return;
    console.log("i");
  actionResetScout();
  console.log("j");
}
