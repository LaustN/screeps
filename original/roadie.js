module.exports = function (creep) {
    var actionFlee = require("actionFlee");
    var actionRenew =  require("actionRenew");
    var actionFlagRoadie = require("actionFlagRoadie");

    if(actionFlee(creep))
        return;
    if(actionRenew(creep))
        return;
    if(actionFlagRoadie(creep))
        return;
}
