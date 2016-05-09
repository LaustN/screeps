module.exports = function (creep) {
  var actionFlee = require("actionFlee");
  var actionRenew =  require("actionRenew");
  var actionScavenge = require("actionScavenge");
  var actionRedistributeFillStorage = require("actionRedistributeFillStorage");
  var actionRedistribute = require("actionRedistribute");

  if(actionFlee(creep))
    return;
//  if(actionRenew(creep))
//    return;
  if(actionRedistributeFillStorage(creep))
    return;
  if(actionScavenge(creep))
    return;
}
