module.exports = function(creep){
    var spawn = Game.getObjectById(creep.memory.home);
    if(creep.ticksToLive < 100 || creep.memory.renewing){
        creep.memory.renewing = true;
        var renewMessage = spawn.renewCreep(creep);
        if( renewMessage == OK){
            return true;
        }
        if( renewMessage == ERR_NOT_IN_RANGE){
            creep.moveTo(spawn);
            return true;
        }
        else if(renewMessage == ERR_FULL){
            console.log(creep.name + " has been renewed");
            creep.memory.renewing = false;
        }
        else if(renewMessage == ERR_NOT_ENOUGH_RESOURCES){
            console.log(creep.name + " stopped renewing because spawn did not have energy for it");
            creep.memory.renewing = false;
        }
        else{
            return false;
            console.log("renewing did something unexpected:" + renewMessage);
        }

    }
    return false;
}
