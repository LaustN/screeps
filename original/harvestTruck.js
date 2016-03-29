module.exports = function (creep) {
    var actionFlee = require("actionFlee");
    var actionRenew =  require("actionRenew");
    var actionScavenge = require("actionScavenge");
    var actionUnloadEnergy = require("actionUnloadEnergy");
    var actionHarvestCollection = require("actionHarvestCollection");

    if(actionFlee(creep))
        return;
    if(actionRenew(creep))
        return;
    if(actionScavenge(creep))
      return;
    if(actionUnloadEnergy(creep))
        return;
    if(actionHarvestCollection(creep))
        return;
}
