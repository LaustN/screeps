module.exports = function (creep) {
    var actionFlee = require("actionFlee");
    var actionRenew =  require("actionRenew");
    var actionUnloadEnergy = require("actionUnloadEnergy");
    var actionHarvest = require("actionHarvest");

    if(actionFlee(creep))
        return;
    if(actionRenew(creep))
        return;
    if(actionUnloadEnergy(creep))
        return;
    if(actionHarvest(creep))
        return;
}
