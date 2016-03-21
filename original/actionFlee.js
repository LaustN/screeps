module.exports = function(creep){
    var hostiles = creep.pos.findInRange(FIND_HOSTILE_CREEPS,10);

    if(hostiles.length > 0){
        creep.memory.fleeing = true;
    }

    if(creep.memory.fleeing){
        var ensurehome = require("actionEnsureHome");
        ensurehome(creep);
        var destination = Game.getObjectById(creep.memory.home);
        if(creep.pos.getRangeTo(destination) <= 1){
            creep.memory.fleeing = false;
            return false;
        }
        creep.moveTo(destiantion);
        return true;
    }
    return false;
}
