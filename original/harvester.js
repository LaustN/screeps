module.exports = function (creep) {
    var actionFlee = require("actionFlee");
    var actionScavenge =  require("actionScavenge");
    var actionUnloadEnergy = require("actionUnloadEnergy");
    var actionHarvest = require("actionHarvest");

    if(actionFlee(creep))
        return;
    if(actionScavenge(creep))
        return;
    if(actionUnloadEnergy(creep))
        return;
    if(actionHarvest(creep))
        return;
}
