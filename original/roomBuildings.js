module.exports = function (room) {
    room.visual.clear();
    var spawns  = room.find(FIND_MY_STRUCTURES, {filter: function(structure){
        if(structure.type == STRUCTURE_SPAWN)
            return true;
        return false;
    }});
    for(var spawnkey in spawns) {
        var spawn  = spawns[spawnkey];
        room.visual.text(spawn.name, spawn.pos);
    }



}
