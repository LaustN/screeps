module.exports = function (creep) {
    var actionFlee = require("actionFlee");
    var actionRenew =  require("actionRenew");
    var actionScavenge = require("actionScavenge");
    var actionHomeUnloadEnergy = require("actionHomeUnloadEnergy");
    var actionRemoteCollectEnergy = require("actionRemoteCollectEnergy");

    if(actionFlee(creep))
        return;
    if(actionRenew(creep))
        return;
    if(actionRemoteCollectEnergy(creep))
        return;
    if(actionHomeUnloadEnergy(creep))
        return;
}
