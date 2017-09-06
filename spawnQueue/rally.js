module.exports = function(creep){
    var destination = creep;
    var localSpawns = creep.room.find(FIND_MY_SPAWNS);
    var rallyFlags = creep.room.find(FIND_FLAGS,{filter: function(flag){
        return flag.name == "Rally";
    }});
    if(rallyFlags && rallyFlags.length > 0){
        destination = rallyFlags[0];
    }
    else if(localSpawns && localSpawns.length>0){
        destination = localSpawns[0];
    }

    creep.moveTo(destination);
    if(creep.pos.getRangeTo(destination)<3){
        creep.drop(RESOURCE_ENERGY);
    }
}
