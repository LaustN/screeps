module.exports = function (creep) {
    var actionFlee = require("actionFlee");
    var actionScavenge =  require("actionScavenge");
    var actionCollectEnergy = require("actionCollectEnergy");
    var actionBuild = require("actionBuild");
    var actionFortify = require("actionFortify");
    var actionUpgradeControl = require("actionUpgradeControl");

    if(actionFlee(creep))
        return;
    if(actionScavenge(creep))
        return;
    if(actionCollectEnergy(creep))
        return;
    if(actionBuild(creep))
        return;
    if(actionFortify(creep))
        return;
    if(actionUpgradeControl(creep))
        return;
}
