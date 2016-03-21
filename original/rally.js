module.exports = function(creep){
    var destination = creep;
    var localSpawns = creep.room.find(FIND_MY_SPAWNS);
    var destinationFound = false;
    if(localSpawns && localSpawns.length > 0){
        var spawn = localSpawns[0];
        if(creep.ticksToLive < 100 || creep.memory.renewing){
            creep.memory.renewing = true;
            var renewMessage = spawn.renewCreep(creep);
            if( renewMessage == ERR_NOT_IN_RANGE){
                creep.moveTo(spawn);
                return;
            }
            if(renewMessage == ERR_FULL){
                console.log(creep.name + " has been renewed");
                creep.memory.renewing = false;
            }

        }

        if(spawn.memory.rallyFlag){
            var rallyFlags = creep.room.find(FIND_FLAGS,{filter: function(flag){
                return flag.name == spawn.memory.rallyFlag;
            }});

            if(rallyFlags.length > 0){
                destination = rallyFlags[0];
                destinationFound = true;
            }
        }

    }
    if(!destinationFound) {
        var rallyFlags = creep.room.find(FIND_FLAGS,{filter: function(flag){
            return flag.name == "Rally";
        }});
        if(rallyFlags){
            destination = rallyFlags[0];
        }

    }
    creep.moveTo(destination);
}
