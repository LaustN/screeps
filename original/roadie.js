module.exports = function (creep) {
  var actionFlee = require("actionFlee");
  var actionRenew =  require("actionRenew");
  var actionScavenge = require("actionScavenge");
  var actionRedistribute = require("actionRedistribute");
  var actionFlagRoadie = require("actionFlagRoadie");

  if(actionFlee(creep))
    return;
  if(actionRenew(creep))
    return;
  if(actionScavenge(creep))
    return;
  if(actionRedistribute(creep))
    return;
  if(actionFlagRoadie(creep))
    return;
}
