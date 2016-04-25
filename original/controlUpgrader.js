module.exports = function (creep) {
    var actionFlee = require("actionFlee");
    var actionRenew =  require("actionRenew");
    var actionCollectEnergy = require("actionCollectEnergy");
    var actionUpgradeControl = require("actionUpgradeControl");

    if(actionFlee(creep))
        return;
//    if(actionRenew(creep))
//        return;
    if(actionCollectEnergy(creep))
        return;
    if(actionUpgradeControl(creep))
        return;
}
