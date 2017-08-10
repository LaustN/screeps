module.exports = function (room) {
    console.log("spam!")
    room.visual.clear();
    var spawns  = room.find(FIND_MY_STRUCTURES, {filter: function(structure){
        console.log("the structure is " + JSON.stringify(structure));
        if(structure.structureType == STRUCTURE_SPAWN)
            return true;
        return false;
    }});
    for(var spawnkey in spawns) {
        console.log("spawnkey = " + spawnkey);
        var spawn  = spawns[spawnkey];
        room.visual.text(spawn.name + " obviously", spawn.pos);
    }
}
